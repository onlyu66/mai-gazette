import { supabase } from "@/lib/supabase";
import { LuuButRecord, InsertLuuButDTO } from "../types";

/**
 * Upload file ảnh từ mã hóa Base64 string lên Supabase Storage
 */
export const uploadStorageImage = async (
  base64Data: string,
): Promise<string | null> => {
  if (!base64Data) return null;
  try {
    const response = await fetch(base64Data);
    const blob = await response.blob();

    const fileName = `phong-su-${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, blob, { contentType: "image/png" });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error("Lỗi khi upload ảnh lên Storage:", error.message);
    throw error;
  }
};

/**
 * Gửi lưu bút mới vào Database
 */
export const insertLuuBut = async (
  postData: InsertLuuButDTO,
): Promise<LuuButRecord> => {
  const { data, error } = await supabase
    .from("luu_but")
    .insert([
      {
        tieu_de: postData.tieuDe,
        noi_dung: postData.noiDung,
        tac_gia: postData.tacGia || "Bạn ẩn danh",
        qua_tang: postData.quaTang,
        anh_url: postData.anhUrl,
      },
    ])
    .select();

  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("Không thể khởi tạo bản ghi dữ liệu");
  return data[0] as LuuButRecord;
};

/**
 * Lấy danh sách lưu bút đã xuất bản
 */
export const fetchLuuButList = async (): Promise<LuuButRecord[]> => {
  const { data, error } = await supabase
    .from("luu_but")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as LuuButRecord[];
};
