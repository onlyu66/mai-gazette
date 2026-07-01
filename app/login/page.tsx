'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase chưa được cấu hình.');
      return;
    }

    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Đăng nhập thất bại: ' + error.message);
      setLoading(false);
    } else {
      toast.success('Đăng nhập thành công! Chào mừng Mai 🌸');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/30 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float-reverse"></div>
      </div>

      <Link href="/" className="absolute top-8 left-8 z-10 flex items-center text-rose-600 dark:text-rose-400 font-bold hover:text-rose-700 transition">
        <ArrowLeft className="mr-2" size={20} /> Về Trang Chủ
      </Link>

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
              <img src="/avatar.jpg" alt="Mai" className="w-full h-full object-cover object-[50%_40%]" />
            </motion.div>
            <h1 className="font-nghe-thuat italic text-3xl font-bold text-rose-600 dark:text-rose-400 mb-2">
              Chào mừng trở lại!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Đăng nhập để quản lý Vườn Lưu Bút của bạn 🌷
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 dark:text-zinc-500">
                <User size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của Mai..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-rose-100 dark:border-zinc-700 focus:border-rose-400 dark:focus:border-rose-500 focus:outline-none transition-colors duration-300 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 dark:text-zinc-500">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu..."
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

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(244, 63, 94, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-rose-500 hover:brightness-110 text-white shadow-lg shadow-rose-200 dark:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest mt-2"
            >
              {loading ? 'Đang xác thực...' : 'Vào Vườn Lưu Bút'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
