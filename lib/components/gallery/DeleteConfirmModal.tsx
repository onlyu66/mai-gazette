'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeleteConfirmModalProps {
  deletingMultiple: boolean;
  selectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  deletingMultiple,
  selectedCount,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <motion.div 
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

          <p className="pt-1 text-sm text-rose-400 dark:text-rose-300 italic whitespace-nowrap">
            {deletingMultiple
              ? `🌸 ${selectedCount} bức ảnh sẽ biến mất mãi mãi đó Mai ơi...`
              : '🌸 Bức ảnh này sẽ biến mất mãi mãi đó Mai ơi...'}
          </p>

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
