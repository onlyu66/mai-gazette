export const LUU_BUT_LOAI: Record<string, { label: string; fullLabel: string; emoji: string; twColor: string; hexColor: string }> = {
  'loi-chuc': { 
    label: 'Lời chúc', 
    fullLabel: 'Lời chúc tốt nghiệp',
    emoji: '🌸', 
    twColor: 'text-rose-600 bg-rose-50 border-rose-200',
    hexColor: '#f43f5e'
  },
  'ky-niem': { 
    label: 'Kỷ niệm', 
    fullLabel: 'Kỷ niệm đáng nhớ',
    emoji: '📸', 
    twColor: 'text-pink-600 bg-pink-50 border-pink-200',
    hexColor: '#e879a0'
  },
  'nhan-nhu': { 
    label: 'Nhắn nhủ', 
    fullLabel: 'Nhắn nhủ từ trái tim',
    emoji: '💌', 
    twColor: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200',
    hexColor: '#e11d48'
  },
  'hai-huoc': { 
    label: 'Hài hước', 
    fullLabel: 'Hài hước & vui vẻ',
    emoji: '🎭', 
    twColor: 'text-orange-500 bg-orange-50 border-orange-200',
    hexColor: '#fb7185'
  },
};

export const QUA_TANG_COLORS: Record<string, string> = {
  '🥺 Xúc động': '#f43f5e',
  '🌸 Tự hào': '#e879a0',
  '🥂 Hào hứng': '#fb923c',
  '😭 Nhớ nhau': '#a855f7',
  '✨ Biết ơn': '#eab308',
  '💕 Yêu quý': '#ec4899',
};

export function formatLuuButDate(dateStr: string, format: 'short' | 'long' = 'short') {
  if (format === 'long') {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}
