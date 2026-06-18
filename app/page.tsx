'use client';

import ArchiveFeed from '@/lib/components/ArchiveFeed';
import FormEditor from '@/lib/components/FormEditor';
import GallerySlider from '@/lib/components/GallerySlider';
import { MagneticButton } from '@/lib/components/MagneticButton';
import MarqueeTicker from '@/lib/components/MarqueeTicker';
import NewspaperPreview from '@/lib/components/NewspaperPreview';
import PressStudio from '@/lib/components/PressStudio';
import { useLuuBut } from '@/lib/hooks/useLuuBut';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';


export default function Home() {
  const { theme, setTheme } = useTheme();
  // mounted prevents hydration mismatch — server always renders neutral state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDarkMode = mounted && theme === 'dark';

  const { formData, luuButList, loading, updateField, formatDropCapText, submitLuuBut } = useLuuBut();

  // Parallax scroll
  const { scrollY } = useScroll();
  const blobY1 = useTransform(scrollY, [0, 1000], [0, 260]);
  const blobY2 = useTransform(scrollY, [0, 1000], [0, -180]);

  const chuyenCheDo = () => setTheme(isDarkMode ? 'light' : 'dark');

  return (
    <div className="min-h-screen transition-colors duration-500">
      {/* 1. Ticker chạy chữ đầu trang */}
      <MarqueeTicker />

      {/* Navigation Header */}
      <header className="border-b border-rose-200/20 sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'var(--khung-kinh)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#trang-chu" className="font-bao-chi text-xl font-bold tracking-widest text-rose-700">N°MAI.GAZETTE</a>
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex space-x-6 text-xs uppercase tracking-widest font-semibold opacity-80">
              <a href="#goc-trien-lam" className="hover:text-rose-500 transition">Triển Lãm Ảnh</a>
              <a href="#studio-anh" className="hover:text-rose-500 transition">Photobooth</a>
              <a href="#thiet-ke-bao" className="hover:text-rose-500 transition">Thiết Kế Trang Nhất</a>
              <a href="#kho-luu-tru" className="hover:text-rose-500 transition">Đọc Lưu Bút</a>
            </nav>
            <button onClick={chuyenCheDo} className="flex items-center space-x-2 bg-rose-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-rose-700 transition shadow-md">
              <span>{isDarkMode ? '☀️' : '🌙'}</span> 
              <span>{isDarkMode ? 'TÒA SOẠN BÌNH MINH' : 'TÒA SOẠN 0 GIỜ'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="trang-chu" className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
        {/* Parallax decorative blobs */}
        <motion.div style={{ y: blobY1 }} className="absolute -top-24 -right-20 pointer-events-none -z-0">
          <div className="w-[420px] h-[420px] rounded-full bg-rose-100/60 dark:bg-rose-900/10 opacity-50 animate-float" />
        </motion.div>
        <motion.div style={{ y: blobY2 }} className="absolute -bottom-20 -left-16 pointer-events-none -z-0">
          <div className="w-72 h-72 rounded-full bg-rose-200/40 dark:bg-rose-800/10 opacity-30 animate-float-reverse" />
        </motion.div>

        <div className="lg:col-span-7 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block bg-rose-100/60 text-rose-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-rose-200"
          >
            🌸 Mùa hoa tốt nghiệp năm 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-bao-chi text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none text-gray-900 dark:text-white"
          >
            PHAN NGỌC MAI.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-nghe-thuat text-2xl text-rose-400 italic"
          >
            &quot;Cây bút trẻ, hoài bão lớn và trang hành trình thanh xuân rực rỡ.&quot;
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-2 flex flex-wrap gap-4"
          >
            <MagneticButton>
              <a href="#studio-anh" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs uppercase tracking-widest font-bold px-6 py-4 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-lg inline-block">
                Chụp Ảnh Photobooth Kỷ Niệm 📸
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Khung ảnh quét sáng */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
          className="lg:col-span-4 lg:col-start-9 flex justify-center items-center relative z-10"
        >
          <div className="relative group w-full max-w-[340px] aspect-[3/4] rounded-2xl p-3.5 bg-gradient-to-br from-white/60 via-rose-50/30 to-rose-100/40 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-rose-950/30 backdrop-blur-md border border-rose-200/40 dark:border-zinc-800 shadow-xl hover:-translate-y-2 hover:rotate-1 transition-all duration-700 ease-out grid grid-cols-1">
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-hieu-ung-quet-sang"></div>
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden border border-rose-200/60 relative bg-[#2A1B1C]">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600" alt="Phan Ngọc Mai" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E0F] via-black/10 to-black/40 mix-blend-multiply"></div>
              <div className="absolute bottom-0 left-0 w-full p-5 text-white z-20 space-y-1">
                <p className="font-bao-chi text-[10px] tracking-[0.3em] text-rose-400 font-bold uppercase">Graduation 2026</p>
                <h4 className="font-nghe-thuat text-xl font-bold text-[#FFE8BC]">Nàng Thơ Báo Chí</h4>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Góc triển lãm ảnh vô tận */}
      <GallerySlider />

      {/* 3. Studio Thẻ Nhà Báo */}
      <PressStudio />

      {/* 4. Phân hệ viết lưu bút */}
      <section id="thiet-ke-bao" className="py-20 border-t"
        style={{ background: 'var(--bg-section-1)', borderColor: 'var(--border-section)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-400 block">✦ Gửi lời yêu thương</span>
            <h2 className="font-nghe-thuat italic text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
              Viết Trang Lưu Bút Cho Mai
            </h2>
            <p className="text-sm text-rose-300 max-w-md mx-auto leading-relaxed">
              Mỗi lời chúc của bạn sẽ được lưu lại mãi mãi trong tập san kỷ niệm đặc biệt này 🌸
            </p>
          </div>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <FormEditor formData={formData} updateField={updateField} onSubmit={submitLuuBut} loading={loading} />
            </div>
            <div className="lg:col-span-7 flex justify-center items-start">
              <NewspaperPreview formData={formData} formatDropCapText={formatDropCapText} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Vườn lưu bút */}
      <section id="kho-luu-tru" className="py-20 border-t max-w-6xl mx-auto px-6" style={{ borderColor: 'var(--border-section)' }}>
        <div className="text-center mb-12 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-400 block">✦ Vườn kỷ niệm</span>
          <h2 className="font-nghe-thuat italic text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Những Trang Lưu Bút Gửi Đến Mai
          </h2>
          <p className="text-sm text-rose-300 max-w-sm mx-auto">
            Từng lời chúc là một bông hoa trong vườn thanh xuân 🌷
          </p>
        </div>
        <ArchiveFeed list={luuButList} />
      </section>

      <footer className="py-12 text-center text-xs tracking-[0.2em] font-mono border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-section)' }}>
        🌸 © 2026 TẬP SAN KỶ NIỆM TỐT NGHIỆP · PHAN NGỌC MAI · CỬ NHÂN BÁO CHÍ 🌸
      </footer>
    </div>
  );
}