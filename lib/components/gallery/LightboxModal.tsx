'use client';

import React from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImageRecord } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ImageWithSkeleton from '@/lib/components/ImageWithSkeleton';
import NextImage from 'next/image';

interface LightboxModalProps {
  images: GalleryImageRecord[];
  previewIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({ images, previewIndex, onClose, onNavigate }: LightboxModalProps) {
  const [direction, setDirection] = useState(0);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const image = images[previewIndex];
  const total = images.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [previewIndex]);

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    onNavigate((previewIndex - 1 + total) % total);
  };

  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    onNavigate((previewIndex + 1) % total);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = info.offset.x;
    const swipePower = Math.abs(swipe) * info.velocity.x;
    
    if (swipe < -60 || swipePower < -10000) {
      goNext();
    } else if (swipe > 60 || swipePower > 10000) {
      goPrev();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 bg-white/10 hover:bg-white/20 text-white hover:text-rose-300 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-90 backdrop-blur-sm shadow-lg"
      >
        <X size={22} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono tracking-widest">
        {previewIndex + 1} / {total}
      </div>

      {/* Prev button */}
      <button onClick={goPrev} className="hidden sm:block absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/25 text-white hover:text-rose-300 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-x-1 active:scale-90 backdrop-blur-sm shadow-lg">
        <ChevronLeft size={28} />
      </button>

      {/* Main Image */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={previewIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 50 : direction < 0 ? -50 : 0, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction < 0 ? 50 : direction > 0 ? -50 : 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-[90vw] max-h-[calc(100vh-160px)] flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing mb-10"
          onClick={(e) => e.stopPropagation()}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragDirectionLock
          onDragEnd={handleDragEnd}
        >
          <NextImage
            src={image.image_url}
            alt="Preview"
            width={1600}
            height={1200}
            sizes="90vw"
            priority
            draggable={false}
            className="max-w-[90vw] max-h-[calc(100vh-160px)] w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
              {new Date(image.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <button onClick={goNext} className="hidden sm:block absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/25 text-white hover:text-rose-300 rounded-full transition-all duration-300 hover:scale-110 hover:translate-x-1 active:scale-90 backdrop-blur-sm shadow-lg">
        <ChevronRight size={28} />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2 py-2 scrollbar-hide z-20" style={{ scrollBehavior: 'smooth' }}>
        {images.map((img, i) => (
          <button
            key={img.id}
            ref={i === previewIndex ? activeThumbRef : null}
            onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
            className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
              i === previewIndex ? 'border-rose-400 scale-110' : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <ImageWithSkeleton src={img.image_url} alt="" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}
