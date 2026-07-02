'use client';

import React from 'react';
import { Loader2, ImagePlus } from 'lucide-react';
import { GalleryImageRecord } from '@/lib/types';
import GalleryImageItem from './GalleryImageItem';

// Helper to build grid/masonry class strings
function getContainerClass(viewMode: 'grid' | 'masonry', isReorderMode: boolean, columnsCount: 2 | 3 | 4): string {
  const isGrid = viewMode === 'grid' || isReorderMode;
  if (isGrid) {
    if (columnsCount === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-6';
    if (columnsCount === 3) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4';
  } else {
    if (columnsCount === 2) return 'columns-1 sm:columns-2 gap-6 space-y-6';
    if (columnsCount === 3) return 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6';
    return 'columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4';
  }
}

interface GalleryGridProps {
  images: GalleryImageRecord[];
  loading: boolean;
  viewMode: 'grid' | 'masonry';
  columnsCount: 2 | 3 | 4;
  isAdmin: boolean;
  canUpload: boolean;
  isReorderMode: boolean;
  isSelectionMode: boolean;
  selectedIds: string[];
  draggedItemIndex: number | null;
  observerTarget: React.RefObject<HTMLDivElement | null>;
  categoryLabel: string;
  hasMore: boolean;
  loadingMore: boolean;
  onDeleteRequest: (id: string) => void;
  onSelectImage: (id: string) => void;
  onPreview: (index: number) => void;
  onUploadClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onTouchStart: (index: number) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

export default function GalleryGrid({
  images, loading, viewMode, columnsCount,
  isAdmin, canUpload,
  isReorderMode, isSelectionMode, selectedIds, draggedItemIndex,
  observerTarget, categoryLabel, hasMore, loadingMore,
  onDeleteRequest, onSelectImage, onPreview, onUploadClick,
  onDragStart, onDragOver, onDragEnter, onDragEnd,
  onTouchStart, onTouchMove, onTouchEnd,
}: GalleryGridProps) {
  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-400" size={40} />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-rose-200 dark:border-zinc-800">
        <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-400">
          <ImagePlus size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="font-nghe-thuat text-2xl font-bold text-[#2E1F20] dark:text-rose-100">Chưa có bức ảnh nào</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Hãy là người đầu tiên đóng góp những khoảnh khắc tuyệt vời cho bộ sưu tập <strong>{categoryLabel}</strong> nhé!
          </p>
        </div>
        {canUpload && (
          <button
            onClick={onUploadClick}
            className="mt-4 px-8 py-3 bg-white dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 rounded-full text-rose-600 dark:text-rose-400 font-bold tracking-widest text-xs shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            CHỌN ẢNH TỪ THIẾT BỊ
          </button>
        )}
      </div>
    );
  }

  const displayedImages = images;

  return (
    <>
      <div className={getContainerClass(viewMode, isReorderMode, columnsCount)}>
        {displayedImages.map((img, index) => (
          <GalleryImageItem
            key={img.id}
            img={img}
            index={index}
            viewMode={viewMode}
            columnsCount={columnsCount}
            isReorderMode={isReorderMode}
            isAdmin={isAdmin}
            isSelectionMode={isSelectionMode}
            isSelected={selectedIds.includes(img.id)}
            isDragging={draggedItemIndex === index && isReorderMode}
            onDelete={onDeleteRequest}
            onSelect={onSelectImage}
            onPreview={onPreview}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {!isReorderMode && hasMore && (
        <div ref={observerTarget} className="flex justify-center items-center py-12 col-span-full">
          <div className="h-8 w-8">
            {loadingMore && (
              <div className="w-8 h-8 border-4 border-rose-200 dark:border-zinc-800 border-t-rose-500 dark:border-t-rose-400 rounded-full animate-spin" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
