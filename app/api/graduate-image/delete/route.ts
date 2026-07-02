import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { extractStoragePathFromUrl } from "@/lib/utils/storagePath";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: Request) {
  try {
    const { imageUrl, userId, accessToken } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Thiếu đường dẫn ảnh cần xóa." },
        { status: 400 },
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Supabase Service Role Key chưa được cấu hình trên server. Không thể xóa file storage.",
        },
        { status: 500 },
      );
    }

    const client = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
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

    const parsed = extractStoragePathFromUrl(imageUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Không thể trích xuất đường dẫn ảnh từ URL storage." },
        { status: 400 },
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

    return NextResponse.json({
      success: true,
      bucket: parsed.bucket,
      path: parsed.objectPath,
      removed: removedData ?? [],
    });
  } catch (error) {
    console.error("Graduate image delete route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}
