import React, { ReactNode, useCallback, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchLuuButPage,
  insertLuuBut,
  uploadGalleryImage,
} from "../services/api";
import { LuuButFormData } from "../types";

const PAGE_SIZE = 12;

export const useLuuBut = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<LuuButFormData>({
    noiDung: "",
    tacGia: "",
    anhFile: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["luuButPage", searchQuery],
      queryFn: ({ pageParam = 0 }) =>
        fetchLuuButPage(pageParam as number, PAGE_SIZE, searchQuery),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.hasMore ? allPages.length : undefined,
      staleTime: 30_000,
    });

  const luuButList = useMemo(
    () => data?.pages.flatMap((page) => page.records) ?? [],
    [data],
  );

  const insertMutation = useMutation({
    mutationFn: insertLuuBut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["luuButPage", searchQuery],
      });
      setFormData({
        noiDung: "",
        tacGia: "",
        anhFile: null,
      });
      toast.success(
        "🎉 Ấn bản trang nhất đã được lưu trữ và xuất bản thành công!",
      );
    },
    onError: (error: unknown) => {
      toast.error(
        `Lỗi xuất bản: ${error instanceof Error ? error.message : String(error)}`,
      );
    },
  });

  const searchLuuBut = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    await fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const updateField = (
    field: keyof LuuButFormData,
    value: LuuButFormData[keyof LuuButFormData],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDropCapText = (text: string): ReactNode => {
    const chuGoc = text.trim();
    if (chuGoc === "") {
      return "Hãy viết những lời chúc chân thành ở biểu mẫu bên cạnh. Hệ thống sẽ tự động chuyển đổi văn bản của bạn thành định dạng bài báo phóng sự hai cột chuyên nghiệp...";
    }
    if (chuGoc.length < 10 || !chuGoc.includes(" ")) return chuGoc;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "span",
        {
          className:
            "font-bao-chi text-5xl float-left leading-[0.85] pr-1.5 font-black text-[#1A1512]",
        },
        chuGoc.charAt(0),
      ),
      chuGoc.slice(1),
    );
  };

  const submitLuuBut = async () => {
    if (!formData.noiDung.trim()) {
      toast.error("Vui lòng nhập nội dung lời chúc trước khi gửi nha!");
      return;
    }

    try {
      let uploadedUrl: string | null = null;
      if (formData.anhFile) {
        const mimeType =
          formData.anhFile.type === "image/png" ? "image/png" : "image/jpeg";
        try {
          uploadedUrl = await uploadGalleryImage(formData.anhFile, mimeType);
        } catch (error) {
          toast.error("Không thể tải ảnh đính kèm. Vui lòng thử lại!");
          throw error;
        }
      }

      const postData = {
        noiDung: formData.noiDung,
        tacGia: formData.tacGia.trim(),
        anhUrl: uploadedUrl,
      };

      await insertMutation.mutateAsync(postData);
    } catch (error: unknown) {
      console.error("Lỗi xuất bản:", error);
      toast.error(
        `Xuất bản thất bại: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return {
    formData,
    luuButList,
    loading: isLoading || insertMutation.isPending,
    loadingMore: isFetchingNextPage,
    hasMore: Boolean(hasNextPage),
    loadMore,
    updateField,
    formatDropCapText,
    submitLuuBut,
    searchLuuBut,
  };
};
