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
    const page = Number(searchParams.get("page") ?? "0");
    const pageSize = Number(searchParams.get("pageSize") ?? "12");
    const searchQuery = searchParams.get("search") ?? "";

    const client = getServerClient();
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = client.from("luu_but").select("*", { count: "exact" });

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      query = query.or(`tac_gia.ilike.%${term}%,noi_dung.ilike.%${term}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const records = data || [];
    const total = count ?? 0;

    return NextResponse.json({
      records,
      hasMore: from + records.length < total,
    });
  } catch (error) {
    console.error("luu-but GET error:", error);
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
    const noiDung = payload?.noiDung?.trim();
    const tacGia = payload?.tacGia?.trim() || "Bạn ẩn danh";
    const anhUrl = payload?.anhUrl ?? null;

    if (!noiDung) {
      return NextResponse.json(
        { error: "Nội dung lưu bút không được để trống." },
        { status: 400 },
      );
    }

    const client = getServerClient();
    const { data, error } = await client
      .from("luu_but")
      .insert([
        {
          noi_dung: noiDung,
          tac_gia: tacGia,
          anh_url: anhUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("luu-but POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}
