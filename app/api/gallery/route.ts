import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const getServerClient = () =>
  createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

export async function GET(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase service role chưa được cấu hình." },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const page = Number(searchParams.get("page") ?? "0");
    const pageSize = Number(searchParams.get("pageSize") ?? "12");

    const client = getServerClient();
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = client
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
        return NextResponse.json({ images: [], hasMore: false });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const images = data || [];
    const total = typeof count === "number" ? count : null;
    return NextResponse.json({
      images,
      hasMore:
        total !== null
          ? from + images.length < total
          : images.length === pageSize,
    });
  } catch (error) {
    console.error("gallery GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase service role chưa được cấu hình." },
        { status: 500 },
      );
    }

    const payload = await request.json();
    const client = getServerClient();
    const { data, error } = await client
      .from("gallery_images")
      .insert([
        {
          category: payload.category,
          image_url: payload.imageUrl,
          order_index: payload.orderIndex ?? 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("gallery POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase service role chưa được cấu hình." },
        { status: 500 },
      );
    }

    const updates = await request.json();
    const client = getServerClient();
    const results = await Promise.all(
      (updates || []).map((u: { id: string; order_index: number }) =>
        client
          .from("gallery_images")
          .update({ order_index: u.order_index })
          .eq("id", u.id),
      ),
    );

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors[0]?.error?.message || "Cập nhật thứ tự thất bại." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("gallery PATCH error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}
