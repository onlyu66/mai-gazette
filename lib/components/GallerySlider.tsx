'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MEMORIES = [
  { emoji: '🎓', label: 'Ngày nhận bằng', color: 'from-rose-100 to-pink-50' },
  { emoji: '📸', label: 'Ảnh kỷ yếu', color: 'from-pink-100 to-rose-50' },
  { emoji: '🌸', label: 'Mùa hoa đỏ AJC', color: 'from-fuchsia-100 to-pink-50' },
  { emoji: '📝', label: 'Đêm trắng làm bài', color: 'from-rose-50 to-pink-100' },
  { emoji: '☕', label: 'Cà phê trước thi', color: 'from-pink-50 to-fuchsia-100' },
  { emoji: '🎙️', label: 'Phóng sự thực tế', color: 'from-rose-100 to-rose-50' },
  { emoji: '💕', label: 'Bạn bè thân thương', color: 'from-pink-100 to-pink-50' },
  { emoji: '🏫', label: 'Giảng đường ký ức', color: 'from-fuchsia-50 to-rose-100' },
];

const STRIP = [...MEMORIES, ...MEMORIES];

export default function GallerySlider() {
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
      <div className="flex w-max flex-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          className="flex flex-nowrap pr-6 space-x-5"
        >
          {STRIP.map((item, idx) => (
            <div
              key={idx}
              className={`
                w-52 h-44 rounded-3xl flex-shrink-0 flex flex-col items-center justify-center gap-3
                bg-gradient-to-br ${item.color}
                border shadow-sm
                hover:shadow-rose-200/60 hover:-translate-y-1
                transition-all duration-300
              `}
              style={{ borderColor: 'var(--border-card)' }}
            >
              {/* Decorative dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-rose-300/60 absolute top-4 right-4" />
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-[11px] font-bold text-rose-500/80 tracking-wider uppercase text-center px-4">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer hint */}
      <p className="text-center text-[9px] tracking-widest uppercase mt-6 font-mono" style={{ color: 'var(--text-muted)' }}>
        Cuộn tự động · Kỷ niệm là mãi mãi 🌷
      </p>
    </section>
  );
}