import React, { ReactNode } from 'react';
import { LuuButFormData } from '../types';

interface NewspaperPreviewProps {
  formData: LuuButFormData;
  formatDropCapText: (text: string) => ReactNode;
}

const LOAI_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  'loi-chuc': { label: 'Lời chúc tốt nghiệp', emoji: '🌸', color: '#f43f5e' },
  'ky-niem': { label: 'Kỷ niệm đáng nhớ', emoji: '📸', color: '#e879a0' },
  'nhan-nhu': { label: 'Nhắn nhủ từ trái tim', emoji: '💌', color: '#e11d48' },
  'hai-huoc': { label: 'Hài hước & vui vẻ', emoji: '🎭', color: '#fb7185' },
};

const CAM_XUC_COLORS: Record<string, string> = {
  '🥺 Xúc động': '#f43f5e',
  '🌸 Tự hào': '#e879a0',
  '🥂 Hào hứng': '#fb923c',
  '😭 Nhớ nhau': '#a855f7',
  '✨ Biết ơn': '#eab308',
  '💕 Yêu quý': '#ec4899',
};

function today() {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function NewspaperPreview({ formData, formatDropCapText }: NewspaperPreviewProps) {
  const loai = LOAI_LABELS[formData.tieuDe] ?? { label: 'Lời nhắn', emoji: '💌', color: '#f43f5e' };
  const camXucEmoji = formData.quaTang?.split(' ')[0] ?? '';
  const camXucColor = CAM_XUC_COLORS[formData.quaTang] ?? '#f43f5e';

  return (
    <div
      className="w-full max-w-xl relative rounded-3xl overflow-hidden select-none"
      style={{
        background: 'var(--bg-card-gradient)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.05), 0 0 0 1px var(--border-card)',
      }}
    >
      {/* Top decorative band */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, #fda4af, ${loai.color}, #fda4af)` }}
      />

      {/* Decorative flowers */}
      <div className="absolute top-4 right-4 opacity-20 rotate-12 select-none">
        <div className="text-3xl animate-gio-thoi" style={{ animationDelay: '0.5s' }}>🌸</div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-20 -rotate-12 select-none">
        <div className="text-3xl animate-gio-thoi" style={{ animationDelay: '1.5s' }}>🌷</div>
      </div>

      <div className="p-5 md:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-5 border-b" style={{ borderColor: 'var(--border-section)' }}>
          <p className="text-[9px] uppercase tracking-[0.35em] font-bold font-mono" style={{ color: 'var(--text-muted)' }}>
            Lưu Bút Tốt Nghiệp Đại Học · 2026
          </p>
          <h3 className="font-nghe-thuat italic text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Lưu Bút Thanh Xuân
          </h3>
          <div className="flex justify-center items-center gap-3 text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
            <span>Phan Ngọc Mai</span>
            <span>·</span>
            <span>{today()}</span>
          </div>
        </div>

        {/* Loại lưu bút badge */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white"
            style={{ background: loai.color }}
          >
            {loai.emoji} {loai.label.toUpperCase()}
          </span>
          {formData.quaTang && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold border"
              style={{ borderColor: `${camXucColor}40`, color: camXucColor, background: `${camXucColor}10` }}
            >
              {camXucEmoji} {formData.quaTang.replace(/^\S+\s/, '')}
            </span>
          )}
        </div>

        {/* Ảnh kỷ niệm */}
        <div
          className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-rose-100 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)' }}
        >
          {formData.anhBase64 ? (
            <img src={formData.anhBase64} alt="Ảnh kỷ niệm" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center space-y-2 opacity-40">
              <div className="text-3xl">🖼️</div>
              <p className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">
                Chưa có ảnh kỷ niệm
              </p>
            </div>
          )}
        </div>

        {/* Nội dung */}
        <div className="relative">
          {/* Decorative quote mark */}
          <div
            className="absolute -top-2 -left-1 text-5xl font-serif leading-none opacity-15 select-none"
            style={{ color: '#f43f5e' }}
          >
            "
          </div>
          <div
            className="text-[13px] leading-[1.85] pl-4"
            style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic', borderColor: 'var(--border-section)', color: 'var(--mau-chu)', opacity: 0.85 }}
          >
            {formData.noiDung
              ? formatDropCapText(formData.noiDung)
              : (
                <span className="text-rose-200">
                  Lời nhắn của bạn sẽ hiện ra ở đây... Hãy bắt đầu viết từ biểu mẫu bên cạnh nhé 🌸
                </span>
              )
            }
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-section)' }}>
          <div className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Người gửi</p>
            <p className="font-nghe-thuat italic font-bold text-base" style={{ color: 'var(--text-heading)' }}>
              {formData.tacGia || 'Người bạn thân mến'}
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Lưu bút</p>
            <p className="text-[11px] font-bold" style={{ color: 'var(--text-heading)' }}>N°MAI · 2026 🌷</p>
          </div>
        </div>
      </div>

      {/* Bottom decorative band */}
      <div
        className="h-1 w-full opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${loai.color}, transparent)` }}
      />
    </div>
  );
}