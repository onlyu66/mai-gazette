import React from 'react';
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
  if (list.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="text-5xl opacity-30">🌸</div>
        <p className="text-sm text-rose-300 font-medium">
          Chưa có trang lưu bút nào — hãy là người đầu tiên gửi lời chúc nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((item) => {
        const loai = getLoai(item.tieu_de);
        return (
          <div
            key={item.id}
            className="relative rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/60"
            style={{
              background: 'linear-gradient(145deg, #fff9fb, #fef2f6)',
              boxShadow: '0 4px 20px rgba(244,114,182,0.08), 0 0 0 1px rgba(244,114,182,0.1)',
            }}
          >
            {/* Top stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 opacity-60" />

            {/* Corner petal */}
            <div className="pointer-events-none absolute top-3 right-3 text-2xl opacity-10 rotate-12 select-none">🌸</div>

            <div className="p-5 flex flex-col gap-4 flex-1">
              {/* Meta row */}
              <div className="flex justify-between items-center">
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
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden border border-rose-100">
                  <img
                    src={item.anh_url}
                    alt="Ảnh kỷ niệm"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
              )}

              {/* Nội dung */}
              <div className="relative pl-3 border-l-2 border-rose-200 group-hover:border-rose-400 transition-colors flex-1">
                {/* Quote mark */}
                <span className="absolute -top-1 -left-2 text-rose-200 text-2xl font-serif leading-none select-none">"</span>
                <p
                  className="text-sm leading-relaxed text-gray-600 line-clamp-4"
                  style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}
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

            {/* Bottom accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-rose-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      })}
    </div>
  );
}