'use client';

import React, { useState, useRef } from 'react';
import { SlotCount } from './types';
import { THEMES, GRIDS, ANIMATION_CSS } from './constants';
import { useCamera } from './useCamera';
import { useExport } from './useExport';
import PhotoBoothCard from './PhotoBoothCard';

export default function PressStudio() {
  const [selectedThemeId, setSelectedThemeId] = useState('caro-pink');
  const [selectedGrid, setSelectedGrid] = useState<SlotCount>(4);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [name, setName] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);

  const theme = THEMES.find(t => t.id === selectedThemeId) ?? THEMES[0];

  const {
    images,
    stream,
    videoRef,
    canvasRef,
    fileInputRef,
    openCamera,
    capturePhoto,
    handleUpload,
    clearSlot,
  } = useCamera(selectedGrid, selectedSlot, setSelectedSlot);

  const isGridFull = !images.slice(0, selectedGrid).some(img => !img);

  const {
    isExporting,
    exportProgress,
    downloadStatic,
    downloadAnimated
  } = useExport(cardRef, isGridFull, selectedSlot, setSelectedSlot, theme);

  const changeGrid = (slots: SlotCount) => {
    setSelectedGrid(slots);
    setSelectedSlot(0);
  };

  return (
    <section id="studio-anh" className="py-20 border-t" style={{ background: 'var(--bg-section-2)', borderColor: 'var(--border-section)' }}>
      <style dangerouslySetInnerHTML={{ __html: ANIMATION_CSS }} />
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12 space-y-2">
          <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400">✦ Studio Chụp Ảnh Kỷ Niệm ✦</span>
          <h2 className="font-nghe-thuat italic text-4xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Photobooth Thanh Xuân
          </h2>
          <p className="text-sm text-rose-400/80 max-w-md mx-auto">
            Tự tay thiết kế và lưu giữ những tấm ảnh photobooth siêu xinh xắn

          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* LEFT: Controls */}
          <div className="lg:col-span-5 space-y-6">

            <div className="w-full aspect-square rounded-[32px] overflow-hidden relative shadow-inner" style={{ background: '#000', border: '8px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
              <canvas ref={canvasRef} className="hidden" />
              {stream ? (
                <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg" style={{ animation: 'pb-rec-pulse 1.4s ease-in-out infinite' }}>
                  <div className="w-2 h-2 rounded-full bg-white" /> REC
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                  <span className="text-4xl mb-2">📸</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Camera Offline</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={openCamera} className="flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 transition shadow-lg">
                  1. Bật Camera
                </button>
                <button onClick={capturePhoto} className="flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition shadow-lg flex items-center justify-center gap-2">
                  <span>📸</span> Chụp (Slot {selectedSlot + 1})
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border-2 border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition">
                  Tải Ảnh Lên
                </button>
                <button onClick={clearSlot} disabled={!images[selectedSlot]}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border-2 border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition disabled:opacity-40">
                  Xóa Slot {selectedSlot + 1}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>

            <div className="backdrop-blur-sm p-6 rounded-[24px] border shadow-sm space-y-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>

              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">1. Số Lượng Ảnh (Grid)</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRIDS.map(g => (
                    <button key={g.value} onClick={() => changeGrid(g.value)}
                      className={`px-2 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all border-2 text-center ${selectedGrid === g.value ? 'border-rose-500 bg-rose-50 text-rose-600' : 'text-gray-500 hover:border-rose-300'
                        }`}
                      style={{ background: selectedGrid === g.value ? '' : 'var(--bg-card)', borderColor: selectedGrid === g.value ? '' : 'var(--border-card)' }}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">2. Chủ Đề Khung (Theme)</label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map(t => (
                    <button key={t.id} onClick={() => setSelectedThemeId(t.id)}
                      className={`relative flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border-2 transition-all ${selectedThemeId === t.id ? 'border-rose-500 shadow-md scale-105' : 'hover:border-rose-300'
                        }`}
                      style={selectedThemeId === t.id ? { background: t.selectorBg } : { background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <span className="text-lg">{t.emoji}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${selectedThemeId === t.id ? 'text-white' : 'text-gray-600'}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">3. Khách mời</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="w-full px-4 py-3 rounded-xl text-sm border-2 border-rose-100 focus:outline-none focus:border-rose-400 bg-white text-gray-800 font-medium" />
              </div>

            </div>

            <div className="space-y-3">
              <button
                onClick={downloadStatic}
                disabled={!isGridFull || isExporting}
                className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-white transition-all shadow-xl hover:shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: isGridFull ? 'linear-gradient(135deg, #be123c, #9f1239)' : 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }}
              >
                {isGridFull ? '📥 Tải Ảnh Tĩnh (PNG)' : `⚠️ Vui lòng chụp/tải đủ ${selectedGrid} ảnh`}
              </button>

              <button
                onClick={downloadAnimated}
                disabled={!isGridFull || isExporting}
                className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: isGridFull ? 'linear-gradient(135deg, #7c3aed, #4c1d95)' : 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }}
              >
                {isExporting ? `✨ Đang tạo ảnh động… ${exportProgress}%` : '🎬 Tải Ảnh Động (GIF)'}
              </button>
              {isExporting && (
                <div className="w-full h-1.5 rounded-full bg-violet-100 overflow-hidden">
                  <div className="h-full bg-violet-500 transition-all" style={{ width: `${exportProgress}%` }} />
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-7 flex justify-center items-start lg:sticky lg:top-24 w-full">
            <div className="w-full flex flex-col items-center pb-8 pt-2">
              <div className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse text-center">
                Click vào slot bên dưới để chọn vị trí ảnh
              </div>

              <PhotoBoothCard
                theme={theme}
                slots={selectedGrid}
                images={images}
                selectedSlot={selectedSlot}
                onSlotClick={setSelectedSlot}
                name={name}
                cardRef={cardRef}
                animate={isExporting || selectedSlot !== -1}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
