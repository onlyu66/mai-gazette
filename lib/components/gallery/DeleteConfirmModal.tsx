'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div 
        animate={deleteError ? { x: [-15, 15, -15, 15, 0] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
      >
        <div className="text-center space-y-4">
          <motion.div 
            animate={{ y: [0, -6, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
            className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2"
          >
            <Trash2 size={28} />
          </motion.div>
          <h3 className="text-xl font-bold font-nghe-thuat text-rose-600 dark:text-rose-400">
            {deletingMultiple ? `Xóa ${selectedCount} bức ảnh?` : 'Xóa bức ảnh này?'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bạn cần nhập mật khẩu bí mật (như ở Vườn Lưu Bút) để có quyền xóa ảnh.
          </p>

          <div className="pt-2">
            <motion.input
              whileFocus={{ scale: 1.05, boxShadow: '0 0 20px rgba(244, 114, 182, 0.4)' }}
              type="password"
              value={deletePassword}
              onChange={(e) => { onPasswordChange(e.target.value); }}
              placeholder="Nhập mật khẩu..."
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors duration-300 text-center font-bold tracking-widest placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                deleteError
                  ? 'border-red-400 dark:border-red-500/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                  : 'border-rose-100 dark:border-zinc-700 focus:border-rose-400 dark:focus:border-rose-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200'
              }`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm();
                if (e.key === 'Escape') onCancel();
              }}
            />
            {deleteError && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="text-[11px] text-red-500 mt-2 font-medium overflow-hidden"
              >
                Mật khẩu không đúng! Gợi ý: Ngày kỷ niệm 😉
              </motion.p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 hover:brightness-95 dark:bg-zinc-800 dark:hover:brightness-110 text-gray-600 dark:text-gray-300 transition-colors"
            >
              HỦY
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:brightness-110 text-white shadow-lg shadow-red-200 dark:shadow-none"
            >
              XÓA ẢNH
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
