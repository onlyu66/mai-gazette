import { supabase } from "@/lib/supabase";
import { GalleryImageRecord, InsertLuuButDTO, LuuButRecord } from "../types";

const GRADUATE_IMAGE_PUBLIC_CATEGORY = "graduate-hero";
const PUBLIC_GRADUATE_PROFILE_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Upload file Blob ảnh lên Supabase Storage.
 * Hàm nhận Blob đã được nén từ client, không cần decode base64 nữa.
 */
export const uploadGalleryImage = async (
  blob: Blob,
  mimeType: string,
): Promise<string | null> => {
  if (!supabase) return null;
  try {
    const ext = mimeType === "image/png" ? "png" : "jpg";
    const fileName = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, blob, { contentType: mimeType, upsert: false });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error: unknown) {
    console.error(
      "Lỗi khi upload ảnh gallery:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
};

/**
 * Upload file ảnh từ mã hóa Base64 string lên Supabase Storage (legacy — dùng cho Luưu bút)
 */
export const uploadStorageImage = async (
  base64Data: string,
): Promise<string | null> => {
  if (!base64Data || !supabase) return null;
  try {
    const response = await fetch(base64Data);
    const blob = await response.blob();

    const fileName = `phong-su-${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, blob, { contentType: "image/png" });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error: unknown) {
    console.error(
      "Lỗi khi upload ảnh lên Storage:",
      error instanceof Error ? error.message : String(error),
    );
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
        noi_dung: postData.noiDung,
        tac_gia: postData.tacGia || "Bạn ẩn danh",
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
 * Lấy danh sách lưu bút đã xuất bản (toàn bộ — legacy)
 */
export const fetchLuuButList = async (): Promise<LuuButRecord[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("luu_but")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as LuuButRecord[];
};

/**
 * Lấy danh sách lưu bút theo trang (pagination)
 */
export const fetchLuuButPage = async (
  page: number,
  pageSize = 12,
  searchQuery?: string,
): Promise<{ records: LuuButRecord[]; hasMore: boolean }> => {
  if (!supabase) return { records: [], hasMore: false };

  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("luu_but").select("*", { count: "exact" });

  if (searchQuery) {
    const term = searchQuery.toLowerCase();

    query = query.or(`tac_gia.ilike.%${term}%,noi_dung.ilike.%${term}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const records = (data || []) as LuuButRecord[];
  const total = count ?? 0;
  return { records, hasMore: from + records.length < total };
};

/**
 * Lấy danh sách ảnh trong Gallery
 */
export const fetchGalleryImages = async (
  category?: string,
  page = 0,
  pageSize = 12,
): Promise<{ images: GalleryImageRecord[]; hasMore: boolean }> => {
  if (!supabase) return { images: [], hasMore: false };

  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("gallery_images")
    .select("*", { count: "exact" })
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) {
    if (error.code === "PGRST103") {
      return { images: [], hasMore: false };
    }
    throw error;
  }

  const records = (data || []) as GalleryImageRecord[];
  const total = typeof count === "number" ? count : null;
  const hasMore =
    total !== null
      ? from + records.length < total
      : records.length === pageSize;
  return { images: records, hasMore };
};

/**
 * Thêm ảnh mới vào Gallery
 */
export const saveGraduateImagePreference = async (
  userId: string,
  imageUrl: string,
): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const profileResult = await supabase.from("profiles").upsert(
      {
        id: userId,
        graduate_image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (profileResult.error) {
      if (
        profileResult.error?.code &&
        ["42P01", "PGRST116", "PGRST114", "42501"].includes(
          profileResult.error.code,
        )
      ) {
        // Fall back to a public record so anonymous visitors can still read the image.
      } else {
        throw profileResult.error;
      }
    }

    const { data: existingPublicRecord, error: existingPublicError } =
      await supabase
        .from("gallery_images")
        .select("id")
        .eq("category", GRADUATE_IMAGE_PUBLIC_CATEGORY)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (existingPublicError) {
      if (
        existingPublicError?.code &&
        ["42P01", "PGRST116", "PGRST114"].includes(existingPublicError.code)
      ) {
        return false;
      }
      throw existingPublicError;
    }

    if (existingPublicRecord?.id) {
      const { error: updateError } = await supabase
        .from("gallery_images")
        .update({ image_url: imageUrl, order_index: 0 })
        .eq("id", existingPublicRecord.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from("gallery_images")
        .insert([
          {
            category: GRADUATE_IMAGE_PUBLIC_CATEGORY,
            image_url: imageUrl,
            order_index: 0,
          },
        ]);

      if (insertError) {
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (["42P01", "PGRST116", "PGRST114", "42501"].includes(code)) {
      return false;
    }
    console.error("Lỗi khi lưu ảnh tân cử nhân vào Supabase:", error);
    return false;
  }
};

export const getGraduateImagePreference = async (
  userId: string,
): Promise<string | null> => {
  if (!supabase) return null;

  try {
    const { data: publicData, error: publicError } = await supabase
      .from("gallery_images")
      .select("image_url")
      .eq("category", GRADUATE_IMAGE_PUBLIC_CATEGORY)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (publicError) {
      if (
        publicError?.code &&
        ["42P01", "PGRST116", "PGRST114"].includes(publicError.code)
      ) {
        return null;
      }
      throw publicError;
    }

    const publicFallbackUrl = publicData?.image_url ?? null;

    if (!userId || userId === PUBLIC_GRADUATE_PROFILE_ID) {
      return publicFallbackUrl;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("graduate_image_url")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      if (
        error?.code &&
        ["42P01", "PGRST116", "PGRST114"].includes(error.code)
      ) {
        return publicFallbackUrl;
      }
      throw error;
    }

    return data?.graduate_image_url ?? publicFallbackUrl;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const code = (error as { code?: string }).code;
      if (code && ["42P01", "PGRST116", "PGRST114"].includes(code)) {
        return null;
      }
    }
    console.error("Lỗi khi đọc ảnh tân cử nhân từ Supabase:", error);
    return null;
  }
};

export const insertGalleryImage = async (
  category: string,
  imageUrl: string,
  orderIndex?: number,
): Promise<GalleryImageRecord> => {
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const { data, error } = await supabase
    .from("gallery_images")
    .insert([{ category, image_url: imageUrl, order_index: orderIndex ?? 0 }])
    .select();

  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("Không thể khởi tạo bản ghi hình ảnh");
  return data[0] as GalleryImageRecord;
};

/**
 * Xóa ảnh khỏi Gallery
 */
export const deleteGalleryImage = async (id: string): Promise<void> => {
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) throw error;
};

/**
 * Cập nhật thứ tự hiển thị ảnh
 */
export const updateGalleryOrder = async (
  updates: { id: string; order_index: number }[],
): Promise<void> => {
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");
  if (updates.length === 0) return;

  // Sử dụng update thay vì upsert để tránh lỗi null constraint trên các cột khác
  const promises = updates.map((u) =>
    supabase!
      .from("gallery_images")
      .update({ order_index: u.order_index })
      .eq("id", u.id),
  );

  const results = await Promise.all(promises);
  const errors = results.filter((r) => r.error).map((r) => r.error);

  if (errors.length > 0) {
    throw new Error("Cập nhật thứ tự thất bại: " + errors[0]?.message);
  }
};
