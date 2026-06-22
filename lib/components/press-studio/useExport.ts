import { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { Theme } from './types';

export function useExport(
  cardRef: React.RefObject<HTMLDivElement | null>,
  isGridFull: boolean,
  selectedSlot: number,
  setSelectedSlot: (slot: number) => void,
  theme: Theme
) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const downloadStatic = async () => {
    if (!cardRef.current || !isGridFull) return;

    const currentSlot = selectedSlot;
    setSelectedSlot(-1);
    await new Promise(r => setTimeout(r, 100));

    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `Photobooth_Mai_${theme.id}.png`;
      a.href = url; a.click();

      toast.success('🎉 Đã tải ảnh siêu nét thành công!');
      setSelectedSlot(currentSlot);
    } catch {
      toast.error('Lỗi tải ảnh, hãy thử lại!');
      setSelectedSlot(currentSlot);
    }
  };

  const downloadAnimated = async () => {
    if (!cardRef.current || !isGridFull) return;

    const currentSlot = selectedSlot;
    setSelectedSlot(-1);
    setIsExporting(true);
    setExportProgress(0);
    await new Promise(r => setTimeout(r, 120));

    const FRAME_COUNT = 45;
    const FRAME_DELAY_MS = 40;

    try {
      const gif = GIFEncoder();
      let dims: { width: number; height: number } | null = null;

      const allAnimElements = cardRef.current.querySelectorAll('.pb-card-anim, .pb-sweep, .pb-mote, .pb-tape, .pb-slot-img, .pb-shimmer-text');
      const targets = [cardRef.current, ...Array.from(allAnimElements)].filter(el => 
        el.classList && (
          el.classList.contains('pb-card-anim') ||
          el.classList.contains('pb-sweep') ||
          el.classList.contains('pb-mote') ||
          el.classList.contains('pb-tape') ||
          el.classList.contains('pb-slot-img') ||
          el.classList.contains('pb-shimmer-text')
        )
      ) as HTMLElement[];

      targets.forEach(el => {
        if (!el.hasAttribute('data-orig-delay')) {
          el.setAttribute('data-orig-delay', el.style.animationDelay || '0s');
        }
      });

      for (let i = 0; i < FRAME_COUNT; i++) {
        const currentTime = i * FRAME_DELAY_MS;
        
        targets.forEach(el => {
          const base = el.getAttribute('data-orig-delay') || '0s';
          el.style.animationDelay = `calc(${base} - ${currentTime}ms)`;
          el.style.animationPlayState = 'paused';
        });

        await new Promise(r => setTimeout(r, 15));

        const canvas = await htmlToImage.toCanvas(cardRef.current, { pixelRatio: 1 });
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        const { width, height } = canvas;
        dims = { width, height };
        const { data } = ctx.getImageData(0, 0, width, height);

        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        
        gif.writeFrame(index, width, height, { palette, delay: FRAME_DELAY_MS });

        setExportProgress(Math.round(((i + 1) / FRAME_COUNT) * 100));
      }

      targets.forEach(el => {
        const orig = el.getAttribute('data-orig-delay');
        el.style.animationDelay = orig === '0s' ? '' : (orig || '');
        el.style.animationPlayState = '';
      });

      if (!dims) throw new Error('No frames captured');
      gif.finish();

      const blob = new Blob([gif.bytes() as unknown as BlobPart], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = `Photobooth_Mai_${theme.id}_animated.gif`;
      a.href = url; a.click();
      URL.revokeObjectURL(url);

      toast.success('🎉 Đã tải ảnh động GIF thành công!');
      setSelectedSlot(currentSlot);
    } catch {
      toast.error('Lỗi tạo ảnh động, hãy thử lại!');
      setSelectedSlot(currentSlot);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return {
    isExporting,
    exportProgress,
    downloadStatic,
    downloadAnimated
  };
}
