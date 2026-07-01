import { useAuth } from '@/lib/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LuuButRecord } from '../types';
import { formatLuuButDate } from '../utils/luu-but-constants';
import LuuButLightbox from './LuuButLightbox';

interface ArchiveFeedProps {
  list: LuuButRecord[];
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => Promise<LuuButRecord[] | null | void> | void;
  onSearch?: (query: string) => void;
}

export default function ArchiveFeed({ list, hasMore = false, loadingMore = false, onLoadMore, onSearch }: ArchiveFeedProps) {
  const { user } = useAuth();
  const [isUnlockedState, setIsUnlockedState] = useState(false);
  const isUnlocked = isUnlockedState || !!user;
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid3' | 'grid2' | 'list'>('grid3');
  const [isBottom, setIsBottom] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LuuButRecord | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 30;
      setIsBottom(atBottom);
      // Trigger load more when near bottom
      if (atBottom && hasMore && !loadingMore && onLoadMore) {
        onLoadMore();
      }
    }
  }, [hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check ngay lần đầu
    checkScroll();

    // Dùng ResizeObserver để theo dõi khi nội dung thay đổi chiều cao (ảnh load xong, animation chạy...)
    const observer = new ResizeObserver(() => {
      checkScroll();
    });

    // Theo dõi chính thẻ cuộn và nội dung bên trong nó
    observer.observe(el);
    if (el.firstElementChild) {
      observer.observe(el.firstElementChild);
    }

    window.addEventListener('resize', checkScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, [list, searchQuery, viewMode, isUnlocked, checkScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      if (onSearch) onSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  // Bỏ filter client-side, hiển thị trực tiếp danh sách được truyền vào
  const filteredList = list;

  const renderedList = useMemo(() => {
    return filteredList.map((item, index) => {
      const isList = viewMode === 'list';
      const isGrid3 = viewMode === 'grid3';
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: (index % 9) * 0.05, type: "spring", bounce: 0.25 }}
          key={item.id}
          onClick={() => setSelectedItem(item)}
          className={`relative rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-rose-100/60 dark:hover:shadow-rose-900/20 ${isList ? 'flex flex-row items-stretch hover:-translate-x-0.5' : 'flex flex-col hover:-translate-y-1'
            } ${!isUnlocked ? 'pointer-events-none' : ''}`}
          style={{
            background: 'var(--bg-card-gradient)',
            boxShadow: '0 4px 20px rgba(244,114,182,0.08), 0 0 0 1px var(--border-card)',
            maxHeight: isList ? '88px' : isGrid3 ? '300px' : '360px',
            height: isList ? '88px' : 'auto',
          }}
        >
          {/* Left accent stripe for list mode / Top stripe for grid */}
          {isList
            ? <div className="w-1 shrink-0 bg-linear-to-b from-rose-200 via-rose-400 to-rose-200 opacity-60" />
            : <div className="h-1 w-full bg-linear-to-r from-rose-200 via-rose-400 to-rose-200 opacity-60" />
          }

          {/* Corner petal (grid only) */}
          {!isList && (
            <div className="pointer-events-none absolute top-3 right-3 opacity-10 rotate-12 select-none">
              <div className="text-2xl animate-gio-thoi" style={{ animationDelay: `${index * 0.2}s` }}>🌸</div>
            </div>
          )}

          {/* Thumbnail image (list mode — left side) */}
          {isList && item.anh_url && (
            <div className="relative w-24 sm:w-28 md:w-36 shrink-0 overflow-hidden">
              <Image
                src={item.anh_url}
                alt="Ảnh kỷ niệm"
                fill
                priority={index < 4}
                sizes="144px"
                className="object-cover group-hover:scale-105 transition duration-700"
              />
            </div>
          )}

          <div className={`p-3 sm:p-4 flex gap-2 sm:gap-3 flex-1 min-w-0 overflow-hidden ${isList ? 'flex-row items-center' : 'flex-col gap-3'
            }`}>


            {/* Ảnh kỷ niệm (grid mode only — list mode shows thumbnail on the left) */}
            {!isList && item.anh_url && (
              <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-rose-100 bg-rose-50/30">
                <Image
                  src={item.anh_url}
                  alt="Ảnh kỷ niệm"
                  fill
                  priority={index < 3}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
            )}

            {/* Nội dung */}
            <div className={`relative min-w-0 overflow-hidden ${isList ? 'flex-1' : 'flex-1 px-1 mt-1'}`}>
              <p
                className="text-sm sm:text-[15px] leading-relaxed smart-break"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontStyle: 'italic',
                  color: 'var(--mau-chu)',
                  opacity: 0.9,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: isList ? 2 : isGrid3 ? 6 : 7,
                  overflow: 'hidden',
                }}
              >
                <span className="text-rose-300/50 text-2xl font-serif not-italic select-none leading-none mr-1 inline-block translate-y-2">&ldquo;</span>
                {item.noi_dung || <span className="text-rose-200 italic font-normal">Không có nội dung</span>}
                <span className="text-rose-300/50 text-2xl font-serif not-italic select-none leading-none ml-1 inline-block translate-y-2">&rdquo;</span>
              </p>
            </div>

            {/* Footer */}
            {!isList && (
              <div className="pt-3 mt-1 border-t border-rose-100/50 flex justify-between items-center shrink-0 smart-break gap-3">
                <span className="text-[10px] font-mono text-rose-300/80 tracking-wider shrink-0 uppercase">
                  {item.created_at ? formatLuuButDate(item.created_at) : ''}
                </span>
                <span 
                  className="font-nghe-thuat italic font-bold text-rose-600 text-[15px] text-right smart-break line-clamp-1"
                  title={item.tac_gia || 'Ẩn danh'}
                >
                  —&nbsp;{item.tac_gia || 'Ẩn danh'}
                </span>
              </div>
            )}

            {/* List mode — author column (always visible, shrink-0) */}
            {isList && (
              <div className="shrink-0 pl-3 border-l border-rose-100/50 flex flex-col justify-center text-right smart-break max-w-27.5 sm:max-w-40">
                <span 
                  className="font-nghe-thuat italic font-bold text-rose-600 text-sm smart-break line-clamp-2"
                  title={item.tac_gia || 'Ẩn danh'}
                >
                  —&nbsp;{item.tac_gia || 'Ẩn danh'}
                </span>
                {item.created_at && (
                  <span className="text-[9px] font-mono text-rose-300/80 mt-1 uppercase tracking-wider">
                    {formatLuuButDate(item.created_at)}
                  </span>
                )}
              </div>
            )}
          </div>

          {!isList && <div className="h-0.5 w-full bg-linear-to-r from-transparent via-rose-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
        </motion.div>
      );
    });
  }, [filteredList, viewMode, isUnlocked]);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password.toLowerCase() === '15042025') {
      setIsUnlockedState(true);
      setShowPasswordModal(false);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="relative">

      {/* ─── LIGHTBOX ─── */}
      {(() => {
        const currentIdx = selectedItem ? filteredList.findIndex(i => i.id === selectedItem.id) : -1;
        const isLast = currentIdx === filteredList.length - 1;
        return (
          <LuuButLightbox
            item={selectedItem}
            prevItem={currentIdx > 0 ? filteredList[currentIdx - 1] : null}
            // When at last item and more can be loaded, pass null to show disabled; when no more, wrap to first
            nextItem={isLast && !hasMore ? filteredList[0] : (currentIdx < filteredList.length - 1 ? filteredList[currentIdx + 1] : null)}
            isLoadingNext={isLast && hasMore && loadingMore}
            currentIndex={currentIdx >= 0 ? currentIdx : undefined}
            total={filteredList.length}
            totalHasMore={hasMore}
            onClose={() => setSelectedItem(null)}
            onPrev={() => { if (currentIdx > 0) setSelectedItem(filteredList[currentIdx - 1]); }}
            onNext={async () => {
              if (currentIdx < filteredList.length - 1) {
                setSelectedItem(filteredList[currentIdx + 1]);
              } else if (hasMore && onLoadMore) {
                // Load next page then navigate to the first newly loaded item
                const newRecords = await onLoadMore();
                if (newRecords && Array.isArray(newRecords) && newRecords.length > 0) {
                  // Wait for React to apply state updates, though we already have the target item
                  setSelectedItem(newRecords[0]);
                } else {
                  // Fallback if loading fails or returns empty
                  setSelectedItem(filteredList[0]);
                }
              } else {
                // Wrap to first item
                setSelectedItem(filteredList[0]);
              }
            }}
          />
        );
      })()}

      {/* Locked State Overlay Button */}
      {!isUnlocked && list.length > 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-[14px] rounded-3xl pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5 pointer-events-auto"
          >
            {/* Glowing lock icon */}
            <div className="relative">
              {/* Ambient glow */}
              <div className="absolute inset-0 rounded-full bg-rose-400/30 dark:bg-rose-500/20 blur-2xl scale-150 animate-pulse" />
              {/* Pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border-2 border-rose-300 dark:border-rose-500"
              />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-20 h-20 rounded-full bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-800 shadow-xl flex items-center justify-center text-3xl"
              >
                🔒
              </motion.div>
            </div>

            {/* Label */}
            <div className="text-center space-y-1">
              <p className="font-nghe-thuat text-lg font-bold text-rose-700 dark:text-rose-300 tracking-wide">Góc Bí Mật</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Nhấn để mở khóa kỷ niệm</p>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 16px 40px -8px rgba(244,63,94,0.45)' }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              onClick={() => setShowPasswordModal(true)}
              className="px-7 py-3 rounded-2xl bg-rose-500 text-white text-sm font-bold tracking-widest shadow-[0_8px_24px_-6px_rgba(244,63,94,0.4)] flex items-center gap-2"
            >
              <span>✨</span>
              <span>MỞ XEM KỶ NIỆM</span>
              <span>✨</span>
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={error ? { opacity: 1, scale: 1, y: 0, x: [-15, 15, -15, 15, 0] } : { opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 dark:border-zinc-800"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl"
                >
                  🔒
                </motion.div>
                <h3 className="text-xl font-bold font-nghe-thuat text-rose-600 dark:text-rose-400">
                  Góc Bí Mật
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Những lời nhắn nhủ này chỉ dành riêng cho Mai. Hãy nhập mật khẩu để mở khóa nhé!
                </p>

                <div className="pt-2">
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.01, boxShadow: '0 0 20px rgba(244, 114, 182, 0.4)' }}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(false); }}
                      placeholder="Nhập mật khẩu..."
                      className={`w-full px-4 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-colors duration-300 text-center font-bold tracking-widest placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 ${error
                        ? 'border-red-400 dark:border-red-500/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                        : 'border-rose-100 dark:border-zinc-700 focus:border-rose-400 dark:focus:border-rose-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200'
                        }`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUnlock(e);
                        if (e.key === 'Escape') {
                          setShowPasswordModal(false);
                          setError(false);
                          setPassword('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-rose-300 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Aẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.75} />
                      ) : (
                        <Eye size={18} strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[11px] text-red-500 mt-2 font-medium overflow-hidden"
                    >
                      Mật khẩu không đúng! Gợi ý: Hãy nhớ tới ngày chúng ta chính thức quen nhau nhé 😉
                    </motion.p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => {
                      setShowPasswordModal(false);
                      setError(false);
                      setPassword('');
                    }}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 hover:brightness-95 dark:bg-zinc-800 dark:hover:brightness-110 text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    HỦY
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={handleUnlock}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-[0_8px_20px_-6px_rgba(244,63,94,0.5)] transition-all flex items-center justify-center gap-1.5"
                  >
                    MỞ KHÓA <span className="text-lg leading-none">✨</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Content */}
      <div className={`transition-all duration-700 ${!isUnlocked && list.length > 0 ? 'pointer-events-none opacity-40 select-none' : ''}`}>

        {/* Search Bar + View Mode — thanh điều khiển trên cùng */}
        {(list.length > 0 || searchInput !== '' || searchQuery !== '') && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 dark:text-rose-300/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-rose-100 dark:border-rose-900/50 focus:outline-none focus:border-rose-400 dark:focus:border-rose-500/70 bg-white/60 dark:bg-rose-950/30 focus:bg-white dark:focus:bg-rose-950/50 text-sm font-medium transition-all shadow-sm text-zinc-800 dark:text-rose-100 placeholder:text-zinc-400 dark:placeholder:text-rose-300/50"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center justify-center bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl p-1 gap-0.5 shrink-0 border border-rose-100 dark:border-rose-900/50 w-full sm:w-auto">
              {/* 3-column grid (hidden on mobile) */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('grid3')}
                title="Lưới 3 cột"
                className={`hidden sm:block p-2 rounded-xl transition-all ${viewMode === 'grid3'
                  ? 'bg-white dark:bg-rose-900/50 shadow text-rose-500'
                  : 'text-rose-300 dark:text-rose-300/50 hover:text-rose-400'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="6" height="6" rx="1.5" /><rect x="9" y="2" width="6" height="6" rx="1.5" /><rect x="16" y="2" width="6" height="6" rx="1.5" />
                  <rect x="2" y="9" width="6" height="6" rx="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" /><rect x="16" y="9" width="6" height="6" rx="1.5" />
                  <rect x="2" y="16" width="6" height="6" rx="1.5" /><rect x="9" y="16" width="6" height="6" rx="1.5" /><rect x="16" y="16" width="6" height="6" rx="1.5" />
                </svg>
              </motion.button>
              {/* 2-column grid */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('grid2')}
                title="Lưới 2 cột"
                className={`p-2 rounded-xl transition-all ${viewMode === 'grid2' || viewMode === 'grid3'
                  ? 'bg-white dark:bg-rose-900/50 shadow text-rose-500' // Active base
                  : 'text-rose-300 dark:text-rose-300/50 hover:text-rose-400' // Inactive base
                  } ${viewMode === 'grid3'
                    ? 'sm:bg-transparent sm:dark:bg-transparent sm:shadow-none sm:text-rose-300 sm:dark:text-rose-300/50 sm:hover:text-rose-400' // Inactive override for desktop
                    : ''
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="9" height="9" rx="1.5" /><rect x="13" y="2" width="9" height="9" rx="1.5" />
                  <rect x="2" y="13" width="9" height="9" rx="1.5" /><rect x="13" y="13" width="9" height="9" rx="1.5" />
                </svg>
              </motion.button>
              {/* List view */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('list')}
                title="Danh sách"
                className={`p-2 rounded-xl transition-all ${viewMode === 'list'
                  ? 'bg-white dark:bg-rose-900/50 shadow text-rose-500'
                  : 'text-rose-300 dark:text-rose-300/50 hover:text-rose-400'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="3" width="20" height="4" rx="1.5" />
                  <rect x="2" y="10" width="20" height="4" rx="1.5" />
                  <rect x="2" y="17" width="20" height="4" rx="1.5" />
                </svg>
              </motion.button>
            </div>
          </div>
        )}

        {/* Scrollable list container */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className={`overflow-y-auto rounded-2xl pr-1 pt-2 ${!isUnlocked ? 'pointer-events-auto' : ''}`}
            style={{ maxHeight: 'calc(100vh - 220px)' }}
          >
            {filteredList.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="text-5xl opacity-30 animate-gio-thoi inline-block">🌸</div>
                <p className="text-sm text-rose-300 font-medium">
                  {searchQuery ? 'Không tìm thấy kết quả nào phù hợp!' : 'Chưa có trang lưu bút nào — hãy là người đầu tiên gửi lời chúc nhé!'}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`pb-6 ${viewMode === 'grid3' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' :
                    viewMode === 'grid2' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' :
                      'flex flex-col gap-4'
                    }`}
                >
                  {renderedList}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Lớp phủ mờ (Fade Overlay) ở dưới cùng */}
          {list.length > 0 && (
            <div
              className={`pointer-events-none absolute bottom-0 left-0 right-2 h-28 rounded-b-2xl transition-opacity duration-700 ${isBottom || !isUnlocked ? 'opacity-0' : 'opacity-100'}`}
              style={{
                background: 'linear-gradient(to bottom, transparent, var(--bg-nen) 90%)'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}