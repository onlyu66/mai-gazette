'use client';

import React, { ChangeEvent, useRef, useState, useEffect, useCallback } from 'react';
import { LuuButFormData } from '../types';
import { compressImage } from '../utils/compressImage';

interface FormEditorProps {
  formData: LuuButFormData;
  updateField: (field: keyof LuuButFormData, value: LuuButFormData[keyof LuuButFormData]) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
}



export default function FormEditor({ formData, updateField, onSubmit, loading }: FormEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // ── Local state for text inputs: decouples typing from the heavy preview re-render ──
  const [localNoiDung, setLocalNoiDung] = useState(formData.noiDung);
  const [localTacGia, setLocalTacGia] = useState(formData.tacGia);
  const noiDungTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tacGiaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Push to parent only 300ms after user stops typing → preview updates without blocking keystrokes
  const handleNoiDungChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalNoiDung(val);
    if (noiDungTimer.current) clearTimeout(noiDungTimer.current);
    noiDungTimer.current = setTimeout(() => updateField('noiDung', val), 300);
  }, [updateField]);

  const handleTacGiaChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalTacGia(val);
    if (tacGiaTimer.current) clearTimeout(tacGiaTimer.current);
    tacGiaTimer.current = setTimeout(() => updateField('tacGia', val), 300);
  }, [updateField]);

  // Sync local when parent resets form (e.g. after successful submit)
  useEffect(() => { setLocalNoiDung(formData.noiDung); }, [formData.noiDung]);
  useEffect(() => { setLocalTacGia(formData.tacGia); }, [formData.tacGia]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!formData.anhFile) {
      if (preview) URL.revokeObjectURL(preview);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [formData.anhFile]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      return;
    }
    setFileName(file.name);
    try {
      const compressedBlob = await compressImage(file);
      const objectUrl = URL.createObjectURL(compressedBlob);
      setPreview(objectUrl);
      updateField('anhFile', compressedBlob);
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      updateField('anhFile', file);
    }
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
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    updateField('anhFile', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'var(--bg-card-gradient)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px var(--border-card)',
      }}
    >
      {/* Decorative corner flowers */}
      <div className="pointer-events-none absolute top-0 right-0 opacity-10 -translate-y-2 translate-x-2 rotate-12 select-none">
        <div className="text-5xl animate-gio-thoi" style={{ animationDelay: '0s' }}>🌸</div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 opacity-10 translate-y-2 -translate-x-1 -rotate-12 select-none">
        <div className="text-4xl animate-gio-thoi" style={{ animationDelay: '1s' }}>🌷</div>
      </div>

      <div className="relative p-8 space-y-8">

        {/* ── Header ── */}
        <div className="text-center space-y-1.5 pb-6 border-b border-rose-100">
          <div className="text-2xl mb-1">🎓</div>
          <h2
            className="font-nghe-thuat italic text-2xl font-bold leading-snug"
            style={{ color: 'var(--text-heading)' }}
          >
            Trang Lưu Bút Tốt Nghiệp
          </h2>
          <p className="text-[11px] tracking-[0.15em] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
            Phan Ngọc Mai · Cử Nhân Báo Chí 2026
          </p>
        </div>


        {/* ── 2. Ảnh kỷ niệm ── */}
        <div className="space-y-2.5">
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: 'var(--text-heading)', opacity: 0.8 }}>
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
                  : 'border-rose-200/70 hover:border-rose-300'
              }`}
              style={!isDragging ? { background: 'var(--khung-kinh)' } : {}}
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
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: 'var(--text-heading)', opacity: 0.8 }}>
            ✦ Lời nhắn của bạn
          </label>
          <div className="relative">
            <textarea
              rows={6}
              value={localNoiDung}
              onChange={handleNoiDungChange}
              placeholder="Hãy để lại những lời chúc ấm áp, kỷ niệm đáng nhớ hoặc những điều bạn muốn nói với Mai nhé... 🌸"
              className="w-full px-4 py-3.5 rounded-2xl text-sm leading-relaxed resize-none border border-transparent focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 placeholder:text-rose-200 transition-all duration-200"
              style={{ fontFamily: 'var(--font-playfair), serif', background: 'var(--khung-kinh)', color: 'var(--mau-chu)' }}
            />
            <span className="absolute bottom-3 right-3.5 text-[9px] text-rose-200 font-mono">
              {localNoiDung.length} ký tự
            </span>
          </div>
        </div>


        {/* ── 5. Tên bạn ── */}
        <div className="space-y-2.5">
          <label className="block text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: 'var(--text-heading)', opacity: 0.8 }}>
            ✦ Tên của bạn
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 text-sm">✍️</span>
            <input
              type="text"
              value={localTacGia}
              onChange={handleTacGiaChange}
              placeholder="Bạn là ai? Để lại dấu ấn nhé..."
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 placeholder:text-rose-200 transition-all duration-200"
              style={{ background: 'var(--khung-kinh)', color: 'var(--mau-chu)' }}
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
              ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)'
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