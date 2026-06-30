'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { formatLuuButDate, LUU_BUT_LOAI, QUA_TANG_COLORS } from '../utils/luu-but-constants';
import WashiRibbon from './WashiRibbon';

interface LuuButCardProps {
  // Data — either from a saved record (strings) or from a live form preview (File)
  tieuDe: string;
  noiDung?: string;
  tacGia?: string;
  quaTang?: string;
  anhUrl?: string | null;       // saved URL from Supabase
  anhFile?: Blob | null;        // live blob for preview
  createdAt?: string;
  // Render slots for custom content (e.g. drop-cap formatted text)
  renderContent?: ReactNode;
  // Optional bottom slot — e.g. mobile nav buttons inside lightbox
  bottomSlot?: ReactNode;
  // If true, display a placeholder when no image is provided (used for preview)
  showPlaceholderImage?: boolean;
}

export default function LuuButCard({
  tieuDe,
  noiDung,
  tacGia,
  quaTang,
  anhUrl,
  anhFile,
  createdAt,
  renderContent,
  bottomSlot,
  showPlaceholderImage = false,
}: LuuButCardProps) {
  const loaiData = LUU_BUT_LOAI[tieuDe] ?? LUU_BUT_LOAI['loi-chuc'];
  const loaiColor = loaiData.hexColor;
  const quaTangColor = QUA_TANG_COLORS[quaTang ?? ''] ?? '#f43f5e';
  const quaTangEmoji = quaTang?.split(' ')[0] ?? '';
  const quaTangText = quaTang?.replace(/^\S+\s/, '') ?? '';

  // Resolve image: prefer live File blob over saved URL
  const imgSrc = anhFile ? URL.createObjectURL(anhFile) : anhUrl;

  return (
    <div
      className="w-full relative rounded-3xl overflow-hidden flex flex-col select-none"
      style={{
        background: 'var(--bg-card-gradient)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 0 0 1px var(--border-card)',
      }}
    >
      {/* Top Washi Ribbon */}
      <WashiRibbon color={loaiColor} />

      {/* Decorative petals */}
      <div className="pointer-events-none absolute top-5 right-5 opacity-[0.12] rotate-12 select-none">
        <div className="text-3xl animate-gio-thoi">🌸</div>
      </div>
      <div className="pointer-events-none absolute bottom-10 left-4 opacity-[0.12] -rotate-12 select-none">
        <div className="text-3xl animate-gio-thoi" style={{ animationDelay: '2s' }}>🌷</div>
      </div>

      {/* Card body */}
      <div className="p-6 md:p-8 space-y-5 flex-1">

        {/* Masthead */}
        <div className="text-center space-y-1.5 pb-4 border-b" style={{ borderColor: 'var(--border-section)' }}>
          <p className="text-[9px] uppercase tracking-[0.35em] font-bold font-mono" style={{ color: 'var(--text-muted)' }}>
            Lưu Bút Tốt Nghiệp Đại Học · 2026
          </p>
          <h3 className="font-nghe-thuat italic text-xl md:text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Lưu Bút Thanh Xuân
          </h3>
          <div className="flex justify-center items-center gap-2 text-[9px] font-mono flex-wrap" style={{ color: 'var(--text-muted)' }}>
            <span>Phan Ngọc Mai</span>
            <span>·</span>
            <span>
              {createdAt
                ? formatLuuButDate(createdAt, 'long')
                : new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              }
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white"
            style={{ background: loaiColor }}
          >
            {loaiData.emoji} {loaiData.fullLabel.toUpperCase()}
          </span>
          {quaTang && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold border"
              style={{ borderColor: `${quaTangColor}40`, color: quaTangColor, background: `${quaTangColor}12` }}
            >
              {quaTangEmoji} {quaTangText}
            </span>
          )}
        </div>

        {/* Image */}
        {imgSrc ? (
          <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-card)' }}>
            {anhFile ? (
              // blob preview — use img tag (Next Image can't handle blobs)
              <img src={imgSrc} alt="Ảnh kỷ niệm" className="w-full h-full object-cover" />
            ) : (
              <Image
                src={imgSrc}
                alt="Ảnh kỷ niệm"
                width={600}
                height={375}
                className="w-full h-full object-cover"
                priority
              />
            )}
          </div>
        ) : showPlaceholderImage ? (
          <div 
            className="w-full aspect-[16/10] rounded-2xl overflow-hidden border flex items-center justify-center" 
            style={{ borderColor: 'var(--border-card)', background: 'rgba(244,114,182,0.05)' }}
          >
            <div className="text-center space-y-2 opacity-40">
              <div className="text-3xl">🖼️</div>
              <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: loaiColor }}>
                Chưa có ảnh kỷ niệm
              </p>
            </div>
          </div>
        ) : null}

        {/* Body text */}
        <div className="relative">
          <div
            className="absolute -top-2 -left-1 text-5xl font-serif leading-none select-none opacity-15"
            style={{ color: loaiColor }}
          >
            &quot;
          </div>
          <div
            className="text-[13px] leading-[1.85] pl-4"
            style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic', color: 'var(--mau-chu)', opacity: 0.85 }}
          >
            {renderContent ?? (
              noiDung
                ? <span>{noiDung}</span>
                : <span className="opacity-40">Lời nhắn của bạn sẽ hiện ra ở đây... Hãy bắt đầu viết từ biểu mẫu bên cạnh nhé 🌸</span>
            )}
          </div>
          <div
            className="text-right text-5xl font-serif leading-none select-none opacity-15 -mt-2"
            style={{ color: loaiColor }}
          >
            &quot;
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t flex justify-between items-end gap-2" style={{ borderColor: 'var(--border-section)' }}>
          <div className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Người gửi</p>
            <p className="font-nghe-thuat italic font-bold text-base md:text-lg" style={{ color: 'var(--text-heading)' }}>
              {tacGia || 'Người bạn thân mến'}
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Lưu bút</p>
            <p className="text-[11px] font-bold" style={{ color: 'var(--text-heading)' }}>N°MAI · 2026 🌷</p>
          </div>
        </div>
      </div>

      {/* Bottom Washi Ribbon */}
      <WashiRibbon color={loaiColor} bottom={!bottomSlot} />

      {/* Optional bottom slot (e.g. mobile nav) */}
      {bottomSlot}
    </div>
  );
}
