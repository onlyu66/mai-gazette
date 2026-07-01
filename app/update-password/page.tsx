'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase chưa được cấu hình.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      toast.error('Cập nhật thất bại: ' + error.message);
      setLoading(false);
    } else {
      toast.success('Cập nhật mật khẩu thành công! 🌸');
      router.push('/');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-rose-50/30 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  // Nếu không đăng nhập thì chuyển về trang login
  if (!user) {
    if (typeof window !== 'undefined') router.replace('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-rose-50/30 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float-reverse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-rose-100 dark:border-zinc-800">
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl mb-4"
            >
              <Image src="/avatar.jpg" alt="Mai" className="w-full h-full object-cover object-[50%_40%]" />
            </motion.div>
            <h1 className="font-nghe-thuat italic text-3xl font-bold text-rose-600 dark:text-rose-400 mb-2">
              Thiết lập mật khẩu
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hãy tạo mật khẩu để đăng nhập cho các lần sau nhé! 🌷
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 dark:text-zinc-500">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu mới..."
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-rose-100 dark:border-zinc-700 focus:border-rose-400 dark:focus:border-rose-500 focus:outline-none transition-colors duration-300 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-300 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 dark:text-zinc-500">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu..."
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-rose-100 dark:border-zinc-700 focus:border-rose-400 dark:focus:border-rose-500 focus:outline-none transition-colors duration-300 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(244, 63, 94, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-rose-500 hover:brightness-110 text-white shadow-lg shadow-rose-200 dark:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest mt-2"
            >
              {loading ? 'Đang cập nhật...' : 'Xác nhận'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
