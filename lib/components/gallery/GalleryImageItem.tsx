'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Move, Trash2 } from 'lucide-react';
import { GalleryImageRecord } from '@/lib/types';

interface GalleryImageItemProps {
  img: GalleryImageRecord;
  index: number;
  viewMode: 'grid' | 'masonry';
  columnsCount: 2 | 3 | 4;
  isReorderMode: boolean;
  isSelectionMode: boolean;
  isSelected: boolean;
  isDragging: boolean;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onPreview: (index: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onTouchStart: (index: number) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

export default function GalleryImageItem({
  img, index, viewMode, columnsCount,
  isReorderMode, isSelectionMode, isSelected, isDragging,
  onDelete, onSelect, onPreview,
  onDragStart, onDragOver, onDragEnter, onDragEnd,
  onTouchStart, onTouchMove, onTouchEnd,
}: GalleryImageItemProps) {
  const isGrid = viewMode === 'grid' || isReorderMode;

  const handleClick = () => {
    if (isSelectionMode) onSelect(img.id);
    else if (!isReorderMode) onPreview(index);
  };

  return (
    <motion.div
      layout
      className={`rounded-2xl overflow-hidden ${
        isGrid
          ? 'aspect-square'
          : `break-inside-avoid relative ${columnsCount === 4 ? 'mb-4' : 'mb-6'}`
      }`}
    >
      <div
        data-index={index}
        draggable={isReorderMode}
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={onDragOver}
        onDragEnter={() => onDragEnter(index)}
        onDragEnd={onDragEnd}
        onTouchStart={() => onTouchStart(index)}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleClick}
        className={`
          relative group w-full ${isGrid ? 'h-full' : 'h-auto'} rounded-2xl overflow-hidden
          bg-rose-50 dark:bg-zinc-900 border transition-all duration-300
          ${isReorderMode ? 'cursor-grab active:cursor-grabbing touch-none' : isSelectionMode ? 'cursor-pointer' : 'cursor-zoom-in'}
          ${isSelected ? 'border-rose-500 ring-2 ring-rose-500 shadow-xl' : 'border-rose-100 dark:border-zinc-800 shadow-sm'}
          ${isDragging ? 'opacity-50 scale-95' : ''}
        `}
      >
        <img
          src={img.image_url}
          alt="Kỷ niệm"
          className={`
            w-full ${isGrid ? 'h-full object-cover' : 'h-auto object-cover'}
            transform transition duration-700
            ${(!isSelectionMode && !isReorderMode) ? 'group-hover:scale-105' : ''}
            ${isSelected ? 'scale-105 opacity-80' : ''}
          `}
          loading={index < 6 ? "eager" : "lazy"}
          fetchPriority={index < 6 ? "high" : "auto"}
        />

        {/* Hover overlay gradient */}
        {(!isSelectionMode && !isReorderMode) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}

        {/* Reorder overlay */}
        {isReorderMode && (
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 dark:bg-black/50 p-3 rounded-full backdrop-blur-md shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 transform scale-100 sm:scale-90 sm:group-hover:scale-100">
              <Move size={24} className="text-gray-700 dark:text-gray-200" />
            </div>
          </div>
        )}

        {/* Selection indicator */}
        {isSelectionMode && (
          <div className="absolute top-4 left-4 z-10">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-white bg-black/20'}`}>
              {isSelected && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Delete button (hover) */}
        {(!isSelectionMode && !isReorderMode) && (
          <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}
              className="p-2.5 bg-white/90 dark:bg-zinc-800/90 hover:bg-red-50 hover:text-red-600 text-gray-600 dark:text-gray-300 rounded-full backdrop-blur shadow-lg transition-colors"
              title="Xóa ảnh này"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Date badge */}
        <div className={`absolute bottom-4 left-4 transition-all duration-300 ${(!isSelectionMode && !isReorderMode) ? 'translate-y-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0' : ''}`}>
          <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
            {new Date(img.created_at).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
