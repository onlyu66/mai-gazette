import { Theme, SlotCount } from './types';

export function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const THEMES: Theme[] = [
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
    message: 'Bản lĩnh, sáng tạo, cống hiện. Mãi tự hào là một phần của AJC! 🎙️',
    messageColor: '#7f1d1d', nameColor: '#7f1d1d', dateColor: '#b91c1c', bottomBoxBg: '#fee2e2',
    decorLeft: '🏛️', decorRight: '📰',
    accent: '#dc2626', accent2: '#f87171',
    logo: '/ajc-logo.webp',
  },
];

export const GRIDS: { value: SlotCount; label: string }[] = [
  { value: 1, label: '1 Ảnh (Đơn)' },
  { value: 2, label: '2 Ảnh (Đôi)' },
  { value: 3, label: '3 Ảnh (Polaroid)' },
  { value: 4, label: '4 Ảnh (Lưới 2x2)' },
  { value: 6, label: '6 Ảnh (Lưới 2x3)' },
];

export const ANIMATION_CSS = `
@keyframes pb-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-9px); }
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
