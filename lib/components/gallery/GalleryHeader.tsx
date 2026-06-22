'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Upload, Trash2, Loader2, Move, Save,
  LayoutGrid, Columns, MoreVertical, CheckSquare,
} from 'lucide-react';

interface GalleryHeaderProps {
  isSelectionMode: boolean;
  isReorderMode: boolean;
  selectedCount: number;
  uploading: boolean;
  uploadProgress: { done: number; total: number } | null;
  reordering: boolean;
  viewMode: 'grid' | 'masonry';
  columnsCount: 2 | 3 | 4;
  hasImages: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onSetViewMode: (mode: 'grid' | 'masonry') => void;
  onSetColumnsCount: (n: 2 | 3 | 4) => void;
  onToggleSelectionMode: () => void;
  onRequestMultipleDelete: () => void;
  onStartReorder: () => void;
  onCancelReorder: () => void;
  onSaveOrder: () => void;
  onUploadClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function GalleryHeader({
  isSelectionMode, isReorderMode, selectedCount, uploading, uploadProgress,
  reordering, viewMode, columnsCount, hasImages, isMobileMenuOpen,
  onToggleMobileMenu, onSetViewMode, onSetColumnsCount,
  onToggleSelectionMode, onRequestMultipleDelete,
  onStartReorder, onCancelReorder, onSaveOrder,
  onUploadClick, onFileChange, fileInputRef,
}: GalleryHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-rose-200/40 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[64px] py-2 flex flex-wrap items-center justify-between gap-y-2">
        <Link href="/" className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium hover:text-rose-700 transition">
          <ArrowLeft size={18} />
          <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Quay lại Trang Chủ</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end ml-auto">
          {isSelectionMode ? (
            <SelectionToolbar
              selectedCount={selectedCount}
              onCancel={onToggleSelectionMode}
              onDelete={onRequestMultipleDelete}
            />
          ) : isReorderMode ? (
            <ReorderToolbar reordering={reordering} onCancel={onCancelReorder} onSave={onSaveOrder} />
          ) : (
            <DefaultToolbar
              viewMode={viewMode}
              columnsCount={columnsCount}
              hasImages={hasImages}
              uploading={uploading}
              uploadProgress={uploadProgress}
              isMobileMenuOpen={isMobileMenuOpen}
              fileInputRef={fileInputRef}
              onSetViewMode={onSetViewMode}
              onSetColumnsCount={onSetColumnsCount}
              onToggleMobileMenu={onToggleMobileMenu}
              onToggleSelectionMode={onToggleSelectionMode}
              onStartReorder={onStartReorder}
              onUploadClick={onUploadClick}
              onFileChange={onFileChange}
            />
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── Sub-toolbars ─── */

function SelectionToolbar({ selectedCount, onCancel, onDelete }: {
  selectedCount: number; onCancel: () => void; onDelete: () => void;
}) {
  return (
    <>
      <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
        HỦY
      </button>
      <button
        onClick={onDelete}
        disabled={selectedCount === 0}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition shadow-lg shadow-red-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={16} />
        <span>XÓA ({selectedCount})</span>
      </button>
    </>
  );
}

function ReorderToolbar({ reordering, onCancel, onSave }: {
  reordering: boolean; onCancel: () => void; onSave: () => void;
}) {
  return (
    <>
      <button onClick={onCancel} disabled={reordering} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
        HỦY
      </button>
      <button
        onClick={onSave}
        disabled={reordering}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition shadow-lg shadow-green-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {reordering ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        <span>LƯU VỊ TRÍ</span>
      </button>
    </>
  );
}

interface DefaultToolbarProps {
  viewMode: 'grid' | 'masonry';
  columnsCount: 2 | 3 | 4;
  hasImages: boolean;
  uploading: boolean;
  uploadProgress: { done: number; total: number } | null;
  isMobileMenuOpen: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSetViewMode: (mode: 'grid' | 'masonry') => void;
  onSetColumnsCount: (n: 2 | 3 | 4) => void;
  onToggleMobileMenu: () => void;
  onToggleSelectionMode: () => void;
  onStartReorder: () => void;
  onUploadClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DefaultToolbar({
  viewMode, columnsCount, hasImages, uploading, uploadProgress,
  isMobileMenuOpen, fileInputRef,
  onSetViewMode, onSetColumnsCount, onToggleMobileMenu,
  onToggleSelectionMode, onStartReorder, onUploadClick, onFileChange,
}: DefaultToolbarProps) {
  return (
    <>
      {/* Desktop toolbar */}
      <div className="hidden sm:flex items-center gap-2 lg:gap-3">
        <div className="flex items-center bg-rose-50 dark:bg-zinc-800 rounded-full p-1 border border-rose-100 dark:border-zinc-700">
          <button
            onClick={() => onSetViewMode('grid')}
            className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="Chế độ lưới vuông"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onSetViewMode('masonry')}
            className={`p-1.5 rounded-full transition-colors ${viewMode === 'masonry' ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="Chế độ lưới tự do"
          >
            <Columns size={16} />
          </button>
          <div className="w-px h-4 bg-rose-200 dark:bg-zinc-600 mx-1" />
          {([2, 3, 4] as const).map((num) => (
            <button
              key={num}
              onClick={() => onSetColumnsCount(num)}
              className={`w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-bold transition-colors ${columnsCount === num ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title={`${num} cột`}
            >
              {num}
            </button>
          ))}
        </div>
        {hasImages && (
          <>
            <button onClick={onStartReorder} className="px-4 py-2 text-xs font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-full transition">
              SẮP XẾP
            </button>
            <button onClick={onToggleSelectionMode} className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-full transition">
              CHỌN NHIỀU
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden relative">
        <button
          onClick={onToggleMobileMenu}
          className={`p-2.5 rounded-full border transition-colors ${isMobileMenuOpen ? 'bg-rose-100 dark:bg-zinc-700 border-rose-200 dark:border-zinc-600 text-rose-600 dark:text-rose-400' : 'bg-rose-50 dark:bg-zinc-800 border-rose-100 dark:border-zinc-700 text-gray-500 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-zinc-700'}`}
        >
          <MoreVertical size={16} />
        </button>

        {isMobileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-rose-100 dark:border-zinc-800 overflow-hidden flex flex-col z-[100]">
            {hasImages && (
              <>
                <button onClick={() => { onStartReorder(); onToggleMobileMenu(); }} className="px-4 py-3 text-left text-xs font-bold text-indigo-500 hover:bg-rose-50 dark:hover:bg-zinc-800 flex items-center gap-2">
                  <Move size={14} /> Sắp xếp ảnh
                </button>
                <button onClick={() => { onToggleSelectionMode(); onToggleMobileMenu(); }} className="px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 border-b border-rose-50 dark:border-zinc-800 flex items-center gap-2">
                  <CheckSquare size={14} /> Chọn nhiều ảnh
                </button>
              </>
            )}
            <div className="px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/30">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-2">Chế độ xem</p>
              <div className="flex gap-2 mb-3">
                <button onClick={() => onSetViewMode('grid')} className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors border ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 border-rose-200 dark:border-zinc-600 text-rose-500' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}><LayoutGrid size={14} /></button>
                <button onClick={() => onSetViewMode('masonry')} className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors border ${viewMode === 'masonry' ? 'bg-white dark:bg-zinc-700 border-rose-200 dark:border-zinc-600 text-rose-500' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}><Columns size={14} /></button>
              </div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-2">Số cột</p>
              <div className="flex gap-1">
                {([2, 3, 4] as const).map(num => (
                  <button key={num} onClick={() => onSetColumnsCount(num)} className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors border ${columnsCount === num ? 'bg-white dark:bg-zinc-700 border-rose-200 dark:border-zinc-600 text-rose-500' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>{num}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" multiple className="hidden" />

      {/* Upload button */}
      <button
        onClick={onUploadClick}
        disabled={uploading}
        className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-2.5 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold tracking-widest transition shadow-lg shadow-rose-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
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
  );
}
