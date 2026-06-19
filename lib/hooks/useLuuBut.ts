import { useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import {
  fetchLuuButList,
  insertLuuBut,
  uploadStorageImage,
} from "../services/api";
import { LuuButRecord, LuuButFormData } from "../types";
import React from "react";

export const useLuuBut = () => {
  const [luuButList, setLuuButList] = useState<LuuButRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LuuButFormData>({
    tieuDe: "loi-chuc",
    noiDung: "",
    tacGia: "",
    quaTang: "🥹 Xúc động",
    anhBase64: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLuuButList();
        setLuuButList(data);
      } catch (err: any) {
        console.error("Không thể tải danh sách lưu bút:", err.message);
      }
    };
    loadData();
  }, []);

  const updateField = (field: keyof LuuButFormData, value: string) => {
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
      if (formData.anhBase64) {
        uploadedUrl = await uploadStorageImage(formData.anhBase64);
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
        quaTang: "🥹 Xúc động",
        anhBase64: "",
      });

      toast.success("🎉 Ấn bản trang nhất đã được lưu trữ và xuất bản thành công!");
    } catch (error: any) {
      toast.error(`Lỗi xuất bản: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    luuButList,
    loading,
    updateField,
    formatDropCapText,
    submitLuuBut,
  };
};
