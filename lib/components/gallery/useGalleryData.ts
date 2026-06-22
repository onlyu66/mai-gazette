import { useState, useEffect, useRef } from 'react';
import { fetchGalleryImages } from '@/lib/services/api';
import { GalleryImageRecord } from '@/lib/types';
import toast from 'react-hot-toast';

export function useGalleryData(categoryId: string | undefined) {
  const [images, setImages] = useState<GalleryImageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const loadImages = async () => {
      try {
        setLoading(true);
        const data = await fetchGalleryImages(categoryId);
        setImages(data);
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
        toast.error("Không thể tải danh sách ảnh");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [categoryId]);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (currentPage * itemsPerPage < images.length) {
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
  }, [currentPage, images.length, itemsPerPage]);

  return {
    images,
    setImages,
    currentPage,
    itemsPerPage,
    loading,
    observerTarget,
  };
}
