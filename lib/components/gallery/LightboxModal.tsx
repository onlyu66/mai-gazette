'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImageRecord } from '@/lib/types';

interface LightboxModalProps {
  images: GalleryImageRecord[];
  previewIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({ images, previewIndex, onClose, onNavigate }: LightboxModalProps) {
  const image = images[previewIndex];
  const total = images.length;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((previewIndex - 1 + total) % total);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((previewIndex + 1) % total);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm"
      >
        <X size={22} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono tracking-widest">
        {previewIndex + 1} / {total}
      </div>

      {/* Prev button */}
      <button onClick={goPrev} className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition backdrop-blur-sm">
        <ChevronLeft size={28} />
      </button>

      {/* Main Image */}
      <motion.div
        key={previewIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-[90vw] max-h-[88vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.image_url}
          alt="Preview"
          className="max-w-[90vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl select-none"
          draggable={false}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
            {new Date(image.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* Next button */}
      <button onClick={goNext} className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition backdrop-blur-sm">
        <ChevronRight size={28} />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto px-2 pb-1">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
            className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
              i === previewIndex ? 'border-rose-400 scale-110' : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
