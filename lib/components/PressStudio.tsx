'use client';

import React, { useState, useRef, useCallback, ChangeEvent } from 'react';
import * as htmlToImage from 'html-to-image';

/* ─── Types ─────────────────────────────────────────── */
type SlotCount = 1 | 2 | 3 | 4 | 6;

interface Theme {
  id: string;
  label: string;
  emoji: string;
  selectorBg: string;
  
  cardStyle: React.CSSProperties;
  headerStyle: React.CSSProperties;
  headerText: string;
  
  gridWrapperBg: string;
  gridInnerBorder: string;
  
  message: string;
  messageColor: string;
  
  nameColor: string;
  dateColor: string;
  bottomBoxBg: string;
  
  decorLeft: string;
  decorRight: string;
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
      border: '10px solid #fdf2f8',
    },
    headerStyle: {
      background: '#f472b6', color: '#fff', borderRadius: '12px', padding: '14px',
      boxShadow: '4px 4px 0px #be185d'
    },
    headerText: 'LỄ TỐT NGHIỆP 2026',
    gridWrapperBg: '#ffffff', gridInnerBorder: '2px solid #fbcfe8',
    message: 'Cảm ơn cậu đã luôn đồng hành cùng Mai trên chặng đường rực rỡ này! 🌸',
    messageColor: '#be185d', nameColor: '#9d174d', dateColor: '#db2777', bottomBoxBg: 'rgba(253,242,248,0.9)',
    decorLeft: '🎀', decorRight: '✨',
  },
  {
    id: 'polka-dots', label: 'Chấm Bi', emoji: '🍡',
    selectorBg: 'linear-gradient(135deg, #fed7aa, #fdba74)',
    cardStyle: {
      backgroundColor: '#fff7ed',
      backgroundImage: 'radial-gradient(#fdba74 2.5px, transparent 2.5px)',
      backgroundSize: '16px 16px',
      border: '10px solid #ffedd5',
    },
    headerStyle: {
      background: '#fff', color: '#ea580c', border: '2px dashed #fdba74', borderRadius: '100px', padding: '12px',
    },
    headerText: 'KÝ ỨC NGỌT NGÀO',
    gridWrapperBg: '#ffffff', gridInnerBorder: '2px solid #ffedd5',
    message: 'Nụ cười của cậu là điều tuyệt vời nhất trong ngày hôm nay. Yêu thương! 💕',
    messageColor: '#c2410c', nameColor: '#9a3412', dateColor: '#ea580c', bottomBoxBg: '#fff',
    decorLeft: '🍡', decorRight: '🌷',
  },
  {
    id: 'dreamy-sky', label: 'Bầu Trời Mơ', emoji: '☁️',
    selectorBg: 'linear-gradient(135deg, #bfdbfe, #a78bfa)',
    cardStyle: {
      background: 'linear-gradient(180deg, #e0e7ff 0%, #fae8ff 50%, #fdf2f8 100%)',
      border: '10px solid #fff',
    },
    headerStyle: {
      background: 'rgba(255,255,255,0.7)', color: '#6d28d9', borderRadius: '16px', padding: '14px',
      border: '1px solid #ddd6fe',
    },
    headerText: 'DREAM BIG FLY HIGH',
    gridWrapperBg: 'rgba(255,255,255,0.85)', gridInnerBorder: '1px solid #ddd6fe',
    message: 'Hành trình vạn dặm bắt đầu từ hôm nay. Cùng nhau bay thật cao nhé! 🕊️',
    messageColor: '#5b21b6', nameColor: '#4c1d95', dateColor: '#7c3aed', bottomBoxBg: 'rgba(255,255,255,0.7)',
    decorLeft: '☁️', decorRight: '✨',
  },
  {
    id: 'vintage-grid', label: 'Giấy Ô Ly', emoji: '📝',
    selectorBg: 'linear-gradient(135deg, #fde047, #f59e0b)',
    cardStyle: {
      backgroundColor: '#fefce8',
      backgroundImage: 'linear-gradient(#fef08a 1px, transparent 1px), linear-gradient(90deg, #fef08a 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      border: '10px solid #fffbeb',
    },
    headerStyle: {
      background: '#ca8a04', color: '#fefce8', borderRadius: '4px', padding: '12px',
      boxShadow: 'inset 0 0 0 2px #fefce8',
    },
    headerText: 'TRANG LƯU BÚT 2026',
    gridWrapperBg: '#fefce8', gridInnerBorder: '2px solid #ca8a04',
    message: 'Thanh xuân trôi qua như một cái chớp mắt, nhưng kỷ niệm sẽ còn mãi ở đây. 📷',
    messageColor: '#854d0e', nameColor: '#713f12', dateColor: '#a16207', bottomBoxBg: '#fef9c3',
    decorLeft: '📝', decorRight: '🕰️',
  },
  {
    id: 'starry-night', label: 'Sao Đêm', emoji: '🌟',
    selectorBg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
    cardStyle: {
      backgroundColor: '#1e1b4b',
      backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px',
      border: '10px solid #312e81',
    },
    headerStyle: {
      background: '#3730a3', color: '#e0e7ff', borderRadius: '24px', padding: '14px',
      border: '1px solid #4f46e5'
    },
    headerText: 'NIGHT OF SHINING STARS',
    gridWrapperBg: '#312e81', gridInnerBorder: '1px solid #4f46e5',
    message: 'Cậu là một vì sao sáng nhất trong dải ngân hà thanh xuân của Mai. ✨',
    messageColor: '#c7d2fe', nameColor: '#e0e7ff', dateColor: '#a5b4fc', bottomBoxBg: '#3730a3',
    decorLeft: '🌟', decorRight: '🌙',
  },
  {
    id: 'flower-garden', label: 'Vườn Xuân', emoji: '🌷',
    selectorBg: 'linear-gradient(135deg, #d9f99d, #84cc16)',
    cardStyle: {
      backgroundColor: '#f7fee7',
      backgroundImage: 'radial-gradient(#bef264 2.5px, transparent 2.5px)',
      backgroundSize: '20px 20px',
      border: '10px solid #ecfccb',
    },
    headerStyle: {
      background: '#65a30d', color: '#fff', borderRadius: '8px', padding: '14px',
    },
    headerText: 'KHU VƯỜN THANH XUÂN',
    gridWrapperBg: '#fff', gridInnerBorder: '2px dashed #a3e635',
    message: 'Chúc chúng ta của sau này, ngày nào cũng nở rộ rực rỡ như những đóa hoa! 💐',
    messageColor: '#4d7c0f', nameColor: '#3f6212', dateColor: '#65a30d', bottomBoxBg: '#ecfccb',
    decorLeft: '🌷', decorRight: '🍀',
  },
];

const GRIDS: { value: SlotCount; label: string }[] = [
  { value: 1, label: '1 Ảnh (Đơn)' },
  { value: 2, label: '2 Ảnh (Đôi)' },
  { value: 3, label: '3 Ảnh (Polaroid)' },
  { value: 4, label: '4 Ảnh (Lưới 2x2)' },
  { value: 6, label: '6 Ảnh (Lưới 2x3)' },
];

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
        border: innerBorder,
        background: img ? '#000' : 'rgba(0,0,0,0.03)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    >
      {img ? (
        <img src={img} alt={`Slot ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05) saturate(1.1)' }} />
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
  theme, slots, images, selectedSlot, onSlotClick, name, cardRef,
}: {
  theme: Theme;
  slots: SlotCount;
  images: string[];
  selectedSlot: number;
  onSlotClick: (i: number) => void;
  name: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={cardRef}
      style={{
        width: '380px', // Wider card for better grid display
        ...theme.cardStyle,
        boxSizing: 'border-box',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
        position: 'relative',
        fontFamily: 'var(--font-jakarta), sans-serif',
        userSelect: 'none',
        padding: '24px', // Safe padding around elements
      }}
    >
      {/* Decorative top corners */}
      <div style={{ position: 'absolute', top: '16px', left: '20px', fontSize: '24px', opacity: 0.8 }}>{theme.decorLeft}</div>
      <div style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '24px', opacity: 0.8 }}>{theme.decorRight}</div>

      {/* Header Box */}
      <div style={{ ...theme.headerStyle, textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
        <h3 style={{ 
          color: theme.headerStyle.color, fontSize: '15px', fontWeight: 900, 
          letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0,
          fontFamily: 'var(--font-cinzel), serif'
        }}>
          {theme.headerText}
        </h3>
      </div>

      {/* Photo Grid Wrapper */}
      <div style={{ 
        background: theme.gridWrapperBg, 
        padding: '12px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
      }}>
        <PhotoGrid slots={slots} images={images} selectedSlot={selectedSlot} onSlotClick={onSlotClick} innerBorder={theme.gridInnerBorder} />
      </div>

      {/* Lời Cảm Ơn của Mai */}
      <div style={{ marginTop: '24px', textAlign: 'center', padding: '0 10px' }}>
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
        marginTop: '20px', 
        padding: '14px 20px', 
        background: theme.bottomBoxBg, 
        borderRadius: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
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
            18 / 06 / 2026
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = THEMES.find(t => t.id === selectedThemeId) ?? THEMES[0];

  /* Handlers */
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
    } catch { alert('Không thể kết nối camera. Vui lòng cấp quyền truy cập.'); }
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!stream) return alert('Hãy bật camera trước!');
    if (!video || !canvas) return;
    
    // Capture square crop from center
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    
    // Flip horizontally for mirror effect
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
    
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    setImages(prev => { const next = [...prev]; next[selectedSlot] = dataUrl; return next; });
    
    // Auto advance slot
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

  const download = () => {
    if (!cardRef.current) return;
    htmlToImage.toPng(cardRef.current, { pixelRatio: 3, quality: 1.0 })
      .then(url => {
        const a = document.createElement('a');
        a.download = `Photobooth_Mai_${theme.id}.png`;
        a.href = url; a.click();
      })
      .catch(() => alert('Lỗi tải ảnh, hãy thử lại!'));
  };

  return (
    <section id="studio-anh" className="py-20 border-t" style={{ background: 'var(--bg-section-2)', borderColor: 'var(--border-section)' }}>
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
            
            {/* Live Camera */}
            <div className="w-full aspect-square rounded-[32px] overflow-hidden relative shadow-inner" style={{ background: '#000', border: '8px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
              <canvas ref={canvasRef} className="hidden" />
              {stream ? (
                <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white" /> REC
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                  <span className="text-4xl mb-2">📸</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Camera Offline</span>
                </div>
              )}
            </div>

            {/* Layout & Theme Selectors */}
            <div className="backdrop-blur-sm p-6 rounded-[24px] border shadow-sm space-y-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              
              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">1. Số Lượng Ảnh (Grid)</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRIDS.map(g => (
                    <button key={g.value} onClick={() => changeGrid(g.value)}
                      className={`px-2 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all border-2 text-center ${
                        selectedGrid === g.value ? 'border-rose-500 bg-rose-50 text-rose-600' : 'text-gray-500 hover:border-rose-300'
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
                      className={`relative flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border-2 transition-all ${
                        selectedThemeId === t.id ? 'border-rose-500 shadow-md scale-105' : 'hover:border-rose-300'
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

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button onClick={openCamera} className="flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 transition shadow-lg">
                  1. Bật Camera
                </button>
                <button onClick={capturePhoto} className="flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition shadow-lg flex items-center justify-center gap-2">
                  <span>📸</span> Chụp (Slot {selectedSlot + 1})
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border-2 border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition">
                  Tải Ảnh Lên
                </button>
                <button onClick={clearSlot} disabled={!images[selectedSlot]}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border-2 border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition disabled:opacity-40">
                  Xóa Slot {selectedSlot + 1}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <button onClick={download} className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-white transition-all shadow-xl hover:shadow-rose-500/30" style={{ background: 'linear-gradient(135deg, #be123c, #9f1239)' }}>
                📥 Tải File Ảnh Siêu Nét
              </button>
            </div>

          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-7 flex justify-center items-start lg:sticky lg:top-24">
            <div className="flex flex-col items-center w-full overflow-x-auto pb-8">
              <div className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse whitespace-nowrap">
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
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}