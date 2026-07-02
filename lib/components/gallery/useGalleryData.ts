import { useState, useEffect, useRef } from "react";
import { fetchGalleryImages } from "@/lib/services/api";
import { GalleryImageRecord } from "@/lib/types";
import toast from "react-hot-toast";

export function useGalleryData(
  categoryId: string | undefined,
  itemsPerPage = 6,
) {
  const [images, setImages] = useState<GalleryImageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const resetGalleryState = () => {
      setImages([]);
      setCurrentPage(0);
      setHasMore(true);
    };

    resetGalleryState();
  }, [categoryId, itemsPerPage]);

  useEffect(() => {
    if (!categoryId || (!hasMore && currentPage > 0)) return;

    const loadImages = async () => {
      try {
        if (currentPage === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const result = await fetchGalleryImages(
          categoryId,
          currentPage,
          itemsPerPage,
        );
        setImages((prev) =>
          currentPage === 0 ? result.images : [...prev, ...result.images],
        );
        setHasMore(result.hasMore);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : JSON.stringify(error, null, 2);
        console.error("Lỗi khi tải ảnh:", errorMessage, error);
        toast.error("Không thể tải danh sách ảnh");
      } finally {
        if (currentPage === 0) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    };

    loadImages();
  }, [categoryId, currentPage, itemsPerPage, hasMore]);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setCurrentPage((p) => p + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [currentPage, images.length, itemsPerPage, hasMore, loading, loadingMore]);

  return {
    images,
    setImages,
    currentPage,
    itemsPerPage,
    loading,
    loadingMore,
    hasMore,
    observerTarget,
  };
}
