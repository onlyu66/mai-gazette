'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasswordModalProps {
  title: string;
  description?: string;
  passwordError: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  confirmText?: string;
}

export default function PasswordModal({
  title,
  description = 'Bạn cần nhập mật khẩu bí mật (như ở Vườn Lưu Bút) để thực hiện hành động này.',
  passwordError,
  onConfirm,
  onCancel,
  confirmText = 'XÁC NHẬN',
}: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <motion.div 
        animate={passwordError ? { x: [-15, 15, -15, 15, 0] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
      >
        <div className="text-center space-y-4">
          <motion.div 
            animate={{ y: [0, -6, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
            className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2"
          >
            <Lock size={28} />
          </motion.div>
          <h3 className="text-xl font-bold font-nghe-thuat text-rose-600 dark:text-rose-400">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>

          <div className="pt-2">
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: '0 0 20px rgba(244, 114, 182, 0.4)' }}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className={`w-full px-4 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-colors duration-300 text-center font-bold tracking-widest placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                  passwordError
                    ? 'border-red-400 dark:border-red-500/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                    : 'border-rose-100 dark:border-zinc-700 focus:border-rose-400 dark:focus:border-rose-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200'
                }`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onConfirm(password);
                  if (e.key === 'Escape') onCancel();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-rose-300 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
              </button>
            </div>
            {passwordError && (
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
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(244, 63, 94, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => onConfirm(password)}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-rose-500 hover:brightness-110 text-white shadow-lg shadow-rose-200 dark:shadow-none"
            >
              {confirmText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
