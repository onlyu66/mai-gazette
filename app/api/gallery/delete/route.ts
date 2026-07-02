import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { extractStoragePathFromUrl } from "@/lib/utils/storagePath";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: Request) {
  try {
    const { id, userId, accessToken } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Thiếu id ảnh cần xóa." },
        { status: 400 },
      );
    }

    if (!supabaseUrl || (!serviceRoleKey && !supabaseAnonKey)) {
      return NextResponse.json(
        { error: "Supabase chưa được cấu hình trên server." },
        { status: 500 },
      );
    }

    const client = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined,
          },
        });

    if (accessToken && userId) {
      const {
        data: { user },
        error: authError,
      } = await client.auth.getUser(accessToken);

      if (authError || !user || user.id !== userId) {
        return NextResponse.json(
          { error: "Bạn cần đăng nhập để xóa ảnh." },
          { status: 401 },
        );
      }
    }

    const { data: imageData, error: fetchError } = await client
      .from("gallery_images")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Không thể đọc thông tin ảnh." },
        { status: 404 },
      );
    }

    const { error: deleteRowError } = await client
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (deleteRowError) {
      return NextResponse.json(
        { error: deleteRowError.message || "Không thể xóa bản ghi ảnh." },
        { status: 500 },
      );
    }

    if (imageData?.image_url) {
      const parsed = extractStoragePathFromUrl(imageData.image_url);
      if (!parsed) {
        return NextResponse.json(
          { error: "Không thể trích xuất đường dẫn ảnh từ URL storage." },
          { status: 400 },
        );
      }

      if (!serviceRoleKey) {
        return NextResponse.json(
          {
            error:
              "Xóa file storage cần Supabase Service Role Key. Vui lòng thêm SUPABASE_SERVICE_ROLE_KEY vào biến môi trường server rồi khởi động lại app.",
          },
          { status: 500 },
        );
      }

      const { data: removedData, error: storageError } = await client.storage
        .from(parsed.bucket)
        .remove([parsed.objectPath]);

      if (storageError) {
        return NextResponse.json(
          {
            error: storageError.message || "Không thể xóa file trong storage.",
          },
          { status: 500 },
        );
      }

      if (!removedData || removedData.length === 0) {
        return NextResponse.json({
          success: true,
          message:
            "Đã xử lý xóa storage; file không còn tồn tại hoặc đã được loại bỏ trước đó.",
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}
