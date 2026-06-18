'use client';

import ArchiveFeed from '@/lib/components/ArchiveFeed';
import FormEditor from '@/lib/components/FormEditor';
import GallerySlider from '@/lib/components/GallerySlider';
import MarqueeTicker from '@/lib/components/MarqueeTicker';
import NewspaperPreview from '@/lib/components/NewspaperPreview';
import PressStudio from '@/lib/components/PressStudio';
import { useLuuBut } from '@/lib/hooks/useLuuBut';
import { useWebcamCard } from '@/lib/hooks/useWebcamCard';
import { useState } from 'react';


export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { formData, luuButList, loading, updateField, formatDropCapText, submitLuuBut } = useLuuBut();
  
  const {
    tenThe, setTenThe, anhChupThe, videoRef, canvasRef, theCardRef, moCamera, chupAnh, taiThePhongVien
  } = useWebcamCard();

  const chuyenCheDo = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('che-do-dem');
    } else {
      document.body.classList.remove('che-do-dem');
    }
  };

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
              <a href="#studio-anh" className="hover:text-rose-500 transition">Studio Thẻ</a>
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
      <section id="trang-chu" className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-block bg-rose-100/60 text-rose-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-rose-200">
            🌸 Mùa hoa tốt nghiệp năm 2026
          </div>
          <h1 className="font-bao-chi text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none text-gray-900 dark:text-white">
            PHAN NGỌC MAI.
          </h1>
          <p className="font-nghe-thuat text-2xl text-rose-400 italic">
            &quot;Cây bút trẻ, hoài bão lớn và trang hành trình thanh xuân rực rỡ.&quot;
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <a href="#studio-anh" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs uppercase tracking-widest font-bold px-6 py-4 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-lg">
              Cấp Thẻ Phóng Viên Đặc Nhiệm 📸
            </a>
          </div>
        </div>

        {/* Khung ảnh quét sáng */}
        <div className="lg:col-span-4 lg:col-start-9 flex justify-center items-center">
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
        </div>
      </section>

      {/* 2. Góc triển lãm ảnh vô tận */}
      <GallerySlider />

      {/* 3. Studio Thẻ Nhà Báo */}
      <PressStudio 
        tenThe={tenThe} setTenThe={setTenThe} anhChupThe={anhChupThe}
        videoRef={videoRef} canvasRef={canvasRef} theCardRef={theCardRef}
        moCamera={moCamera} chupAnh={chupAnh} taiThePhongVien={taiThePhongVien}
      />

      {/* 4. Phân hệ thiết kế trang nhất */}
      <section id="thiet-ke-bao" className="py-20 border-t border-rose-200/20 bg-rose-50/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <FormEditor formData={formData} updateField={updateField} onSubmit={submitLuuBut} loading={loading} />
          </div>
          <div className="lg:col-span-7 flex justify-center">
            <NewspaperPreview formData={formData} formatDropCapText={formatDropCapText} />
          </div>
        </div>
      </section>

      {/* 5. Kho lưu trữ bài viết đã xuất bản */}
      <section id="kho-luu-tru" className="py-20 border-t max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-500 block">● KHO LƯU TRỮ TOÀ SOẠN</span>
          <h2 className="font-bao-chi text-4xl font-bold text-gray-900 dark:text-white">Các Bài Phóng Sự Đã Xuất Bản</h2>
        </div>
        <ArchiveFeed list={luuButList} />
      </section>

      <footer className="py-12 text-center text-xs tracking-widest opacity-50 font-mono border-t border-rose-200/20">
          © 2026 TÒA SOẠN DI ĐỘNG PHAN NGỌC MAI. GIỮ TRỌN KÝ ỨC THANH XUÂN.
      </footer>
    </div>
  );
}