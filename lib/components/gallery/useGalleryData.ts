import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type SetStateAction,
} from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGalleryImages } from "@/lib/services/api";
import { GalleryImageRecord } from "@/lib/types";

export function useGalleryData(
  categoryId: string | undefined,
  itemsPerPage = 6,
) {
  const queryClient = useQueryClient();
  const observerTarget = useRef<HTMLDivElement>(null);
  const queryKey = ["galleryImages", categoryId];

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 0 }) =>
        fetchGalleryImages(categoryId!, pageParam as number, itemsPerPage),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.hasMore ? allPages.length : undefined,
      enabled: Boolean(categoryId),
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    });

  const images = useMemo(
    () => data?.pages.flatMap((page) => page.images) ?? [],
    [data],
  );

  const setImages = useCallback(
    (updater: SetStateAction<GalleryImageRecord[]>) => {
      if (!categoryId) return;

      queryClient.setQueryData(
        queryKey,
        (
          oldData:
            | {
                pages: { images: GalleryImageRecord[]; hasMore: boolean }[];
                pageParams: unknown[];
              }
            | undefined,
        ) => {
          if (!oldData) return oldData;

          const currentImages = oldData.pages.flatMap((page) => page.images);
          const nextImages =
            typeof updater === "function"
              ? (
                  updater as (
                    prev: GalleryImageRecord[],
                  ) => GalleryImageRecord[]
                )(currentImages)
              : updater;

          const pages = [] as {
            images: GalleryImageRecord[];
            hasMore: boolean;
          }[];
          const totalPages = Math.max(
            1,
            Math.ceil(nextImages.length / itemsPerPage),
          );

          for (let index = 0; index < totalPages; index += 1) {
            const start = index * itemsPerPage;
            const end = start + itemsPerPage;
            pages.push({
              images: nextImages.slice(start, end),
              hasMore: end < nextImages.length,
            });
          }

          return {
            ...oldData,
            pages,
            pageParams: pages.map((_, pageIndex) => pageIndex),
          };
        },
      );
    },
    [categoryId, itemsPerPage, queryClient],
  );

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !isLoading &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    images.length,
  ]);

  return {
    images,
    setImages,
    currentPage: 0,
    itemsPerPage,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasMore: Boolean(hasNextPage),
    observerTarget,
  };
}
