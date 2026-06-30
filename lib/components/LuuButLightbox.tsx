'use client';

import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import React from 'react';
import { useEffect, useState } from 'react';
import { LuuButRecord } from '../types';
import LuuButCard from './LuuButCard';

interface LuuButLightboxProps {
  item: LuuButRecord | null;
  prevItem?: LuuButRecord | null;
  nextItem?: LuuButRecord | null;
  isLoadingNext?: boolean;
  currentIndex?: number;
  total?: number;
  totalHasMore?: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function LuuButLightbox({
  item, prevItem, nextItem, isLoadingNext = false,
  currentIndex, total, totalHasMore = false,
  onClose, onPrev, onNext,
}: LuuButLightboxProps) {
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    if (onPrev) onPrev();
  };

  const handleNext = () => {
    setDirection(1);
    if (onNext) onNext();
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = info.offset.x;
    const swipePower = Math.abs(swipe) * info.velocity.x;
    
    // Swipe left -> Next item
    if (swipe < -60 || swipePower < -10000) {
      if ((nextItem || totalHasMore) && !isLoadingNext) handleNext();
    } 
    // Swipe right -> Prev item
    else if (swipe > 60 || swipePower > 10000) {
      if (prevItem) handlePrev();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : direction < 0 ? -30 : 0,
      opacity: 0,
      scale: 0.97
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : direction > 0 ? -30 : 0,
      opacity: 0,
      scale: 0.97
    })
  };
  // Keyboard navigation
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevItem) handlePrev();
      if (e.key === 'ArrowRight' && (nextItem || totalHasMore)) handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [item, prevItem, nextItem, totalHasMore, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (() => {
        return (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
          >
            {/* Close button — floating outside the card, top-right of viewport */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all text-white"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Counter — top-left of viewport */}
            {currentIndex !== undefined && total !== undefined && (
              <div
                className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-xs font-bold font-mono text-white flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span>{currentIndex + 1}</span>
                <span className="opacity-50">/</span>
                <span>{total}{totalHasMore ? '+' : ''}</span>
              </div>
            )}

            {/* Navigation Arrows (outside the card) */}
            {onPrev && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: prevItem ? 1 : 0.2, x: 0 }}
                disabled={!prevItem}
                onClick={(e) => { e.stopPropagation(); if (prevItem) handlePrev(); }}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white transition-all disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              </motion.button>
            )}
            {onNext && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: (nextItem || totalHasMore) ? 1 : 0.2, x: 0 }}
                disabled={(!nextItem && !totalHasMore) || isLoadingNext}
                onClick={(e) => { e.stopPropagation(); if ((nextItem || totalHasMore) && !isLoadingNext) handleNext(); }}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white transition-all disabled:cursor-not-allowed"
              >
                {isLoadingNext ? (
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                )}
              </motion.button>
            )}

            {/* Card with directional slide transition */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={item.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                dragDirectionLock
                onDragEnd={handleDragEnd}
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl touch-pan-y cursor-grab active:cursor-grabbing"
                style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}
              >
                <LuuButCard
                  tieuDe={item.tieu_de}
                  noiDung={item.noi_dung}
                  tacGia={item.tac_gia}
                  quaTang={item.qua_tang}
                  anhUrl={item.anh_url}
                  createdAt={item.created_at}
                  bottomSlot={
                    (onPrev || onNext) ? (
                      <div className="flex sm:hidden border-t divide-x shrink-0" style={{ borderColor: 'var(--border-card)', '--tw-divide-opacity': 1 } as React.CSSProperties}>
                        <button
                          onClick={() => prevItem && handlePrev()}
                          disabled={!prevItem}
                          className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                          style={{ color: 'var(--text-heading)' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                          Trước
                        </button>
                        <button
                          onClick={() => (nextItem || totalHasMore) && !isLoadingNext && handleNext()}
                          disabled={(!nextItem && !totalHasMore) || isLoadingNext}
                          className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                          style={{ color: isLoadingNext ? 'var(--text-muted)' : 'var(--text-heading)' }}
                        >
                          {isLoadingNext ? (
                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                          ) : nextItem ? 'Tiếp' : '↩ Về đầu'}
                          {!isLoadingNext && nextItem && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                          )}
                        </button>
                      </div>
                    ) : undefined
                  }
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
}
