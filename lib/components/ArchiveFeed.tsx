import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { LuuButRecord } from '../types';

interface ArchiveFeedProps {
  list: LuuButRecord[];
}

const LOAI_MAP: Record<string, { label: string; emoji: string; color: string }> = {
  'loi-chuc': { label: 'Lời chúc', emoji: '🌸', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  'ky-niem':  { label: 'Kỷ niệm', emoji: '📸', color: 'text-pink-600 bg-pink-50 border-pink-200' },
  'nhan-nhu': { label: 'Nhắn nhủ', emoji: '💌', color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200' },
  'hai-huoc': { label: 'Hài hước', emoji: '🎭', color: 'text-orange-500 bg-orange-50 border-orange-200' },
};

function getLoai(tieu_de: string) {
  return LOAI_MAP[tieu_de] ?? { label: 'Lưu bút', emoji: '💕', color: 'text-rose-500 bg-rose-50 border-rose-200' };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export default function ArchiveFeed({ list }: ArchiveFeedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const itemsPerPage = 6;
  const currentItems = list.slice(0, currentPage * itemsPerPage);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'mai') {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (currentPage * itemsPerPage < list.length) {
            setCurrentPage((p) => p + 1);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [currentPage, list.length]);

  return (
    <div className="relative">
      {/* Password Overlay */}
      {!isUnlocked && list.length > 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center pt-20 bg-white/40 backdrop-blur-[12px] rounded-3xl">
          <form onSubmit={handleUnlock} className="bg-white/95 p-8 rounded-3xl shadow-2xl border-2 border-rose-100 flex flex-col items-center max-w-sm w-full mx-4 space-y-5 animate-in fade-in zoom-in duration-500">
            <div className="text-5xl">🔒</div>
            <h3 className="font-nghe-thuat text-2xl text-rose-600 font-bold">Góc Bí Mật</h3>
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              Những lời nhắn nhủ này chỉ dành riêng cho Mai. Hãy nhập mật khẩu để mở khóa nhé!
            </p>
            <div className="w-full space-y-2">
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Nhập mật khẩu..." 
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all ${error ? 'border-red-400 bg-red-50' : 'border-rose-100 focus:border-rose-400 bg-rose-50/50 text-center font-bold tracking-widest'}`}
              />
              {error && <p className="text-[11px] text-red-500 text-center font-medium">Mật khẩu không đúng! Gợi ý: Tên của bạn 😉</p>}
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white text-sm font-bold tracking-widest hover:from-rose-500 hover:to-rose-600 transition-all shadow-lg shadow-rose-200">
              MỞ KHÓA NGAY
            </button>
          </form>
        </div>
      )}

      {/* Feed Content */}
      <div className={`space-y-10 transition-all duration-700 ${!isUnlocked && list.length > 0 ? 'pointer-events-none opacity-40 select-none' : ''}`}>
        {list.length === 0 ? (
          <div className="text-center py-20 space-y-3 col-span-full">
            <div className="text-5xl opacity-30">🌸</div>
            <p className="text-sm text-rose-300 font-medium">
              Chưa có trang lưu bút nào — hãy là người đầu tiên gửi lời chúc nhé!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => {
              const loai = getLoai(item.tieu_de);
        return (
          <div
            key={item.id}
            className="relative rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/60"
            style={{
              background: 'var(--bg-card-gradient)',
              boxShadow: '0 4px 20px rgba(244,114,182,0.08), 0 0 0 1px var(--border-card)',
            }}
          >
            {/* Top stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 opacity-60" />

            {/* Corner petal */}
            <div className="pointer-events-none absolute top-3 right-3 text-2xl opacity-10 rotate-12 select-none">🌸</div>

            <div className="p-5 flex flex-col gap-4 flex-1">
              {/* Meta row */}
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${loai.color}`}>
                  {loai.emoji} {loai.label}
                </span>
                {item.created_at && (
                  <span className="text-[9px] font-mono text-rose-300">
                    {formatDate(item.created_at)}
                  </span>
                )}
              </div>

              {/* Ảnh kỷ niệm */}
              {item.anh_url && (
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-rose-100 bg-rose-50/30">
                  <Image
                    src={item.anh_url}
                    alt="Ảnh kỷ niệm"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
              )}

              {/* Nội dung */}
              <div className="relative pl-3 border-l-2 border-rose-200 group-hover:border-rose-400 transition-colors flex-1">
                {/* Quote mark */}
                <span className="absolute -top-1 -left-2 text-rose-200 text-2xl font-serif leading-none select-none">"</span>
                <p
                  className="text-sm leading-relaxed line-clamp-4"
                  style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic', color: 'var(--mau-chu)', opacity: 0.85 }}
                >
                  {item.noi_dung || <span className="text-rose-200 italic">Không có nội dung</span>}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-rose-100/60 flex justify-between items-center mt-auto">
                {/* Cảm xúc */}
                {item.qua_tang && (
                  <span className="text-xs text-rose-400 font-medium">
                    {item.qua_tang}
                  </span>
                )}
                {/* Tên */}
                <span className="font-nghe-thuat italic font-bold text-rose-600 text-sm ml-auto">
                  — {item.tac_gia || 'Ẩn danh'}
                </span>
              </div>
            </div>

            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-rose-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      })}
          </div>
        )}

      {currentPage * itemsPerPage < list.length && (
        <div ref={observerTarget} className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      )}
      </div>
    </div>
  );
}