'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase chưa được cấu hình.');
      return;
    }

    if (!email) {
      toast.error('Vui lòng nhập email của bạn!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error('Yêu cầu thất bại: ' + error.message);
      setLoading(false);
    } else {
      toast.success('Đã gửi link khôi phục (nếu email tồn tại)! 🌸');
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/30 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float-reverse"></div>
      </div>

      <Link href="/login" className="absolute top-8 left-8 z-10 flex items-center text-rose-600 dark:text-rose-400 font-bold hover:text-rose-700 transition">
        <ArrowLeft className="mr-2" size={20} /> Quay lại đăng nhập
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
              className="w-24 h-24 mx-auto rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-xl mb-4"
            >
              <Mail size={40} />
            </motion.div>
            <h1 className="font-nghe-thuat italic text-3xl font-bold text-rose-600 dark:text-rose-400 mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Đừng lo, chỉ cần nhập email, tôi sẽ gửi link khôi phục cho bạn 🌷
            </p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="flex justify-center text-green-500 mb-4">
                <CheckCircle2 size={64} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Đã gửi email khôi phục</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 pb-4">
                Nếu tài khoản hợp lệ, một email chứa link khôi phục đã được gửi tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) và click vào link để đặt lại mật khẩu mới.
              </p>
              <Link 
                href="/login"
                className="inline-block w-full py-3.5 rounded-xl font-bold text-sm bg-rose-100 dark:bg-zinc-800 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-zinc-700 transition-colors uppercase tracking-widest"
              >
                Trở lại đăng nhập
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 dark:text-zinc-500">
                  <User size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-rose-100 dark:border-zinc-700 focus:border-rose-400 dark:focus:border-rose-500 focus:outline-none transition-colors duration-300 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(244, 63, 94, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-rose-500 hover:brightness-110 text-white shadow-lg shadow-rose-200 dark:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest mt-2"
              >
                {loading ? 'Đang gửi...' : 'Gửi link khôi phục'}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
