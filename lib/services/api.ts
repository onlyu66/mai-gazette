import { supabase } from "@/lib/supabase";
import { GalleryImageRecord, InsertLuuButDTO, LuuButRecord } from "../types";

const GRADUATE_IMAGE_PUBLIC_CATEGORY = "graduate-hero";
const PUBLIC_GRADUATE_PROFILE_ID = "00000000-0000-0000-0000-000000000000";

const deleteStoredImageIfNeeded = async (
  previousImageUrl: string | null,
  nextImageUrl: string,
  userId?: string,
  accessToken?: string,
): Promise<void> => {
  if (!previousImageUrl || previousImageUrl === nextImageUrl) {
    return;
  }

  if (
    previousImageUrl === "/avatar.jpg" ||
    previousImageUrl.includes("/avatar.jpg")
  ) {
    return;
  }

  try {
    console.log(
      "🗑️ Requesting server-side storage deletion:",
      previousImageUrl,
    );

    const response = await fetch("/api/graduate-image/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: previousImageUrl,
        userId,
        accessToken,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.warn(
        "⚠️ Server-side storage cleanup did not remove the previous image; continuing with the update.",
        payload,
      );
      return;
    }

    console.log(
      "✅ Server-side storage image delete request completed",
      payload,
    );
  } catch (error) {
    console.warn(
      "⚠️ Could not delete the previous storage image, but the profile update will continue:",
      error,
    );
  }
};

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
  const response = await fetch("/api/luu-but", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      noiDung: postData.noiDung,
      tacGia: postData.tacGia || "Bạn ẩn danh",
      anhUrl: postData.anhUrl,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Không thể khởi tạo bản ghi dữ liệu");
  }

  return payload as LuuButRecord;
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
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (searchQuery) {
    query.set("search", searchQuery);
  }

  const response = await fetch(`/api/luu-but?${query.toString()}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Không thể tải danh sách lưu bút.");
  }

  return {
    records: (payload?.records || []) as LuuButRecord[],
    hasMore: Boolean(payload?.hasMore),
  };
};

/**
 * Lấy danh sách ảnh trong Gallery
 */
export const fetchGalleryImages = async (
  category?: string,
  page = 0,
  pageSize = 12,
): Promise<{ images: GalleryImageRecord[]; hasMore: boolean }> => {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (category) {
    query.set("category", category);
  }

  const response = await fetch(`/api/gallery?${query.toString()}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Không thể tải danh sách ảnh.");
  }

  return {
    images: (payload?.images || []) as GalleryImageRecord[],
    hasMore: Boolean(payload?.hasMore),
  };
};

/**
 * Thêm ảnh mới vào Gallery
 */
export const saveGraduateImagePreference = async (
  userId: string,
  imageUrl: string,
  previousImageUrl?: string | null,
): Promise<boolean> => {
  try {
    if (!supabase) {
      throw new Error("Supabase chưa được cấu hình.");
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/graduate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        imageUrl,
        previousImageUrl,
        accessToken: session?.access_token,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || "Không thể lưu ảnh tân cử nhân.");
    }

    await deleteStoredImageIfNeeded(
      previousImageUrl ?? null,
      imageUrl,
      userId,
      session?.access_token,
    );

    return true;
  } catch (error) {
    console.error("Lỗi khi lưu ảnh tân cử nhân vào Supabase:", error);
    throw error;
  }
};

export const getGraduateImagePreference = async (
  userId: string,
): Promise<string | null> => {
  try {
    const response = await fetch(`/api/graduate-image?userId=${userId}`);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error || "Không thể tải ảnh tân cử nhân.");
    }

    return payload?.imageUrl ?? null;
  } catch (error) {
    console.error("Lỗi khi đọc ảnh tân cử nhân từ Supabase:", error);
    return null;
  }
};

export const insertGalleryImage = async (
  category: string,
  imageUrl: string,
  orderIndex?: number,
): Promise<GalleryImageRecord> => {
  const response = await fetch("/api/gallery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category,
      imageUrl,
      orderIndex: orderIndex ?? 0,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Không thể khởi tạo bản ghi hình ảnh");
  }

  return payload as GalleryImageRecord;
};

/**
 * Xóa ảnh khỏi Gallery
 */
export const deleteGalleryImage = async (id: string): Promise<void> => {
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("Bạn phải đăng nhập để xóa ảnh.");
  }

  const response = await fetch("/api/gallery/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      userId: session.user.id,
      accessToken: session.access_token,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Không thể xóa ảnh.");
  }
};

/**
 * Cập nhật thứ tự hiển thị ảnh
 */
export const updateGalleryOrder = async (
  updates: { id: string; order_index: number }[],
): Promise<void> => {
  if (updates.length === 0) return;

  const response = await fetch("/api/gallery", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      updates.map((u) => ({ id: u.id, order_index: u.order_index })),
    ),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Cập nhật thứ tự thất bại.");
  }
};
