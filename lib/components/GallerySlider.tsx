'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchGalleryImages } from '../services/api';
import Image from 'next/image';

import { MEMORIES } from '../constants';

const STRIP = [...MEMORIES, ...MEMORIES];


export default function GallerySlider() {
  const [covers, setCovers] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await fetchGalleryImages();
        const newCovers: Record<string, string> = {};
        
        // Nhóm ảnh theo danh mục, lấy ảnh đầu tiên (mới nhất vì đã được sort descending)
        images.forEach(img => {
          if (!newCovers[img.category]) {
            newCovers[img.category] = img.image_url;
          }
        });
        
        setCovers(newCovers);
      } catch (error) {
        console.error("Lỗi khi tải ảnh gallery:", error);
      }
    };
    
    loadImages();
  }, []);

  return (
    <section id="goc-trien-lam" className="py-12 overflow-hidden border-t select-none"
      style={{ background: 'var(--bg-section-2)', borderColor: 'var(--border-section)' }}
    >
      {/* Header */}
      <div className="mb-8 px-6 max-w-7xl mx-auto text-center space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400">
          ✦ Góc triển lãm ký ức
        </p>
        <h3 className="font-nghe-thuat italic text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
          Những khoảnh khắc thanh xuân không thể quên
        </h3>
      </div>

      {/* Scrolling strip */}
      <div className="flex w-max flex-nowrap group">
        <div
          className="flex flex-nowrap pr-6 space-x-5 chay-ngang"
        >
          {STRIP.map((item, idx) => (
            <Link
              href={`/gallery/${item.id}`}
              key={idx}
              className={`
                relative w-52 h-44 rounded-3xl flex-shrink-0 flex flex-col items-center justify-center gap-3
                bg-gradient-to-br ${item.color} overflow-hidden
                border shadow-sm
                hover:shadow-rose-300/80 hover:-translate-y-2
                transition-all duration-300
              `}
              style={{ borderColor: 'var(--border-card)' }}
            >
              {covers[item.id] ? (
                <>
                  <Image src={covers[item.id]} alt={item.label} fill sizes="(max-width: 768px) 100vw, 208px" className="object-cover opacity-90 transition duration-500 hover:scale-110" priority={idx < 2} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  {/* Decorative dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80 absolute top-4 right-4 z-10 shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
                  <span className="text-xl z-10 drop-shadow-md">{item.emoji}</span>
                  <span className="text-[12px] font-bold text-white tracking-wider uppercase text-center px-4 z-10 drop-shadow-md">
                    {item.label}
                  </span>
                </>
              ) : (
                <>
                  {/* Decorative dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-300/60 absolute top-4 right-4" />
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="text-[11px] font-bold text-rose-500/80 tracking-wider uppercase text-center px-4">
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-center text-[9px] tracking-widest uppercase mt-6 font-mono" style={{ color: 'var(--text-muted)' }}>
        Nhấn vào thẻ để xem và thêm ảnh · Kỷ niệm là mãi mãi 🌷
      </p>
    </section>
  );
}