import { supabase } from "@/lib/supabase";
import { LuuButRecord, InsertLuuButDTO } from "../types";

/**
 * Upload file ảnh từ mã hóa Base64 string lên Supabase Storage
 */
export const uploadStorageImage = async (
  base64Data: string,
): Promise<string | null> => {
  if (!base64Data || !supabase) return null;
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
  if (!supabase) throw new Error("Supabase chưa được cấu hình (.env.local).");

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
  if (!supabase) return []; // Trả về mảng rỗng khi chưa cấu hình Supabase

  const { data, error } = await supabase
    .from("luu_but")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as LuuButRecord[];
};

/**
 * Lấy danh sách ảnh trong Gallery
 */
export const fetchGalleryImages = async (category?: string): Promise<any[]> => {
  if (!supabase) return [];
  
  let query = supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
  if (category) {
    query = query.eq("category", category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Thêm ảnh mới vào Gallery
 */
export const insertGalleryImage = async (category: string, imageUrl: string): Promise<any> => {
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const { data, error } = await supabase
    .from("gallery_images")
    .insert([{ category, image_url: imageUrl }])
    .select();

  if (error) throw error;
  return data ? data[0] : null;
};

/**
 * Xóa ảnh khỏi Gallery
 */
export const deleteGalleryImage = async (id: string): Promise<void> => {
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
