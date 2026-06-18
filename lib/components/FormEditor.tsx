'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { LuuButFormData } from '../types';

interface FormEditorProps {
  formData: LuuButFormData;
  updateField: (field: keyof LuuButFormData, value: string) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
}

const LOAI_LUU_BUT = [
  { value: 'loi-chuc', label: '🌸 Lời chúc tốt nghiệp', desc: 'Gửi những điều tốt đẹp nhất' },
  { value: 'ky-niem', label: '📸 Kỷ niệm đáng nhớ', desc: 'Kể về một khoảnh khắc chúng ta' },
  { value: 'nhan-nhu', label: '💌 Nhắn nhủ từ trái tim', desc: 'Những lời muốn nói mà chưa nói' },
  { value: 'hai-huoc', label: '🎭 Hài hước & vui vẻ', desc: 'Mang lại nụ cười cho ngày tốt nghiệp' },
];

const CAM_XUC = [
  { value: '🥹 Xúc động', emoji: '🥹', label: 'Xúc động' },
  { value: '🌸 Tự hào', emoji: '🌸', label: 'Tự hào' },
  { value: '🥂 Hào hứng', emoji: '🥂', label: 'Hào hứng' },
  { value: '😭 Nhớ nhau', emoji: '😭', label: 'Nhớ nhau' },
  { value: '✨ Biết ơn', emoji: '✨', label: 'Biết ơn' },
  { value: '💕 Yêu quý', emoji: '💕', label: 'Yêu quý' },
];

export default function FormEditor({ formData, updateField, onSubmit, loading }: FormEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      updateField('anhBase64', result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setFileName(null);
    updateField('anhBase64', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #fff9fb 0%, #fef2f6 50%, #fff5f8 100%)',
        boxShadow: '0 8px 40px rgba(244,114,182,0.12), 0 0 0 1px rgba(244,114,182,0.08)',
      }}
    >
      {/* Decorative corner flowers */}
      <div className="pointer-events-none absolute top-0 right-0 text-5xl opacity-10 -translate-y-2 translate-x-2 rotate-12 select-none">🌸</div>
      <div className="pointer-events-none absolute bottom-0 left-0 text-4xl opacity-10 translate-y-2 -translate-x-1 -rotate-12 select-none">🌷</div>

      <div className="relative p-8 space-y-8">

        {/* ── Header ── */}
        <div className="text-center space-y-1.5 pb-6 border-b border-rose-100">
          <div className="text-2xl mb-1">🎓</div>
          <h2
            className="font-nghe-thuat italic text-2xl font-bold leading-snug"
            style={{ color: '#be123c' }}
          >
            Trang Lưu Bút Tốt Nghiệp
          </h2>
          <p className="text-[11px] tracking-[0.15em] uppercase font-semibold" style={{ color: '#fb7185' }}>
            Phan Ngọc Mai · Cử Nhân Báo Chí 2026
          </p>
        </div>

        {/* ── 1. Loại lưu bút ── */}
        <div className="space-y-3">
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: '#fb7185' }}>
            ✦ Bạn muốn viết gì?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {LOAI_LUU_BUT.map((opt) => {
              const isSelected = formData.tieuDe === opt.value;
              return (
                <label key={opt.value} className="relative cursor-pointer select-none">
                  <input
                    type="radio"
                    name="loai"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => updateField('tieuDe', opt.value)}
                    className="sr-only"
                  />
                  <div
                    className={`px-3.5 py-3 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-rose-400 shadow-md'
                        : 'border-rose-100 bg-white/70 hover:border-rose-200 hover:bg-rose-50/60'
                    }`}
                    style={isSelected ? {
                      background: 'linear-gradient(135deg, #fff0f5, #fce7f3)',
                      boxShadow: '0 4px 16px rgba(244,114,182,0.2)',
                    } : {}}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-400 flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1.5 5 4 7.5 8.5 2.5" />
                        </svg>
                      </span>
                    )}
                    <p className={`text-xs font-bold mb-0.5 ${isSelected ? 'text-rose-600' : 'text-gray-700'}`}>
                      {opt.label}
                    </p>
                    <p className={`text-[10px] leading-tight ${isSelected ? 'text-rose-400' : 'text-gray-400'}`}>
                      {opt.desc}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── 2. Ảnh kỷ niệm ── */}
        <div className="space-y-2.5">
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: '#fb7185' }}>
            ✦ Ảnh kỷ niệm (tuỳ chọn)
          </label>
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-rose-400 bg-rose-50 scale-[1.01]'
                  : 'border-rose-200/70 bg-white/50 hover:border-rose-300 hover:bg-rose-50/60'
              }`}
            >
              <span className={`text-2xl transition-transform duration-300 ${isDragging ? 'scale-125' : ''}`}>
                {isDragging ? '💝' : '🖼️'}
              </span>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-rose-400">
                  {isDragging ? 'Thả ảnh vào đây!' : 'Kéo thả hoặc click để chọn ảnh'}
                </p>
                <p className="text-[9px] text-gray-300 mt-0.5">JPG · PNG · WEBP</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-rose-200/50 shadow-sm group">
              <img src={preview} alt="Ảnh kỷ niệm" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="bg-white/90 text-gray-800 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-white transition">
                  Đổi ảnh
                </button>
                <button type="button" onClick={clearImage}
                  className="bg-rose-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-rose-600 transition">
                  Xóa
                </button>
              </div>
              <p className="absolute bottom-2 left-3 text-white text-[9px] font-mono truncate max-w-[80%]">
                📎 {fileName}
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          )}
        </div>

        {/* ── 3. Nội dung lưu bút ── */}
        <div className="space-y-2.5">
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: '#fb7185' }}>
            ✦ Lời nhắn của bạn
          </label>
          <div className="relative">
            <textarea
              rows={6}
              value={formData.noiDung}
              onChange={(e) => updateField('noiDung', e.target.value)}
              placeholder="Hãy để lại những lời chúc ấm áp, kỷ niệm đáng nhớ hoặc những điều bạn muốn nói với Mai nhé... 🌸"
              className="w-full px-4 py-3.5 rounded-2xl text-sm leading-relaxed resize-none border bg-white/80 border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 placeholder:text-rose-200 text-gray-700 transition-all duration-200"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            />
            <span className="absolute bottom-3 right-3.5 text-[9px] text-rose-200 font-mono">
              {formData.noiDung.length} ký tự
            </span>
          </div>
        </div>

        {/* ── 4. Cảm xúc ── */}
        <div className="space-y-2.5">
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: '#fb7185' }}>
            ✦ Cảm xúc hôm nay của bạn
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {CAM_XUC.map((cx) => {
              const isSelected = formData.quaTang === cx.value;
              return (
                <label key={cx.value} className="cursor-pointer select-none">
                  <input
                    type="radio"
                    name="camXuc"
                    value={cx.value}
                    checked={isSelected}
                    onChange={() => updateField('quaTang', cx.value)}
                    className="sr-only"
                  />
                  <div
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-rose-400 scale-105'
                        : 'border-transparent bg-white/60 hover:bg-rose-50 hover:border-rose-100'
                    }`}
                    style={isSelected ? { background: 'linear-gradient(135deg, #fff0f5, #fce7f3)' } : {}}
                  >
                    <span className={`text-xl transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
                      {cx.emoji}
                    </span>
                    <span className={`text-[8px] font-bold text-center leading-tight ${isSelected ? 'text-rose-500' : 'text-gray-400'}`}>
                      {cx.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── 5. Tên bạn ── */}
        <div className="space-y-2.5">
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: '#fb7185' }}>
            ✦ Tên của bạn
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 text-sm">✍️</span>
            <input
              type="text"
              value={formData.tacGia}
              onChange={(e) => updateField('tacGia', e.target.value)}
              placeholder="Bạn là ai? Để lại dấu ấn nhé..."
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm border bg-white/80 border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 placeholder:text-rose-200 text-gray-700 transition-all duration-200"
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-sm font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          style={{
            background: loading
              ? 'linear-gradient(135deg, #f9a8d4, #fda4af)'
              : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)',
            color: 'white',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(244,63,94,0.35)',
          }}
          onMouseEnter={(e) => {
            if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          {loading ? '🌸 Đang lưu lại kỷ niệm...' : '💌 Gửi Lưu Bút Cho Mai'}
        </button>

        {/* Footer note */}
        <p className="text-center text-[9px] text-rose-300 tracking-widest uppercase pt-2">
          Mỗi trang lưu bút là một bông hoa trong vườn kỷ niệm 🌷
        </p>

      </div>
    </div>
  );
}