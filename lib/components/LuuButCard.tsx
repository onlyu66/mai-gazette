'use client';

import { GalleryImageRecord } from '@/lib/types';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { formatLuuButDate } from '../utils/luu-but-constants';
import ImageWithSkeleton from './ImageWithSkeleton';
import WashiRibbon from './WashiRibbon';
import LightboxModal from './gallery/LightboxModal';

interface LuuButCardProps {
  noiDung?: string;
  tacGia?: string;
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
  noiDung,
  tacGia,
  anhUrl,
  anhFile,
  createdAt,
  renderContent,
  bottomSlot,
  showPlaceholderImage = false,
}: LuuButCardProps) {
  // Optimize image preview rendering to avoid lag during typing
  const objectUrl = useMemo(() => {
    if (!anhFile) return null;
    return URL.createObjectURL(anhFile);
  }, [anhFile]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const imgSrc = objectUrl || anhUrl;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: number | null = null;
    const timeout = window.setTimeout(() => {
      setMounted(true);
      if (!createdAt) {
        setCurrentTime(Date.now());
        interval = window.setInterval(() => {
          setCurrentTime(Date.now());
        }, 1000);
      }
    }, 0);

    return () => {
      window.clearTimeout(timeout);
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [createdAt]);

  const displayDate = useMemo(() => {
    if (createdAt) {
      return formatLuuButDate(createdAt, 'long');
    }
    if (!mounted || currentTime === null) {
      return 'Đang cập nhật';
    }
    return formatLuuButDate(new Date(currentTime).toISOString(), 'long');
  }, [createdAt, currentTime, mounted]);

  return (
    <div
      className="w-full min-w-0 relative rounded-3xl overflow-hidden flex flex-col select-none smart-break"
      style={{
        background: 'var(--bg-card-gradient)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 0 0 1px var(--border-card)',
      }}
    >
      {/* Top Washi Ribbon */}
      <WashiRibbon color="var(--mau-hong)" />

      {/* Decorative petals */}
      <div className="pointer-events-none absolute top-5 right-5 opacity-[0.12] rotate-12 select-none">
        <div className="text-3xl animate-gio-thoi">🌸</div>
      </div>
      <div className="pointer-events-none absolute bottom-10 left-4 opacity-[0.12] -rotate-12 select-none">
        <div className="text-3xl animate-gio-thoi" style={{ animationDelay: '2s' }}>🌷</div>
      </div>

      {/* Card body */}
      <div className="p-6 md:p-8 space-y-5 flex-1 min-w-0">

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
            <span>{displayDate}</span>
          </div>
        </div>


        {/* Image */}
        {imgSrc ? (
          <>
            <div
              className="w-full aspect-16/10 rounded-2xl overflow-hidden border cursor-zoom-in group relative"
              style={{ borderColor: 'var(--border-card)' }}
              onClick={() => setLightboxOpen(true)}
              title="Bấm để xem ảnh lớn"
            >
              {/* Image — blob preview loads instantly; remote URL uses skeleton */}
                <ImageWithSkeleton
                  src={imgSrc}
                  alt="Ảnh kỷ niệm"
                  className="group-hover:scale-105"
                />
              
              {/* Zoom hint overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-black/70 rounded-full p-2 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (() => {
              const fakeRecord: GalleryImageRecord = {
                id: 'luu-but-img',
                image_url: imgSrc,
                category: '',
                order_index: 0,
                created_at: new Date().toISOString(),
              };
              return (
                <LightboxModal
                  images={[fakeRecord]}
                  previewIndex={0}
                  onClose={() => setLightboxOpen(false)}
                  onNavigate={() => { }}
                />
              );
            })()}
          </>
        ) : showPlaceholderImage ? (
          <div
            className="w-full aspect-16/10 rounded-2xl overflow-hidden border flex items-center justify-center"
            style={{ borderColor: 'var(--border-card)', background: 'rgba(244,114,182,0.05)' }}
          >
            <div className="text-center space-y-2 opacity-40">
              <div className="text-3xl">🖼️</div>
              <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--rose-400)' }}>
                Chưa có ảnh kỷ niệm
              </p>
            </div>
          </div>
        ) : null}

        {/* Body text */}
        <div className="relative">
          <div
            className="absolute -top-2 -left-1 text-5xl font-serif leading-none select-none opacity-15"
            style={{ color: 'var(--mau-hong)' }}
          >
            &quot;
          </div>
          <div
            className="text-[13px] leading-[1.85] pl-4 smart-break"
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
            style={{ color: 'var(--mau-hong)' }}
          >
            &quot;
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t flex justify-between items-end gap-2 smart-break" style={{ borderColor: 'var(--border-section)' }}>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Người gửi</p>
            <p className="font-nghe-thuat italic font-bold text-base md:text-lg smart-break" style={{ color: 'var(--text-heading)' }}>
              {tacGia || 'Bạn ẩn danh'}
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Lưu bút</p>
            <p className="text-[11px] font-bold" style={{ color: 'var(--text-heading)' }}>N.MAI · 2026</p>
          </div>
        </div>
      </div>

      {/* Bottom Washi Ribbon */}
      <WashiRibbon color="var(--mau-hong)" bottom={true} />

      {/* Optional bottom slot (e.g. mobile nav) */}
      {bottomSlot}
    </div>
  );
}
