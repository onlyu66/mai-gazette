import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchLuuButPage,
  insertLuuBut,
  uploadGalleryImage,
} from "../services/api";
import { LuuButFormData, LuuButRecord } from "../types";

const PAGE_SIZE = 12;

export const useLuuBut = () => {
  const [luuButList, setLuuButList] = useState<LuuButRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const pageRef = useRef<number>(0);
  const [formData, setFormData] = useState<LuuButFormData>({
    tieuDe: "loi-chuc",
    noiDung: "",
    tacGia: "",
    quaTang: "🥺 Xúc động",
    anhFile: null,
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Load first page on mount or when searchQuery changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { records, hasMore: more } = await fetchLuuButPage(0, PAGE_SIZE, searchQuery);
        setLuuButList(records);
        setHasMore(more);
        pageRef.current = 0;
      } catch (err: unknown) {
        console.error("Không thể tải danh sách lưu bút:", err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchQuery]);

  const searchLuuBut = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return null;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const { records, hasMore: more } = await fetchLuuButPage(nextPage, PAGE_SIZE, searchQuery);
      setLuuButList((prev) => [...prev, ...records]);
      setHasMore(more);
      pageRef.current = nextPage;
      return records;
    } catch (err: unknown) {
      console.error("Lỗi khi tải thêm lưu bút:", err);
      return null;
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore]);

  const updateField = (field: keyof LuuButFormData, value: LuuButFormData[keyof LuuButFormData]) => {
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

    setLoading(true);
    try {
      let uploadedUrl: string | null = null;
      if (formData.anhFile) {
        const mimeType = formData.anhFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        uploadedUrl = await uploadGalleryImage(formData.anhFile, mimeType);
      }

      const newRecord = await insertLuuBut({
        tieuDe: formData.tieuDe,
        noiDung: formData.noiDung,
        tacGia: formData.tacGia,
        quaTang: formData.quaTang,
        anhUrl: uploadedUrl,
      });

      setLuuButList((prev) => [newRecord, ...prev]);

      setFormData({
        tieuDe: "loi-chuc",
        noiDung: "",
        tacGia: "",
        quaTang: "🥺 Xúc động",
        anhFile: null,
      });

      toast.success("🎉 Ấn bản trang nhất đã được lưu trữ và xuất bản thành công!");
    } catch (error: unknown) {
      toast.error(`Lỗi xuất bản: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    luuButList,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    updateField,
    formatDropCapText,
    submitLuuBut,
    searchLuuBut,
  };
};
