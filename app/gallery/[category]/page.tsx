'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MEMORIES } from '@/lib/constants';
import { useGalleryData } from '@/lib/components/gallery/useGalleryData';
import { useGalleryUpload } from '@/lib/components/gallery/useGalleryUpload';
import { useGalleryDelete } from '@/lib/components/gallery/useGalleryDelete';
import { useGalleryReorder } from '@/lib/components/gallery/useGalleryReorder';
import GalleryHeader from '@/lib/components/gallery/GalleryHeader';
import GalleryGrid from '@/lib/components/gallery/GalleryGrid';
import LightboxModal from '@/lib/components/gallery/LightboxModal';
import DeleteConfirmModal from '@/lib/components/gallery/DeleteConfirmModal';

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.category as string;

  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>(() => {
    if (typeof window === 'undefined') return 'grid';
    const saved = localStorage.getItem('gallery_viewMode');
    return (saved === 'grid' || saved === 'masonry') ? saved : 'grid';
  });
  const [columnsCount, setColumnsCount] = useState<2 | 3 | 4>(() => {
    if (typeof window === 'undefined') return 3;
    const saved = localStorage.getItem('gallery_columnsCount');
    const cols = saved ? parseInt(saved, 10) : 3;
    return (cols === 2 || cols === 3 || cols === 4) ? cols : 3;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => { localStorage.setItem('gallery_viewMode', viewMode); }, [viewMode]);
  useEffect(() => { localStorage.setItem('gallery_columnsCount', columnsCount.toString()); }, [columnsCount]);

  // ─── Redirect if category not found ───
  const categoryInfo = MEMORIES.find(m => m.id === categoryId);
  useEffect(() => {
    if (!categoryInfo) router.push('/');
  }, [categoryInfo, router]);

  // ─── Hooks ───
  const { images, setImages, currentPage, itemsPerPage, loading, observerTarget } = useGalleryData(categoryId);

  const { uploading, uploadProgress, fileInputRef, handleFileChange } = useGalleryUpload(categoryId, images, setImages);

  const {
    deletingId, deletingMultiple, deletePassword, deleteError,
    setDeletePassword, setDeleteError,
    requestDelete, requestMultipleDelete, confirmDelete, cancelDelete,
  } = useGalleryDelete(setImages, selectedIds, setSelectedIds, setIsSelectionMode);

  const {
    isReorderMode, setIsReorderMode, reordering, draggedItemIndex,
    handleSaveOrder, handleDragStart, handleDragOver,
    handleDragEnter, handleDragEnd,
    handleTouchStart, handleTouchMove, handleTouchEnd,
  } = useGalleryReorder(images, setImages);

  // ─── Keyboard nav for lightbox ───
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (previewIndex === null) return;
      if (e.key === 'ArrowRight') setPreviewIndex(i => (i! + 1) % images.length);
      if (e.key === 'ArrowLeft') setPreviewIndex(i => (i! - 1 + images.length) % images.length);
      if (e.key === 'Escape') setPreviewIndex(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [previewIndex, images.length]);

  const toggleSelectionMode = () => { setIsSelectionMode(v => !v); setSelectedIds([]); };
  const toggleSelectImage = (id: string) => setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );

  if (!categoryInfo) return null;

  return (
    <div className="min-h-screen bg-rose-50/30 dark:bg-zinc-950 transition-colors duration-500">
      <GalleryHeader
        isSelectionMode={isSelectionMode}
        isReorderMode={isReorderMode}
        selectedCount={selectedIds.length}
        uploading={uploading}
        uploadProgress={uploadProgress}
        reordering={reordering}
        viewMode={viewMode}
        columnsCount={columnsCount}
        hasImages={images.length > 0}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(v => !v)}
        onSetViewMode={setViewMode}
        onSetColumnsCount={setColumnsCount}
        onToggleSelectionMode={toggleSelectionMode}
        onRequestMultipleDelete={requestMultipleDelete}
        onStartReorder={() => setIsReorderMode(true)}
        onCancelReorder={() => setIsReorderMode(false)}
        onSaveOrder={handleSaveOrder}
        onUploadClick={() => fileInputRef.current?.click()}
        onFileChange={handleFileChange}
        fileInputRef={fileInputRef}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12 space-y-4">
          <div className="text-6xl animate-bounce-slow inline-block drop-shadow-md">{categoryInfo.emoji}</div>
          <h1 className="font-nghe-thuat italic text-4xl md:text-5xl font-bold text-[#2E1F20] dark:text-white">
            {categoryInfo.label}
          </h1>
          <p className="text-rose-400 dark:text-rose-300 font-medium tracking-wide">
            Bộ sưu tập lưu giữ những kỷ niệm đẹp nhất 🌸
          </p>
        </div>

        <GalleryGrid
          images={images}
          loading={loading}
          viewMode={viewMode}
          columnsCount={columnsCount}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isReorderMode={isReorderMode}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          draggedItemIndex={draggedItemIndex}
          observerTarget={observerTarget}
          categoryLabel={categoryInfo.label}
          onDeleteRequest={requestDelete}
          onSelectImage={toggleSelectImage}
          onPreview={setPreviewIndex}
          onUploadClick={() => fileInputRef.current?.click()}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </main>

      {/* Lightbox */}
      {previewIndex !== null && images[previewIndex] && (
        <LightboxModal
          images={images}
          previewIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onNavigate={setPreviewIndex}
        />
      )}

      {/* Delete confirmation */}
      {(deletingId || deletingMultiple) && (
        <DeleteConfirmModal
          deletingMultiple={deletingMultiple}
          selectedCount={selectedIds.length}
          deletePassword={deletePassword}
          deleteError={deleteError}
          onPasswordChange={(p) => { setDeletePassword(p); setDeleteError(false); }}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
