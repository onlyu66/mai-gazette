'use client';

import { Camera, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { MEMORIES } from '../constants';
import { fetchGalleryImages } from '../services/api';
import { MemoryIcon } from './MemoryIcon';

export default function GallerySlider() {
  const router = useRouter();
  const [categoryImages, setCategoryImages] = useState<Record<string, string[]>>({});
  const hasDraggedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const activeItemIdRef = useRef<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const lastPointerXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPausedRef = useRef(false);
  const lastAutoTimeRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragDistanceRef = useRef(0);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const { images: fetchedImages } = await fetchGalleryImages();
        const grouped: Record<string, string[]> = {};

        // Nhóm tất cả ảnh theo danh mục
        fetchedImages.forEach(img => {
          if (!grouped[img.category]) {
            grouped[img.category] = [];
          }
          grouped[img.category].push(img.image_url);
        });

        setCategoryImages(grouped);
      } catch (error) {
        console.error("Lỗi khi tải ảnh gallery:", error);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const startAutoScroll = (timestamp: number) => {
      const halfScrollLeft = track.scrollWidth / 2;
      if (halfScrollLeft <= 0) return;
      if (viewport.scrollLeft === 0) {
        viewport.scrollLeft = halfScrollLeft;
      }

      const step = (now: number) => {
        if (isDraggingRef.current || isPausedRef.current) {
          lastAutoTimeRef.current = now;
          autoScrollRef.current = window.requestAnimationFrame(step);
          return;
        }

        const previousTime = lastAutoTimeRef.current ?? now;
        const elapsed = Math.min(now - previousTime, 15); // Giới hạn tốc độ cuộn để tránh nhảy hình khi tab bị ẩn
        lastAutoTimeRef.current = now;
        const distance = (elapsed / 1000) * 95;
        const current = viewport.scrollLeft;
        const next = current + distance;

        if (next >= halfScrollLeft) {
          viewport.scrollLeft = next - halfScrollLeft;
        } else {
          viewport.scrollLeft = next;
        }

        autoScrollRef.current = window.requestAnimationFrame(step);
      };

      if (autoScrollRef.current) window.cancelAnimationFrame(autoScrollRef.current);
      lastAutoTimeRef.current = timestamp;
      autoScrollRef.current = window.requestAnimationFrame(step);
    };

    const handleResize = () => {
      if (autoScrollRef.current) window.cancelAnimationFrame(autoScrollRef.current);
      lastAutoTimeRef.current = null;
      startAutoScroll(performance.now());
    };

    startAutoScroll(performance.now());
    window.addEventListener('resize', handleResize);

    return () => {
      if (autoScrollRef.current) window.cancelAnimationFrame(autoScrollRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [categoryImages]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    suppressClickRef.current = false;
    dragStartXRef.current = event.clientX;
    dragDistanceRef.current = 0;
    lastPointerXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || dragStartXRef.current === null || !viewportRef.current) return;

    const deltaX = event.clientX - lastPointerXRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!track) return;

    if (Math.abs(deltaX) > 2) {
      event.preventDefault();
      suppressClickRef.current = true;
    }

    const halfScrollLeft = track.scrollWidth / 2;
    let nextScrollLeft = viewport.scrollLeft - deltaX;
    if (nextScrollLeft < 0) {
      nextScrollLeft += halfScrollLeft;
    } else if (nextScrollLeft >= halfScrollLeft) {
      nextScrollLeft -= halfScrollLeft;
    }

    viewport.scrollLeft = nextScrollLeft;
    dragDistanceRef.current += Math.abs(deltaX);
    lastPointerXRef.current = event.clientX;

    if (dragDistanceRef.current > 12) {
      hasDraggedRef.current = true;
    }
  };

  const handlePointerUp = (event?: ReactPointerEvent<HTMLDivElement>) => {
    if (event?.currentTarget?.releasePointerCapture) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!suppressClickRef.current && !hasDraggedRef.current && activeItemIdRef.current) {
      router.push(`/gallery/${activeItemIdRef.current}`);
    }

    isDraggingRef.current = false;
    dragStartXRef.current = null;
    dragDistanceRef.current = 0;
    activeItemIdRef.current = null;

    window.setTimeout(() => {
      suppressClickRef.current = false;
      hasDraggedRef.current = false;
    }, 0);
  };

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push(`/gallery/${itemId}`);
    }
  };

  // Tạo uniqueStrip với số lần lặp tương ứng
  const uniqueStrip = Array.from({ length: 3 }).flatMap(() => MEMORIES);

  // Ánh xạ ảnh cụ thể cho từng vị trí của uniqueStrip
  const uniqueStripWithCovers = [];
  const occurrences: Record<string, number> = {};

  for (const item of uniqueStrip) {
    const count = occurrences[item.id] || 0;
    occurrences[item.id] = count + 1;

    const imgs = categoryImages[item.id] || [];
    const coverUrl = imgs[count] || null;

    uniqueStripWithCovers.push({
      ...item,
      coverUrl,
    });
  }

  // Nhân đôi để tạo hiệu ứng cuộn vô tận (infinite scroll marquee) không bị giật/nhảy hình
  const finalStrip = [...uniqueStripWithCovers, ...uniqueStripWithCovers];


  return (
    <section id="goc-trien-lam" className="py-12 overflow-hidden border-t select-none"
      style={{ background: 'var(--bg-section-2)', borderColor: 'var(--border-section)' }}
    >
      {/* Header */}
      <div className="mb-8 px-6 max-w-7xl mx-auto text-center space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400">
          ✦ Góc triển lãm ký ức
        </p>
        <h3 className="font-nghe-thuat italic text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
          Những khoảnh khắc thanh xuân không thể quên
        </h3>
      </div>

      {/* Scrolling strip */}
      <div className="group">
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="overflow-hidden cursor-grab select-none active:cursor-grabbing"
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
          }}
          onTouchStart={() => {
            isPausedRef.current = true;
          }}
          onTouchEnd={() => {
            isPausedRef.current = false;
          }}
          style={{ touchAction: 'none' }}
        >
          <div ref={trackRef} className="flex w-max flex-nowrap pr-6 space-x-5" >
            {finalStrip.map((item, idx) => (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onPointerDown={() => { activeItemIdRef.current = item.id; }}
                onKeyDown={(event) => handleItemKeyDown(event, item.id)}
                className={`
                  relative w-52 h-44 rounded-3xl shrink-0 flex flex-col items-center justify-center gap-3
                  bg-linear-to-br ${item.color} overflow-hidden
                  border shadow-sm group/card cursor-pointer
                  hover:shadow-rose-400/40 hover:-translate-y-2 hover:border-rose-300/50
                  transition-all duration-500 ease-out touch-none
                `}
                style={{ borderColor: 'var(--border-card)' }}
              >
                {item.coverUrl ? (
                  <>
                    <Image
                      src={item.coverUrl}
                      alt={item.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 208px"
                      className="object-cover opacity-90 transition-all duration-700 ease-out group-hover/card:scale-115 group-hover/card:brightness-105"
                      priority={idx < 2}
                    />
                    {/* Premium Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/10 z-10 transition-all duration-500 group-hover/card:from-black/85 group-hover/card:via-black/45 group-hover/card:to-black/20" />

                    {/* Animated camera icon on the top-left */}
                    <div className="absolute top-3 left-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-95 group-hover/card:opacity-100 group-hover/card:scale-110 group-hover/card:bg-rose-500/80 group-hover/card:border-rose-400/30 transition-all duration-300">
                      <Camera className="w-4 h-4 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-12" />
                    </div>

                    {/* Animated spinning sparkle icon on the top-right */}
                    <div className="absolute top-3 right-3 z-20 text-rose-200 opacity-90 group-hover/card:opacity-100 transition-all duration-300">
                      <Sparkles className="w-4 h-4 animate-spin [animation-duration:8s]" />
                    </div>

                    {/* Text details */}
                    <div className="z-20 drop-shadow-md transition-all duration-300 group-hover/card:scale-110">
                      <MemoryIcon itemId={item.id} className="w-6 h-6 text-rose-50" />
                    </div>
                    <span className="text-[12px] font-bold text-rose-50 tracking-wider uppercase text-center px-4 z-20 drop-shadow-md transition-all duration-300 group-hover/card:tracking-widest">
                      {item.label}
                    </span>
                  </>
                ) : (
                  <>
                    {/* Default decorative elements */}
                    <div className="absolute top-3 right-3 z-10 text-rose-300/60 group-hover/card:text-rose-400 transition-colors duration-300">
                      <Sparkles className="w-4 h-4 transition-transform duration-500 group-hover/card:rotate-45" />
                    </div>
                    <div className="absolute top-3 left-3 z-10 text-rose-300/40 group-hover/card:text-rose-400 transition-colors duration-300">
                      <Camera className="w-4 h-4 transition-transform duration-500 group-hover/card:scale-110" />
                    </div>

                    <div className="transition-transform duration-500 group-hover/card:scale-120 group-hover/card:rotate-6">
                      <MemoryIcon itemId={item.id} className="w-7 h-7 text-rose-500/80" />
                    </div>
                    <span className="text-[11px] font-bold text-rose-500/80 tracking-wider uppercase text-center px-4 transition-all duration-300 group-hover/card:text-rose-600 group-hover/card:tracking-widest">
                      {item.label}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[9px] tracking-widest uppercase mt-6 font-mono transition-all duration-300 group-hover:-translate-y-1 group-hover:text-rose-500" style={{ color: 'var(--text-muted)' }}>
          Nhấn vào thẻ để xem và thêm ảnh 🌷
        </p>
      </div>
    </section>
  );
}