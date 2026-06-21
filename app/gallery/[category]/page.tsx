'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MEMORIES } from '@/lib/constants';
import { fetchGalleryImages, insertGalleryImage, deleteGalleryImage, uploadStorageImage, updateGalleryOrder, uploadGalleryImage } from '@/lib/services/api';
import { compressImage } from '@/lib/utils/compressImage';
import { GalleryImageRecord } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Upload, Trash2, Loader2, ImagePlus, Move, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.category as string;
  const { theme } = useTheme();

  const [images, setImages] = useState<GalleryImageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingMultiple, setDeletingMultiple] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState(false);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Preview / Lightbox
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard navigation for lightbox
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

  const categoryInfo = MEMORIES.find(m => m.id === categoryId);

  useEffect(() => {
    if (!categoryInfo) {
      router.push('/');
      return;
    }

    const loadImages = async () => {
      try {
        const data = await fetchGalleryImages(categoryId);
        setImages(data);
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
        toast.error("Không thể tải danh sách ảnh");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [categoryId, categoryInfo, router]);

  // Infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (currentPage * itemsPerPage < images.length) {
            setCurrentPage((p) => p + 1);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [currentPage, images.length, itemsPerPage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" không phải là ảnh hợp lệ.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        // Tăng giới hạn lên 10MB vì sẽ được nén trước khi upload
        toast.error(`Ảnh "${file.name}" quá lớn (tối đa 10MB).`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({ done: 0, total: validFiles.length });

    const newRecords: any[] = [];
    const currentMaxOrder = images.length > 0 ? Math.max(...images.map(img => img.order_index || 0)) : 0;

    // Upload tuần tự (không song song) — tránh quá tải server khi nhiều ảnh
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        // 1. Nén ảnh client-side trước khi upload
        const compressedBlob = await compressImage(file);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

        // 2. Upload Blob đã nén lên Supabase Storage
        const uploadedUrl = await uploadGalleryImage(compressedBlob, mimeType);
        if (!uploadedUrl) throw new Error('Không nhận được URL sau khi upload');

        // 3. Lưu bản ghi vào Database với thứ tự mới nhất (đẩy xuống cuối)
        const newOrderIndex = currentMaxOrder + 1 + i;
        const newRecord = await insertGalleryImage(categoryId, uploadedUrl, newOrderIndex);
        newRecords.push(newRecord);

        // 4. Cập nhật tiến trình
        setUploadProgress({ done: i + 1, total: validFiles.length });
      } catch (err: any) {
        console.error(err);
        toast.error(`Lỗi khi tải ảnh "${file.name}": ${err.message}`);
      }
    }

    if (newRecords.length > 0) {
      setImages(prev => [...prev, ...newRecords]);
      toast.success(`Đã tải lên ${newRecords.length}/${validFiles.length} ảnh thành công! 📸`);
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
    setDeletingMultiple(false);
    setDeletePassword('');
    setDeleteError(false);
  };

  const requestMultipleDelete = () => {
    if (selectedIds.length === 0) return;
    setDeletingMultiple(true);
    setDeletePassword('');
    setDeleteError(false);
  };

  const confirmDelete = async () => {
    if (!deletingId && !deletingMultiple) return;

    if (deletePassword.toLowerCase() !== '15042025') {
      setDeleteError(true);
      return;
    }

    try {
      if (deletingMultiple) {
        // Delete multiple
        const deletePromises = selectedIds.map(id => deleteGalleryImage(id));
        await Promise.all(deletePromises);
        setImages(prev => prev.filter(img => !selectedIds.includes(img.id)));
        toast.success(`Đã xóa ${selectedIds.length} ảnh thành công 🗑️`);
        setSelectedIds([]);
        setIsSelectionMode(false);
        setDeletingMultiple(false);
      } else if (deletingId) {
        // Delete single
        await deleteGalleryImage(deletingId);
        setImages(prev => prev.filter(img => img.id !== deletingId));
        toast.success("Đã xóa ảnh thành công 🗑️");
        setDeletingId(null);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Lỗi khi xóa ảnh: " + error.message);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
    setDeletingMultiple(false);
    setDeletePassword('');
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const toggleSelectImage = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSaveOrder = async () => {
    try {
      setReordering(true);
      const updates = images.map((img, index) => ({ id: img.id, order_index: index }));
      await updateGalleryOrder(updates);
      toast.success("Đã lưu lại vị trí mới của ảnh! 📸");
      setIsReorderMode(false);
    } catch (error: any) {
      toast.error("Lỗi khi lưu vị trí: " + error.message);
    } finally {
      setReordering(false);
    }
  };

  if (!categoryInfo) return null;

  return (
    <div className="min-h-screen bg-rose-50/30 dark:bg-zinc-950 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-rose-200/40 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium hover:text-rose-700 transition">
            <ArrowLeft size={18} />
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Quay lại Trang Chủ</span>
          </Link>

          <div className="flex items-center gap-3">
            {isSelectionMode ? (
              <>
                <button
                  onClick={toggleSelectionMode}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                >
                  HỦY
                </button>
                <button
                  onClick={requestMultipleDelete}
                  disabled={selectedIds.length === 0}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition shadow-lg shadow-red-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  <span>XÓA ({selectedIds.length})</span>
                </button>
              </>
            ) : isReorderMode ? (
              <>
                <button
                  onClick={() => setIsReorderMode(false)}
                  disabled={reordering}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                >
                  HỦY
                </button>
                <button
                  onClick={handleSaveOrder}
                  disabled={reordering}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition shadow-lg shadow-green-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {reordering ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>LƯU VỊ TRÍ</span>
                </button>
              </>
            ) : (
              <>
                {images.length > 1 && (
                  <button
                    onClick={() => setIsReorderMode(true)}
                    className="px-4 py-2 text-xs font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-full transition hidden sm:block"
                  >
                    SẮP XẾP
                  </button>
                )}
                {images.length > 0 && (
                  <button
                    onClick={toggleSelectionMode}
                    className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-full transition hidden sm:block"
                  >
                    CHỌN NHIỀU
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition shadow-lg shadow-rose-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span className="hidden sm:inline">
                        {uploadProgress ? `${uploadProgress.done}/${uploadProgress.total} Ảnh...` : 'Đang xử lý...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span className="hidden sm:inline">TẢI ẢNH MỚI</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
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

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-400" size={40} />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-rose-200 dark:border-zinc-800">
            <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-400">
              <ImagePlus size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="font-nghe-thuat text-2xl font-bold text-[#2E1F20] dark:text-rose-100">Chưa có bức ảnh nào</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                Hãy là người đầu tiên đóng góp những khoảnh khắc tuyệt vời cho bộ sưu tập <strong>{categoryInfo.label}</strong> nhé!
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-8 py-3 bg-white dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 rounded-full text-rose-600 dark:text-rose-400 font-bold tracking-widest text-xs shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              CHỌN ẢNH TỪ THIẾT BỊ
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isReorderMode ? images : images.slice(0, currentPage * itemsPerPage)).map((img, index) => {
                const isSelected = selectedIds.includes(img.id);
                return (
                  <motion.div
                    key={img.id}
                    layout
                    className="rounded-2xl overflow-hidden aspect-square"
                  >
                    <div
                      draggable={isReorderMode}
                      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                        if (isReorderMode) {
                          setDraggedItemIndex(index);
                          e.dataTransfer.effectAllowed = 'move';
                        }
                      }}
                      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                        if (isReorderMode) e.preventDefault();
                      }}
                      onDragEnter={() => {
                        if (!isReorderMode || draggedItemIndex === null || draggedItemIndex === index) return;
                        const newImages = [...images];
                        const draggedItem = newImages[draggedItemIndex];
                        newImages.splice(draggedItemIndex, 1);
                        newImages.splice(index, 0, draggedItem);
                        setImages(newImages);
                        setDraggedItemIndex(index);
                      }}
                      onDragEnd={() => setDraggedItemIndex(null)}
                      onClick={() => {
                        if (isSelectionMode) toggleSelectImage(img.id);
                        else if (!isReorderMode) setPreviewIndex(index);
                      }}
                      className={`relative group w-full h-full rounded-2xl overflow-hidden bg-rose-50 dark:bg-zinc-900 border transition-all duration-300 ${isReorderMode ? 'cursor-grab active:cursor-grabbing' : isSelectionMode ? 'cursor-pointer' : 'cursor-zoom-in'} ${isSelected ? 'border-rose-500 ring-2 ring-rose-500 shadow-xl' : 'border-rose-100 dark:border-zinc-800 shadow-sm'} ${(draggedItemIndex === index && isReorderMode) ? 'opacity-50 scale-95' : ''}`}
                    >
                      <img
                        src={img.image_url}
                        alt="Kỷ niệm"
                        className={`w-full h-full object-cover transform transition duration-700 ${(!isSelectionMode && !isReorderMode) ? 'group-hover:scale-105' : ''} ${isSelected ? 'scale-105 opacity-80' : ''}`}
                        loading="lazy"
                      />

                      {/* Overlay gradient for hover effects */}
                      {(!isSelectionMode && !isReorderMode) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      )}

                      {/* Reorder Overlay */}
                      {isReorderMode && (
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                          <div className="bg-white/80 dark:bg-black/50 p-3 rounded-full backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                            <Move size={24} className="text-gray-700 dark:text-gray-200" />
                          </div>
                        </div>
                      )}

                      {/* Selection Indicator */}
                      {isSelectionMode && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-white bg-black/20'}`}>
                            {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {(!isSelectionMode && !isReorderMode) && (
                        <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <button
                            onClick={(e) => { e.stopPropagation(); requestDelete(img.id); }}
                            className="p-2.5 bg-white/90 dark:bg-zinc-800/90 hover:bg-red-50 hover:text-red-600 text-gray-600 dark:text-gray-300 rounded-full backdrop-blur shadow-lg transition-colors"
                            title="Xóa ảnh này"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      <div className={`absolute bottom-4 left-4 transition-all duration-300 ${(!isSelectionMode && !isReorderMode) ? 'translate-y-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0' : ''}`}>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                          {new Date(img.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Loading spinner for infinite scroll */}
            {!isReorderMode && currentPage * itemsPerPage < images.length && (
              <div ref={observerTarget} className="flex justify-center items-center py-12 col-span-full">
                <div className="w-8 h-8 border-4 border-rose-200 dark:border-zinc-800 border-t-rose-500 dark:border-t-rose-400 rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox Preview Modal */}
      {previewIndex !== null && images[previewIndex] && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-5 right-5 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono tracking-widest">
            {previewIndex + 1} / {images.length}
          </div>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); setPreviewIndex((previewIndex - 1 + images.length) % images.length); }}
            className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition backdrop-blur-sm"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image */}
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
              src={images[previewIndex].image_url}
              alt="Preview"
              className="max-w-[90vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl select-none"
              draggable={false}
            />
            {/* Date badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                {new Date(images[previewIndex].created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
          </motion.div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); setPreviewIndex((previewIndex + 1) % images.length); }}
            className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition backdrop-blur-sm"
          >
            <ChevronRight size={28} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto px-2 pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={(e) => { e.stopPropagation(); setPreviewIndex(i); }}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === previewIndex ? 'border-rose-400 scale-110' : 'border-transparent opacity-50 hover:opacity-80'}`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete Password Modal */}
      {(deletingId || deletingMultiple) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold font-nghe-thuat text-rose-600 dark:text-rose-400">
                {deletingMultiple ? `Xóa ${selectedIds.length} bức ảnh?` : 'Xóa bức ảnh này?'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bạn cần nhập mật khẩu bí mật (như ở Vườn Lưu Bút) để có quyền xóa ảnh.
              </p>

              <div className="pt-2">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(false); }}
                  placeholder="Nhập mật khẩu..."
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all text-center tracking-widest bg-zinc-50 dark:bg-zinc-800 ${deleteError ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-rose-100 dark:border-zinc-700 focus:border-rose-400'}`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmDelete();
                    if (e.key === 'Escape') cancelDelete();
                  }}
                />
                {deleteError && (
                  <p className="text-xs text-red-500 mt-2 font-medium">Mật khẩu không đúng! Gợi ý: Ngày kỷ niệm 😉</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"
                >
                  HỦY
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition shadow-lg shadow-red-200 dark:shadow-none"
                >
                  XÓA ẢNH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
