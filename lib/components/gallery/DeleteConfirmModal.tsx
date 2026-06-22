'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  deletingMultiple: boolean;
  selectedCount: number;
  deletePassword: string;
  deleteError: boolean;
  onPasswordChange: (password: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  deletingMultiple,
  selectedCount,
  deletePassword,
  deleteError,
  onPasswordChange,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trash2 size={28} />
          </div>
          <h3 className="text-xl font-bold font-nghe-thuat text-rose-600 dark:text-rose-400">
            {deletingMultiple ? `Xóa ${selectedCount} bức ảnh?` : 'Xóa bức ảnh này?'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bạn cần nhập mật khẩu bí mật (như ở Vườn Lưu Bút) để có quyền xóa ảnh.
          </p>

          <div className="pt-2">
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => { onPasswordChange(e.target.value); }}
              placeholder="Nhập mật khẩu..."
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all text-center tracking-widest bg-zinc-50 dark:bg-zinc-800 ${
                deleteError
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-rose-100 dark:border-zinc-700 focus:border-rose-400'
              }`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm();
                if (e.key === 'Escape') onCancel();
              }}
            />
            {deleteError && (
              <p className="text-xs text-red-500 mt-2 font-medium">Mật khẩu không đúng! Gợi ý: Ngày kỷ niệm 😉</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"
            >
              HỦY
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition shadow-lg shadow-red-200 dark:shadow-none"
            >
              XÓA ẢNH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
