import React from 'react';
import { Theme, SlotCount } from './types';
import { hexToRgba } from './constants';
import WashiTape from './WashiTape';
import Motes from './Motes';
import PhotoGrid from './PhotoGrid';

export default function PhotoBoothCard({
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          &quot;{theme.message}&quot;
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
