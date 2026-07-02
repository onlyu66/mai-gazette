'use client';

import { useState } from 'react';
import NextImage from 'next/image';

/**
 * A wrapper around Next.js <Image fill> that shows a shimmer skeleton
 * while the image is loading and fades it in when ready.
 *
 * The parent container MUST have a defined height (via aspectClass, h-*, etc.)
 * because Next.js fill mode relies on the parent to determine dimensions.
 *
 * Props:
 *   - `src`            — Image URL (required).
 *   - `alt`            — Alt text (required).
 *   - `aspectClass`    — Tailwind aspect-ratio class applied to the wrapper,
 *                        e.g. "aspect-square" | "aspect-[16/10]" | "aspect-video".
 *                        Leave empty when the parent already sets a height.
 *   - `objectFit`      — "cover" | "contain". Defaults to "cover".
 *   - `sizes`          — Next.js <Image> sizes hint. Defaults to "100vw".
 *   - `priority`       — Pass true for above-the-fold images.
 *   - `className`      — Extra Tailwind classes on the <Image> element itself.
 *   - `shimmerClassName` — Extra classes on the skeleton overlay.
 */

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  aspectClass?: string;
  objectFit?: 'cover' | 'contain';
  sizes?: string;
  priority?: boolean;
  className?: string;
  shimmerClassName?: string;
  onLoad?: () => void;
}

function ImageWithSkeletonContent({
  src,
  alt,
  aspectClass = '',
  objectFit = 'cover',
  sizes = '100vw',
  priority = false,
  className = '',
  shimmerClassName = '',
  onLoad,
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const objectFitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div className={`relative w-full h-full overflow-hidden ${aspectClass}`}>
      {/* Shimmer skeleton — hidden once image loads or fails */}
      {!loaded && !hasError && (
        <div
          className={`absolute inset-0 z-10 overflow-hidden bg-rose-100/60 dark:bg-zinc-800/60 ${shimmerClassName}`}
          aria-hidden="true"
        >
          {/* Sweeping highlight */}
          <div className="absolute inset-0 -translate-x-full animate-skeleton-shimmer bg-linear-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />
          {/* Centered image icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-rose-400"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-rose-50/90 text-rose-500 dark:bg-zinc-900/90 dark:text-rose-300">
          <div className="text-center px-4">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em]">Không thể tải ảnh</p>
          </div>
        </div>
      )}

      {/* Next.js Image — uses fill to adapt to parent dimensions */}
      <NextImage
        key={src}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        onLoad={() => {
          setLoaded(true);
          setHasError(false);
          onLoad?.();
        }}
        onError={() => {
          setLoaded(true);
          setHasError(true);
        }}
        className={`${objectFitClass} transition-opacity duration-500 ${loaded && !hasError ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
}

export default function ImageWithSkeleton(props: ImageWithSkeletonProps) {
  return <ImageWithSkeletonContent key={props.src} {...props} />;
}
