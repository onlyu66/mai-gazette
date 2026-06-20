'use client';

import React, { useState, useRef, useCallback, ChangeEvent } from 'react';
import * as htmlToImage from 'html-to-image';
import toast from 'react-hot-toast';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

/* ─── Types ─────────────────────────────────────────── */
type SlotCount = 1 | 2 | 3 | 4 | 6;

interface Theme {
  id: string;
  label: string;
  emoji: string;
  selectorBg: string;

  cardStyle: React.CSSProperties;
  headerText: string;
  headerTextColor: string;

  gridWrapperBg: string;
  gridInnerBorder: string;

  message: string;
  messageColor: string;

  nameColor: string;
  dateColor: string;
  bottomBoxBg: string;

  decorLeft: string;
  decorRight: string;

  /** Two accent stops driving every animated element: ribbon, glow, sweep, tape, sparkles */
  accent: string;
  accent2: string;
  /** true = header ribbon sits on a light/translucent surface, so shimmer text stays colourful instead of going white */
  lightHeader?: boolean;
  /** true = dark card background, so the shine sweep uses 'screen' blend instead of 'overlay' */
  dark?: boolean;
  logo?: string;
}

/* ─── small color helper ─────────────────────────────── */
function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ─── Themes ────────────────────────────────────────── */
const THEMES: Theme[] = [
  {
    id: 'caro-pink', label: 'Caro Hồng', emoji: '🎀',
    selectorBg: 'linear-gradient(135deg, #fbcfe8, #f472b6)',
    cardStyle: {
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(90deg, rgba(244,114,182,0.1) 50%, transparent 50%), linear-gradient(rgba(244,114,182,0.1) 50%, transparent 50%)',
      backgroundSize: '24px 24px',
    },
    headerText: 'LỄ TỐT NGHIỆP 2026', headerTextColor: '#fff',
    gridWrapperBg: '#ffffff', gridInnerBorder: '2px solid #fbcfe8',
    message: 'Cảm ơn cậu đã luôn đồng hành cùng Mai trên chặng đường rực rỡ này! 🌸',
    messageColor: '#be185d', nameColor: '#9d174d', dateColor: '#db2777', bottomBoxBg: 'rgba(253,242,248,0.9)',
    decorLeft: '🎀', decorRight: '✨',
    accent: '#f472b6', accent2: '#fda4af',
  },
  {
    id: 'polka-dots', label: 'Chấm Bi', emoji: '🍡',
    selectorBg: 'linear-gradient(135deg, #fed7aa, #fdba74)',
    cardStyle: {
      backgroundColor: '#fff7ed',
      backgroundImage: 'radial-gradient(#fdba74 2.5px, transparent 2.5px)',
      backgroundSize: '16px 16px',
    },
    headerText: 'KÝ ỨC NGỌT NGÀO', headerTextColor: '#ea580c',
    gridWrapperBg: '#ffffff', gridInnerBorder: '2px solid #ffedd5',
    message: 'Nụ cười của cậu là điều tuyệt vời nhất trong ngày hôm nay. Yêu thương! 💕',
    messageColor: '#c2410c', nameColor: '#9a3412', dateColor: '#ea580c', bottomBoxBg: '#fff',
    decorLeft: '🍡', decorRight: '🌷',
    accent: '#f59e0b', accent2: '#fde047', lightHeader: true,
  },
  {
    id: 'dreamy-sky', label: 'Bầu Trời Mơ', emoji: '☁️',
    selectorBg: 'linear-gradient(135deg, #bfdbfe, #a78bfa)',
    cardStyle: {
      background: 'linear-gradient(180deg, #e0e7ff 0%, #fae8ff 50%, #fdf2f8 100%)',
    },
    headerText: 'DREAM BIG FLY HIGH', headerTextColor: '#6d28d9',
    gridWrapperBg: 'rgba(255,255,255,0.85)', gridInnerBorder: '1px solid #ddd6fe',
    message: 'Hành trình vạn dặm bắt đầu từ hôm nay. Cùng nhau bay thật cao nhé! 🕊️',
    messageColor: '#5b21b6', nameColor: '#4c1d95', dateColor: '#7c3aed', bottomBoxBg: 'rgba(255,255,255,0.7)',
    decorLeft: '☁️', decorRight: '✨',
    accent: '#a78bfa', accent2: '#93c5fd', lightHeader: true,
  },
  {
    id: 'vintage-grid', label: 'Giấy Ô Ly', emoji: '📝',
    selectorBg: 'linear-gradient(135deg, #fde047, #f59e0b)',
    cardStyle: {
      backgroundColor: '#fefce8',
      backgroundImage: 'linear-gradient(#fef08a 1px, transparent 1px), linear-gradient(90deg, #fef08a 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    headerText: 'TRANG LƯU BÚT 2026', headerTextColor: '#fefce8',
    gridWrapperBg: '#fefce8', gridInnerBorder: '2px solid #ca8a04',
    message: 'Thanh xuân trôi qua như một cái chớp mắt, nhưng kỷ niệm sẽ còn mãi ở đây. 📷',
    messageColor: '#854d0e', nameColor: '#713f12', dateColor: '#a16207', bottomBoxBg: '#fef9c3',
    decorLeft: '📝', decorRight: '🕰️',
    accent: '#ca8a04', accent2: '#fde047',
  },
  {
    id: 'starry-night', label: 'Sao Đêm', emoji: '🌟',
    selectorBg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
    cardStyle: {
      backgroundColor: '#1e1b4b',
      backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px',
    },
    headerText: 'NIGHT OF SHINING STARS', headerTextColor: '#e0e7ff',
    gridWrapperBg: '#312e81', gridInnerBorder: '1px solid #4f46e5',
    message: 'Cậu là một vì sao sáng nhất trong dải ngân hà thanh xuân của Mai. ✨',
    messageColor: '#c7d2fe', nameColor: '#e0e7ff', dateColor: '#a5b4fc', bottomBoxBg: '#3730a3',
    decorLeft: '🌟', decorRight: '🌙',
    accent: '#818cf8', accent2: '#c4b5fd', dark: true,
  },
  {
    id: 'flower-garden', label: 'Vườn Xuân', emoji: '🌷',
    selectorBg: 'linear-gradient(135deg, #d9f99d, #84cc16)',
    cardStyle: {
      backgroundColor: '#f7fee7',
      backgroundImage: 'radial-gradient(#bef264 2.5px, transparent 2.5px)',
      backgroundSize: '20px 20px',
    },
    headerText: 'KHU VƯỜN THANH XUÂN', headerTextColor: '#fff',
    gridWrapperBg: '#fff', gridInnerBorder: '2px dashed #a3e635',
    message: 'Chúc chúng ta của sau này, ngày nào cũng nở rộ rực rỡ như những đóa hoa! 💐',
    messageColor: '#4d7c0f', nameColor: '#3f6212', dateColor: '#65a30d', bottomBoxBg: '#ecfccb',
    decorLeft: '🌷', decorRight: '🍀',
    accent: '#84cc16', accent2: '#bef264',
  },
  {
    id: 'ajc-pride', label: 'Tự Hào AJC', emoji: '🎓',
    selectorBg: 'linear-gradient(135deg, #fca5a5, #dc2626)',
    cardStyle: {
      backgroundColor: '#fef2f2',
      backgroundImage: 'radial-gradient(#fecaca 2px, transparent 2px)',
      backgroundSize: '16px 16px',
    },
    headerText: 'BÁO CHÍ & TUYÊN TRUYỀN', headerTextColor: '#fff',
    gridWrapperBg: '#fff', gridInnerBorder: '2px solid #dc2626',
    message: 'Bản lĩnh, sáng tạo, cống hiến. Mãi tự hào là một phần của AJC! 🎙️',
    messageColor: '#7f1d1d', nameColor: '#7f1d1d', dateColor: '#b91c1c', bottomBoxBg: '#fee2e2',
    decorLeft: '🏛️', decorRight: '📰',
    accent: '#dc2626', accent2: '#f87171',
    logo: '/ajc-logo.webp',
  },
];

const GRIDS: { value: SlotCount; label: string }[] = [
  { value: 1, label: '1 Ảnh (Đơn)' },
  { value: 2, label: '2 Ảnh (Đôi)' },
  { value: 3, label: '3 Ảnh (Polaroid)' },
  { value: 4, label: '4 Ảnh (Lưới 2x2)' },
  { value: 6, label: '6 Ảnh (Lưới 2x3)' },
];

/* ─── One signature concept, executed consistently:
   the card behaves like a holographic photocard sticker — it floats with a
   soft tilt, a foil-shine sweep crosses it on a loop, two washi-tape strips
   pin its top corners, a colored halo breathes around the edge, and a
   handful of accent-colored motes drift up past it. Per theme, only the
   accent colors / pattern / message change — the motion language stays one
   idea, not seven different gimmicks. ───────────────────────────────── */
const ANIMATION_CSS = `
@keyframes pb-float {
  0%, 100% { transform: rotate(-1.4deg) translateY(0px); }
  50% { transform: rotate(-1.4deg) translateY(-9px); }
}
@keyframes pb-glow-pulse {
  0%, 100% { box-shadow: 0 30px 60px -15px rgba(0,0,0,0.35), 0 0 0px 0px var(--pb-glow); }
  50% { box-shadow: 0 30px 60px -15px rgba(0,0,0,0.35), 0 0 55px 12px var(--pb-glow); }
}
@keyframes pb-sweep-move {
  0%   { transform: translate3d(-60%, -10%, 0) rotate(14deg); }
  100% { transform: translate3d(60%, 10%, 0) rotate(14deg); }
}
@keyframes pb-mote-drift {
  0%   { transform: translate(0, 10px) scale(0.5) rotate(0deg); opacity: 0; }
  18%  { opacity: 1; }
  82%  { opacity: 1; }
  100% { transform: translate(var(--pb-dx), -180px) scale(1.25) rotate(50deg); opacity: 0; }
}
@keyframes pb-tape-settle {
  0% { transform: rotate(var(--pb-tape-rot)) scale(0.8); opacity: 0; }
  100% { transform: rotate(var(--pb-tape-rot)) scale(1); opacity: 1; }
}
@keyframes pb-bloom {
  0% { transform: scale(0.85) rotate(-3deg); opacity: 0; filter: blur(6px); }
  60% { transform: scale(1.03) rotate(0.5deg); opacity: 1; filter: blur(0); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
}
@keyframes pb-shimmer-text {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes pb-rec-pulse {
  0%, 100% { opacity: 1; } 50% { opacity: 0.35; }
}
.pb-card-anim { animation: pb-float 5.5s ease-in-out infinite, pb-glow-pulse 3.2s ease-in-out infinite; }
.pb-sweep { position: absolute; top: -40%; left: -10%; width: 55%; height: 180%;
  background: linear-gradient(100deg, transparent 10%, rgba(255,255,255,0.75) 50%, transparent 90%);
  animation: pb-sweep-move 3.6s ease-in-out infinite alternate; pointer-events: none; }
.pb-sweep.is-overlay { mix-blend-mode: overlay; }
.pb-sweep.is-screen { mix-blend-mode: screen; opacity: 0.25; }
.pb-mote { position: absolute; pointer-events: none; animation: pb-mote-drift 5.5s ease-in infinite; will-change: transform, opacity; filter: drop-shadow(0 0 4px rgba(255,255,255,0.6)); }
.pb-tape { position: absolute; animation: pb-tape-settle 0.5s ease-out backwards; }
.pb-slot-img { animation: pb-bloom 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.pb-shimmer-text { background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: pb-shimmer-text 2.6s linear infinite; }
`;

/* ─── Washi tape corner ───────────────────────────────── */
function WashiTape({ accent, side }: { accent: string; side: 'left' | 'right' }) {
  const rot = side === 'left' ? '-8deg' : '7deg';
  return (
    <div
      className="pb-tape"
      style={{
        top: '-14px',
        [side]: '26px',
        width: '74px',
        height: '26px',
        background: `repeating-linear-gradient(45deg, ${hexToRgba(accent, 0.55)} 0px, ${hexToRgba(accent, 0.55)} 6px, ${hexToRgba('#ffffff', 0.45)} 6px, ${hexToRgba('#ffffff', 0.45)} 12px)`,
        boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
        ['--pb-tape-rot' as any]: rot,
        borderRadius: '2px',
        zIndex: 5,
      } as React.CSSProperties}
    />
  );
}

/* ─── Drifting accent-colored motes ──────────────────── */
function Motes({ glyph, accent }: { glyph: string; accent: string }) {
  const motes = [
    { left: '6%', delay: '0s', size: '20px', dx: '14px' },
    { left: '22%', delay: '1.1s', size: '14px', dx: '-18px' },
    { left: '40%', delay: '2.4s', size: '22px', dx: '10px' },
    { left: '58%', delay: '0.5s', size: '15px', dx: '-12px' },
    { left: '76%', delay: '1.8s', size: '24px', dx: '16px' },
    { left: '90%', delay: '3.1s', size: '16px', dx: '-10px' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit', zIndex: 4 }}>
      {motes.map((m, i) => (
        <span
          key={i}
          className="pb-mote"
          style={{
            left: m.left, bottom: '4%', fontSize: m.size,
            animationDelay: m.delay,
            color: accent,
            ['--pb-dx' as any]: m.dx,
          } as React.CSSProperties}
        >
          {i % 2 === 0 ? glyph : '✨'}
        </span>
      ))}
    </div>
  );
}

/* ─── Photo Slot (inside card) ───────────────────────── */
function PhotoSlot({
  img, index, selected, onClick, innerBorder
}: {
  img: string; index: number; selected: boolean; onClick: () => void; innerBorder: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%', height: '100%', position: 'relative',
        cursor: 'pointer', overflow: 'hidden',
        border: innerBorder, borderRadius: '6px',
        background: img ? '#000' : 'rgba(0,0,0,0.03)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    >
      {img ? (
        <img key={img} className="pb-slot-img" src={img} alt={`Slot ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ textAlign: 'center', opacity: 0.4 }}>
          <div style={{ fontSize: '24px' }}>📷</div>
          <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase' }}>
            Slot {index + 1}
          </div>
        </div>
      )}
      {selected && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(244,63,94,0.15)',
          border: '4px solid #f43f5e',
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 10px rgba(244,63,94,0.5)'
        }} />
      )}
    </div>
  );
}

/* ─── Photo Grid (layouts) ───────────────────────────── */
function PhotoGrid({
  slots, images, selectedSlot, onSlotClick, innerBorder
}: {
  slots: SlotCount;
  images: string[];
  selectedSlot: number;
  onSlotClick: (i: number) => void;
  innerBorder: string;
}) {
  const renderSlot = (i: number) => (
    <PhotoSlot key={i} img={images[i] ?? ''} index={i}
      selected={selectedSlot === i} onClick={() => onSlotClick(i)} innerBorder={innerBorder} />
  );

  const gap = '8px';

  switch (slots) {
    case 1:
      return <div style={{ width: '100%', aspectRatio: '1/1' }}>{renderSlot(0)}</div>;
    case 2:
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, width: '100%', aspectRatio: '4/3' }}>
          {renderSlot(0)}{renderSlot(1)}
        </div>
      );
    case 3:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
          <div style={{ width: '100%', aspectRatio: '2/1' }}>{renderSlot(0)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, aspectRatio: '2/1' }}>
            {renderSlot(1)}{renderSlot(2)}
          </div>
        </div>
      );
    case 4:
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap, width: '100%', aspectRatio: '1/1' }}>
          {[0, 1, 2, 3].map(renderSlot)}
        </div>
      );
    case 6:
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap, width: '100%', aspectRatio: '2/3' }}>
          {[0, 1, 2, 3, 4, 5].map(renderSlot)}
        </div>
      );
  }
}

/* ─── Downloadable Card ──────────────────────────────── */
function PhotoBoothCard({
  theme, slots, images, selectedSlot, onSlotClick, name, cardRef, animate,
}: {
  theme: Theme;
  slots: SlotCount;
  images: string[];
  selectedSlot: number;
  onSlotClick: (i: number) => void;
  name: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  animate: boolean;
}) {
  const ribbonGradient = `linear-gradient(120deg, ${theme.accent}, ${theme.accent2}, ${theme.accent})`;
  const shimmerGradient = theme.lightHeader
    ? `linear-gradient(120deg, ${theme.headerTextColor}, #ffffff, ${theme.headerTextColor})`
    : `linear-gradient(120deg, ${theme.accent2}, #ffffff, ${theme.accent2})`;

  return (
    <div
      ref={cardRef}
      className={`w-full max-w-[380px] ${animate ? 'pb-card-anim' : ''}`}
      style={{
        ...theme.cardStyle,
        ['--pb-glow' as any]: hexToRgba(theme.accent, 0.55),
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderRadius: '26px',
        border: `10px solid ${hexToRgba(theme.accent, 0.12)}`,
        boxShadow: '0 30px 60px -15px rgba(0,0,0,0.35)',
        position: 'relative',
        fontFamily: 'var(--font-jakarta), sans-serif',
        userSelect: 'none',
        padding: '26px 22px 22px',
      }}
    >
      {animate && <div className={`pb-sweep ${theme.dark ? 'is-screen' : 'is-overlay'}`} />}
      {animate && <Motes glyph={theme.decorLeft} accent={theme.accent} />}
      <WashiTape accent={theme.accent} side="left" />
      <WashiTape accent={theme.accent2} side="right" />

      {/* Decorative corner glyphs sit on top of the tape */}
      <div style={{ position: 'absolute', top: '22px', left: '16px', fontSize: '24px', zIndex: 10 }}>{theme.decorLeft}</div>
      <div style={{ position: 'absolute', top: '22px', right: '16px', fontSize: '24px', zIndex: 10 }}>{theme.decorRight}</div>

      {/* Header ribbon */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '22px', marginTop: theme.logo ? '6px' : '14px', position: 'relative', zIndex: 6 }}>
        {theme.logo && (
          <div style={{
            background: '#fff', borderRadius: '50%', padding: '4px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: `2px solid ${theme.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '-16px', zIndex: 10, position: 'relative',
          }}>
            <img src={theme.logo} alt="Logo" style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '50%' }} crossOrigin="anonymous" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
        )}

        <div
          style={{
            backgroundImage: ribbonGradient,
            backgroundSize: '200% 100%',
            width: '85%',
            padding: theme.logo ? '24px 18px 10px' : '13px 18px',
            textAlign: 'center',
            clipPath: 'polygon(0% 0%, 100% 0%, 93% 50%, 100% 100%, 0% 100%, 7% 50%)',
            boxShadow: `0 6px 16px ${hexToRgba(theme.accent, 0.35)}`,
          }}
        >
          <h3
            className={animate ? 'pb-shimmer-text' : ''}
            style={{
              fontSize: '14.5px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0,
              fontFamily: 'var(--font-cinzel), serif',
              color: animate ? undefined : theme.headerTextColor,
              backgroundImage: animate ? shimmerGradient : undefined,
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.45))',
            }}
          >
            {theme.headerText}
          </h3>
        </div>
      </div>

      {/* Photo Grid Wrapper */}
      <div style={{
        background: theme.gridWrapperBg,
        padding: '12px',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 3,
      }}>
        <PhotoGrid slots={slots} images={images} selectedSlot={selectedSlot} onSlotClick={onSlotClick} innerBorder={theme.gridInnerBorder} />
      </div>

      {/* Lời Cảm Ơn của Mai */}
      <div style={{ marginTop: '22px', textAlign: 'center', padding: '0 8px', position: 'relative', zIndex: 3 }}>
        <p style={{
          fontSize: '15px', lineHeight: '1.6', color: theme.messageColor,
          fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic',
          margin: 0, textShadow: '0 1px 2px rgba(255,255,255,0.5)'
        }}>
          "{theme.message}"
        </p>
        <p style={{
          fontSize: '11px', fontWeight: 800, marginTop: '8px', color: theme.messageColor,
          opacity: 0.8, letterSpacing: '0.15em', textTransform: 'uppercase'
        }}>
          — Phan Ngọc Mai —
        </p>
      </div>

      {/* Presenter Name & Date */}
      <div style={{
        marginTop: '18px',
        padding: '14px 20px',
        background: theme.bottomBoxBg,
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        position: 'relative',
        zIndex: 3,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', color: theme.dateColor, textTransform: 'uppercase' }}>Khách mời</span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: theme.nameColor, fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}>
            {name.trim() || 'Bạn Thân'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', color: theme.dateColor, textTransform: 'uppercase' }}>Kỷ niệm</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: theme.dateColor, fontFamily: 'var(--font-mono)' }}>
            28 / 06 / 2026
          </span>
        </div>
      </div>

    </div>
  );
}

/* ─── Main PhotoBooth Component ──────────────────────── */
export default function PressStudio() {
  const [selectedThemeId, setSelectedThemeId] = useState('caro-pink');
  const [selectedGrid, setSelectedGrid] = useState<SlotCount>(4);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [name, setName] = useState('');
  const [images, setImages] = useState<string[]>(Array(6).fill(''));
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = THEMES.find(t => t.id === selectedThemeId) ?? THEMES[0];
  const isGridFull = !images.slice(0, selectedGrid).some(img => !img);

  const changeGrid = (slots: SlotCount) => {
    setSelectedGrid(slots);
    setSelectedSlot(0);
  };

  const openCamera = async () => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch { toast.error('Không thể kết nối camera. Vui lòng cấp quyền truy cập.'); }
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!stream) return toast.error('Hãy bật camera trước!');
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/png', 0.9);
    setImages(prev => { const next = [...prev]; next[selectedSlot] = dataUrl; return next; });

    if (selectedSlot < selectedGrid - 1) {
      setSelectedSlot(selectedSlot + 1);
    }
  }, [stream, selectedSlot, selectedGrid]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setImages(prev => { const next = [...prev]; next[selectedSlot] = result; return next; });
      if (selectedSlot < selectedGrid - 1) setSelectedSlot(selectedSlot + 1);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearSlot = () => {
    setImages(prev => { const next = [...prev]; next[selectedSlot] = ''; return next; });
  };

  const resetAll = () => {
    setImages(Array(6).fill(''));
    setSelectedSlot(0);
    setName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadStatic = async () => {
    if (!cardRef.current || !isGridFull) return;

    const currentSlot = selectedSlot;
    setSelectedSlot(-1);
    await new Promise(r => setTimeout(r, 100));

    htmlToImage.toPng(cardRef.current, { pixelRatio: 3, quality: 1.0 })
      .then(url => {
        const a = document.createElement('a');
        a.download = `Photobooth_Mai_${theme.id}.png`;
        a.href = url; a.click();

        toast.success('🎉 Đã tải ảnh siêu nét thành công!');
        resetAll();
      })
      .catch(() => {
        toast.error('Lỗi tải ảnh, hãy thử lại!');
        setSelectedSlot(currentSlot);
      });
  };

  /* Animated GIF: replays the card's own ambient motion (float, glow, shine
     sweep, drifting motes, shimmering ribbon) and bakes it into a looping
     file using gifenc — no worker setup needed, runs on the main thread. */
  const downloadAnimated = async () => {
    if (!cardRef.current || !isGridFull) return;

    const currentSlot = selectedSlot;
    setSelectedSlot(-1);
    setIsExporting(true);
    setExportProgress(0);
    await new Promise(r => setTimeout(r, 120));

    const FRAME_COUNT = 24;
    const FRAME_DELAY_MS = 90;

    try {
      const gif = GIFEncoder();
      let dims: { width: number; height: number } | null = null;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const canvas = await htmlToImage.toCanvas(cardRef.current, { pixelRatio: 2, quality: 1 });
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        const { width, height } = canvas;
        dims = { width, height };
        const { data } = ctx.getImageData(0, 0, width, height);

        const palette = quantize(data, 96);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, width, height, { palette, delay: FRAME_DELAY_MS });

        setExportProgress(Math.round(((i + 1) / FRAME_COUNT) * 100));
        await new Promise(r => setTimeout(r, FRAME_DELAY_MS));
      }

      if (!dims) throw new Error('No frames captured');
      gif.finish();

      const blob = new Blob([gif.bytes() as unknown as BlobPart], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = `Photobooth_Mai_${theme.id}_animated.gif`;
      a.href = url; a.click();
      URL.revokeObjectURL(url);

      toast.success('🎉 Đã tải ảnh động GIF thành công!');
      resetAll();
    } catch {
      toast.error('Lỗi tạo ảnh động, hãy thử lại!');
      setSelectedSlot(currentSlot);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <section id="studio-anh" className="py-20 border-t" style={{ background: 'var(--bg-section-2)', borderColor: 'var(--border-section)' }}>
      <style dangerouslySetInnerHTML={{ __html: ANIMATION_CSS }} />
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12 space-y-2">
          <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400">✦ Studio Chụp Ảnh Kỷ Niệm ✦</span>
          <h2 className="font-nghe-thuat italic text-4xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Photobooth Thanh Xuân
          </h2>
          <p className="text-sm text-rose-400/80 max-w-md mx-auto">
            Tự tay thiết kế và lưu giữ những tấm ảnh photobooth siêu xinh xắn 📸
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* LEFT: Controls */}
          <div className="lg:col-span-5 space-y-6">

            <div className="w-full aspect-square rounded-[32px] overflow-hidden relative shadow-inner" style={{ background: '#000', border: '8px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
              <canvas ref={canvasRef} className="hidden" />
              {stream ? (
                <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg" style={{ animation: 'pb-rec-pulse 1.4s ease-in-out infinite' }}>
                  <div className="w-2 h-2 rounded-full bg-white" /> REC
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                  <span className="text-4xl mb-2">📸</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Camera Offline</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={openCamera} className="flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 transition shadow-lg">
                  1. Bật Camera
                </button>
                <button onClick={capturePhoto} className="flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition shadow-lg flex items-center justify-center gap-2">
                  <span>📸</span> Chụp (Slot {selectedSlot + 1})
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border-2 border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition">
                  Tải Ảnh Lên
                </button>
                <button onClick={clearSlot} disabled={!images[selectedSlot]}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border-2 border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition disabled:opacity-40">
                  Xóa Slot {selectedSlot + 1}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>

            <div className="backdrop-blur-sm p-6 rounded-[24px] border shadow-sm space-y-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>

              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">1. Số Lượng Ảnh (Grid)</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRIDS.map(g => (
                    <button key={g.value} onClick={() => changeGrid(g.value)}
                      className={`px-2 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all border-2 text-center ${selectedGrid === g.value ? 'border-rose-500 bg-rose-50 text-rose-600' : 'text-gray-500 hover:border-rose-300'
                        }`}
                      style={{ background: selectedGrid === g.value ? '' : 'var(--bg-card)', borderColor: selectedGrid === g.value ? '' : 'var(--border-card)' }}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">2. Chủ Đề Khung (Theme)</label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map(t => (
                    <button key={t.id} onClick={() => setSelectedThemeId(t.id)}
                      className={`relative flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border-2 transition-all ${selectedThemeId === t.id ? 'border-rose-500 shadow-md scale-105' : 'hover:border-rose-300'
                        }`}
                      style={selectedThemeId === t.id ? { background: t.selectorBg } : { background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <span className="text-lg">{t.emoji}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${selectedThemeId === t.id ? 'text-white' : 'text-gray-600'}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">3. Tên Kỷ Niệm</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="w-full px-4 py-3 rounded-xl text-sm border-2 border-rose-100 focus:outline-none focus:border-rose-400 bg-white text-gray-800 font-medium" />
              </div>

            </div>

            <div className="space-y-3">
              <button
                onClick={downloadStatic}
                disabled={!isGridFull || isExporting}
                className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-white transition-all shadow-xl hover:shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: isGridFull ? 'linear-gradient(135deg, #be123c, #9f1239)' : 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }}
              >
                {isGridFull ? '📥 Tải Ảnh Tĩnh (PNG)' : `⚠️ Vui lòng chụp/tải đủ ${selectedGrid} ảnh`}
              </button>

              <button
                onClick={downloadAnimated}
                disabled={!isGridFull || isExporting}
                className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: isGridFull ? 'linear-gradient(135deg, #7c3aed, #4c1d95)' : 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }}
              >
                {isExporting ? `✨ Đang tạo ảnh động… ${exportProgress}%` : '🪄 Tải Ảnh Động (GIF)'}
              </button>
              {isExporting && (
                <div className="w-full h-1.5 rounded-full bg-violet-100 overflow-hidden">
                  <div className="h-full bg-violet-500 transition-all" style={{ width: `${exportProgress}%` }} />
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-7 flex justify-center items-start lg:sticky lg:top-24 w-full">
            <div className="w-full flex flex-col items-center pb-8 pt-2">
              <div className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse text-center">
                Click vào slot bên dưới để chọn vị trí ảnh
              </div>

              <PhotoBoothCard
                theme={theme}
                slots={selectedGrid}
                images={images}
                selectedSlot={selectedSlot}
                onSlotClick={setSelectedSlot}
                name={name}
                cardRef={cardRef}
                animate={isExporting || selectedSlot !== -1}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}