'use client';

import ArchiveFeed from '@/lib/components/ArchiveFeed';
import FormEditor from '@/lib/components/FormEditor';
import GallerySlider from '@/lib/components/GallerySlider';
import { MagneticButton } from '@/lib/components/MagneticButton';
import MarqueeTicker from '@/lib/components/MarqueeTicker';
import NewspaperPreview from '@/lib/components/NewspaperPreview';
import PressStudio from '@/lib/components/PressStudio';
import { useLuuBut } from '@/lib/hooks/useLuuBut';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/contexts/AuthContext';
import ImageWithSkeleton from '@/lib/components/ImageWithSkeleton';
import Link from 'next/link';
import { Camera, LogIn, LogOut } from 'lucide-react';
import { getGraduateImagePreference, saveGraduateImagePreference, uploadGalleryImage } from '@/lib/services/api';
import toast from 'react-hot-toast';


export default function Home() {
  const { theme, setTheme } = useTheme();
  // mounted prevents hydration mismatch — server always renders neutral state
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const isDarkMode = mounted && theme === 'dark';

  const { formData, luuButList, loading, hasMore, loadingMore, loadMore, updateField, formatDropCapText, submitLuuBut, searchLuuBut } = useLuuBut();

  // Secret trigger for ArchiveFeed: reveal only after long press if anonymous,
  // or show immediately when the user is logged in.
  const { user, signOut } = useAuth();
  const [secretArchiveUnlocked, setSecretArchiveUnlocked] = useState(false);
  const showSecretArchive = Boolean(user) || secretArchiveUnlocked;
  const queryClient = useQueryClient();
  const [graduateImageUrl, setGraduateImageUrl] = useState<string | null>(null);
  const [pendingGraduateImageUrl, setPendingGraduateImageUrl] = useState<string | null>(null);
  const [uploadingGraduateImage, setUploadingGraduateImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const profileId = user?.id ?? '00000000-0000-0000-0000-000000000000';

  const saveGraduateImageMutation = useMutation({
    mutationFn: ({
      userId,
      imageUrl,
      previousImageUrl,
    }: {
      userId: string;
      imageUrl: string;
      previousImageUrl?: string | null;
    }) => saveGraduateImagePreference(userId, imageUrl, previousImageUrl),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['graduateImage', variables.userId] });
      setPendingGraduateImageUrl(variables.imageUrl);
      toast.success('Đã cập nhật ảnh tân cử nhân');
    },
    onError: (error) => {
      toast.error(`Cập nhật ảnh thất bại: ${error instanceof Error ? error.message : String(error)}`);
    },
  });

  const graduateImageQuery = useQuery({
    queryKey: ['graduateImage', profileId],
    queryFn: () => getGraduateImagePreference(profileId),
    enabled: mounted,
    staleTime: 30_000,
  });

  const currentGraduateImageUrl = pendingGraduateImageUrl ?? graduateImageUrl ?? graduateImageQuery.data ?? '/avatar.jpg';
  const isGraduateImageLoadingState = !mounted || graduateImageQuery.isLoading || uploadingGraduateImage || saveGraduateImageMutation.isPending || Boolean(pendingGraduateImageUrl);
  const graduateImageErrorState = graduateImageQuery.isError || saveGraduateImageMutation.isError;


  const handleGraduateImageLoaded = () => {
    if (pendingGraduateImageUrl) {
      setGraduateImageUrl(pendingGraduateImageUrl);
    }
    setPendingGraduateImageUrl(null);
  };

  const handleGraduateImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp ảnh hợp lệ');
      return;
    }

    setUploadingGraduateImage(true);

    try {
      const uploadedUrl = await uploadGalleryImage(file, file.type);
      if (!uploadedUrl) {
        toast.error('Không thể tải ảnh lên. Vui lòng thử lại');
        return;
      }

      await saveGraduateImageMutation.mutateAsync({
        userId: user.id,
        imageUrl: uploadedUrl,
        previousImageUrl: graduateImageUrl,
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật ảnh tân cử nhân:', error);
    } finally {
      setUploadingGraduateImage(false);
      event.target.value = '';
    }
  };

  const startPress = () => {
    if (user) {
      document.getElementById('kho-luu-tru')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (secretArchiveUnlocked) return;

    pressTimer.current = setTimeout(() => {
      setSecretArchiveUnlocked(true);
      setTimeout(() => {
        document.getElementById('kho-luu-tru')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000); // Giữ 2 giây
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

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
          <a href="#trang-chu" className="font-bao-chi text-base md:text-xl font-bold tracking-widest text-rose-700">LƯU BÚT TỐT NGHIỆP</a>
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex space-x-6 text-xs uppercase tracking-widest font-semibold opacity-80">
              <a href="#goc-trien-lam" className="hover:text-rose-500 transition">Triển Lãm Ảnh</a>
              <a href="#studio-anh" className="hover:text-rose-500 transition">Photobooth</a>
              <a href="#thiet-ke-bao" className="hover:text-rose-500 transition">Viết Lưu Bút</a>
              {showSecretArchive && <a href="#kho-luu-tru" className="hover:text-rose-500 transition">Đọc Lưu Bút</a>}
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <button onClick={() => signOut()} className="flex items-center justify-center w-8 h-8 md:w-auto md:px-4 md:py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full text-xs font-bold tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shadow-sm" title="Đăng xuất">
                  <LogOut size={14} className="md:mr-2" />
                  <span className="hidden md:inline">ĐĂNG XUẤT</span>
                </button>
              ) : (
                <Link href="/login" className="flex items-center justify-center w-8 h-8 md:w-auto md:px-4 md:py-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-full text-xs font-bold tracking-wider hover:bg-rose-100 dark:hover:bg-rose-900/50 transition shadow-sm" title="Đăng nhập cho Mai">
                  <LogIn size={14} className="md:mr-2" />
                  <span className="hidden md:inline">MAI ĐĂNG NHẬP</span>
                </Link>
              )}
              <button onClick={chuyenCheDo} className="flex items-center space-x-2 bg-rose-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-rose-700 transition shadow-md">
                <span>{isDarkMode ? '☀️' : '🌙'}</span>
                <span className="hidden sm:inline">{isDarkMode ? 'KÝ ỨC BAN MAI' : 'KÝ ỨC SAO ĐÊM'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="trang-chu" className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
        {/* Parallax decorative blobs */}
        <motion.div style={{ y: blobY1 }} className="absolute -top-24 -right-20 pointer-events-none z-0">
          <div className="w-105 h-105 rounded-full bg-rose-100/60 dark:bg-rose-900/10 opacity-50 animate-float" />
        </motion.div>
        <motion.div style={{ y: blobY2 }} className="absolute -bottom-20 -left-16 pointer-events-none z-0">
          <div className="w-72 h-72 rounded-full bg-rose-200/40 dark:bg-rose-800/10 opacity-30 animate-float-reverse" />
        </motion.div>

        <div className="lg:col-span-7 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block bg-rose-100/60 text-rose-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-rose-200"
          >
            Mùa tốt nghiệp năm 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-bao-chi text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none text-[#2E1F20] dark:text-white"
          >
            PHAN NGỌC MAI.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-nghe-thuat text-2xl text-rose-400 italic"
          >
            &quot;Chuyến tàu thanh xuân khép lại, mở ra những chân trời mới rực rỡ.&quot;
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-2 flex flex-wrap gap-4"
          >
            <MagneticButton>
              <a href="#thiet-ke-bao" className="bg-[#2E1F20] text-white dark:bg-white dark:text-[#2E1F20] text-xs uppercase tracking-widest font-bold px-6 py-4 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-lg inline-block">
                Viết lưu bút cho Ngọc Mai được hem?
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Khung ảnh quét sáng */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -9, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3, type: 'spring' },
            scale: { duration: 0.8, delay: 0.3, type: 'spring' },
            y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="lg:col-span-4 lg:col-start-9 flex justify-center items-center relative z-10"
        >
          {/* Pulsating glow background */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-rose-400/20 dark:bg-rose-600/20 blur-xl rounded-full -z-10 w-[80%] h-[80%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />

          <div className="relative group w-full max-w-85 aspect-3/4 rounded-2xl p-3.5 shadow-xl hover:-translate-y-2 hover:rotate-1 transition-all duration-700 ease-out grid grid-cols-1">
            {/* Animated Frame Background/Border */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], boxShadow: ['0 0 5px rgba(244,114,182,0.2)', '0 0 20px rgba(244,114,182,0.6)', '0 0 5px rgba(244,114,182,0.2)'] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/60 via-rose-50/30 to-rose-100/40 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-rose-950/30 backdrop-blur-md border border-rose-200/40 dark:border-zinc-800 pointer-events-none group-hover:opacity-100! group-hover:shadow-[0_0_20px_rgba(244,114,182,0.6)]!"
            />
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
              <div className="w-1/2 h-full bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-hieu-ung-quet-sang"></div>
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden border border-rose-200/60 relative bg-[#2A1B1C]">
              {isGraduateImageLoadingState && (
                <div className="absolute inset-0 z-20 overflow-hidden bg-[#2A1B1C]">
                  <div className="absolute inset-0 bg-linear-to-br from-rose-950/80 via-zinc-900 to-rose-950/70 animate-pulse" />
                  <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(244,114,182,0.18),transparent_30%)] animate-pulse" />
                  <div className="absolute left-4 top-4 h-8 w-24 rounded-full bg-white/10 blur-sm animate-pulse" />
                  <div className="absolute bottom-4 left-4 h-3 w-32 rounded-full bg-white/10 animate-pulse" />
                  <div className="absolute bottom-4 right-4 h-3 w-20 rounded-full bg-white/10 animate-pulse" />
                  <div className="absolute inset-0 rounded-xl border border-white/10" />
                </div>
              )}
              {currentGraduateImageUrl ? (
                <ImageWithSkeleton
                  src={currentGraduateImageUrl}
                  alt="Phan Ngọc Mai"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                  onLoad={handleGraduateImageLoaded}
                  className={`opacity-85 group-hover:scale-105 transition duration-700 object-[50%_40%] ${isGraduateImageLoadingState ? 'opacity-0' : 'opacity-85'}`}
                  shimmerClassName="bg-[#2A1B1C]"
                />
              ) : null}
              {graduateImageErrorState && (
                <div className="absolute top-3 left-3 z-30 rounded-full bg-black/60 px-2 py-1 text-[9px] uppercase tracking-[0.25em] text-white/80">
                  Ảnh chưa sẵn sàng
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-[#1A0E0F] via-black/10 to-black/40 mix-blend-multiply"></div>
              {user && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-600 shadow-lg transition hover:bg-white"
                  >
                    {uploadingGraduateImage ? 'Đang tải...' : <><Camera size={14} /> Đổi ảnh</>}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleGraduateImageUpload}
                  />
                </>
              )}
              <div className="absolute bottom-0 left-0 w-full p-5 text-white z-20 space-y-1">
                <p className="font-bao-chi text-[10px] tracking-[0.3em] text-rose-400 font-bold uppercase">Graduation 2026</p>
                <h4 className="font-nghe-thuat text-xl font-bold text-[#FFE8BC]">Tân Cử Nhân</h4>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Góc triển lãm ảnh vô tận */}
      <GallerySlider />

      {/* 3. Studio Kỷ Yếu */}
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
              Mỗi lời chúc của bạn sẽ được lưu lại mãi mãi trong cuốn lưu bút kỷ yếu đặc biệt này
            </p>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 w-full max-w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-5 min-w-0 w-full"
            >
              <FormEditor formData={formData} updateField={updateField} onSubmit={submitLuuBut} loading={loading} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-7 min-w-0 w-full flex justify-center items-start lg:sticky lg:top-24"
            >
              <NewspaperPreview formData={formData} formatDropCapText={formatDropCapText} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Vườn lưu bút (Secret Mode) */}
      <AnimatePresence>
        {showSecretArchive && (
          <motion.section 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            id="kho-luu-tru" className="py-20 border-t max-w-6xl mx-auto px-6 w-full" style={{ borderColor: 'var(--border-section)' }}>
            <div className="text-center mb-12 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-400 block">✦ Vườn kỷ niệm</span>
              <h2 className="font-nghe-thuat italic text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
                Những Trang Lưu Bút Gửi Đến Mai
              </h2>
              <p className="text-sm text-rose-300 max-w-sm mx-auto">
                Từng lời chúc là một bông hoa trong vườn thanh xuân 🌷
              </p>
            </div>
            <ArchiveFeed
              list={luuButList}
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={loadMore}
              onSearch={searchLuuBut}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="relative mt-20 border-t overflow-hidden" style={{ borderColor: 'var(--border-section)', background: 'var(--bg-section-2)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 animate-float-reverse"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-nghe-thuat text-4xl md:text-5xl font-bold italic" style={{ color: 'var(--text-heading)' }}>
              Phan Ngọc Mai
            </h2>
            <p className="font-bao-chi text-sm md:text-base tracking-[0.15em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              Cử Nhân Báo Chí · Khóa 2022 - 2026
            </p>
          </div>

          <div className="w-16 h-0.5 rounded-full bg-linear-to-r from-transparent via-rose-300 to-transparent"></div>

          <p className="text-sm max-w-lg leading-relaxed italic" style={{ color: 'var(--mau-chu)', opacity: 0.8, fontFamily: 'var(--font-playfair), serif' }}>
            &quot;Cảm ơn bạn đã ghé thăm góc nhỏ lưu giữ những kỷ niệm đẹp nhất của thanh xuân. Chúc chúng ta của sau này, rực rỡ và bình an.&quot;
          </p>

          <div className="flex gap-6 pt-4">
            {showSecretArchive && (
              <a href="#kho-luu-tru" aria-label="Đọc Lưu Bút" className="w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-200/50" style={{ borderColor: 'var(--border-card)', background: 'var(--khung-kinh)', color: 'var(--text-heading)' }}>
                📘
              </a>
            )}
            <a href="#studio-anh" aria-label="Studio Kỷ Yếu" className="w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-200/50" style={{ borderColor: 'var(--border-card)', background: 'var(--khung-kinh)', color: 'var(--text-heading)' }}>
              📸
            </a>
            <a href="#thiet-ke-bao" aria-label="Viết Lưu Bút" className="w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-200/50" style={{ borderColor: 'var(--border-card)', background: 'var(--khung-kinh)', color: 'var(--text-heading)' }}>
              💌
            </a>
          </div>

          <div className="pt-8 w-full border-t border-rose-100/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
            <p>© 2026 MAI&apos;S GRADUATION</p>
            <p className="flex items-center gap-1.5 select-none">MADE WITH <span 
              className="text-rose-500 text-sm animate-pulse cursor-pointer hover:scale-125 transition-transform"
              onMouseDown={startPress}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={startPress}
              onTouchEnd={cancelPress}
            >❤️</span> BY BẠN</p>
          </div>
        </div>
      </footer>
    </div>
  );
}