import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const GRADUATE_IMAGE_PUBLIC_CATEGORY = "graduate-hero";
const PUBLIC_GRADUATE_PROFILE_ID = "00000000-0000-0000-0000-000000000000";

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
    const userId = searchParams.get("userId") || PUBLIC_GRADUATE_PROFILE_ID;
    const client = getServerClient();

    const { data: publicData, error: publicError } = await client
      .from("gallery_images")
      .select("image_url")
      .eq("category", GRADUATE_IMAGE_PUBLIC_CATEGORY)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (publicError) {
      if (["42P01", "PGRST116", "PGRST114"].includes(publicError.code ?? "")) {
        return NextResponse.json({ imageUrl: null });
      }
      return NextResponse.json({ error: publicError.message }, { status: 500 });
    }

    const publicFallbackUrl = publicData?.image_url ?? null;

    if (!userId || userId === PUBLIC_GRADUATE_PROFILE_ID) {
      return NextResponse.json({ imageUrl: publicFallbackUrl });
    }

    const { data, error } = await client
      .from("profiles")
      .select("graduate_image_url")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      if (["42P01", "PGRST116", "PGRST114"].includes(error.code ?? "")) {
        return NextResponse.json({ imageUrl: publicFallbackUrl });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl: data?.graduate_image_url ?? publicFallbackUrl,
    });
  } catch (error) {
    console.error("graduate-image GET error:", error);
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
    const userId = payload?.userId;
    const imageUrl = payload?.imageUrl;
    const previousImageUrl = payload?.previousImageUrl ?? null;

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: "Thiếu userId hoặc imageUrl." },
        { status: 400 },
      );
    }

    const client = getServerClient();
    const { data: existingPublicRecord, error: existingPublicError } =
      await client
        .from("gallery_images")
        .select("id, image_url")
        .eq("category", GRADUATE_IMAGE_PUBLIC_CATEGORY)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (
      existingPublicError &&
      !["42P01", "PGRST116", "PGRST114"].includes(
        existingPublicError.code ?? "",
      )
    ) {
      return NextResponse.json(
        { error: existingPublicError.message },
        { status: 500 },
      );
    }

    const profileResult = await client.from("profiles").upsert(
      {
        id: userId,
        graduate_image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (profileResult.error) {
      return NextResponse.json(
        { error: profileResult.error.message },
        { status: 500 },
      );
    }

    if (existingPublicRecord?.id) {
      const { error: updateError } = await client
        .from("gallery_images")
        .update({ image_url: imageUrl, order_index: 0 })
        .eq("id", existingPublicRecord.id);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 },
        );
      }
    } else {
      const { error: insertError } = await client
        .from("gallery_images")
        .insert([
          {
            category: GRADUATE_IMAGE_PUBLIC_CATEGORY,
            image_url: imageUrl,
            order_index: 0,
          },
        ]);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      previousImageUrl,
    });
  } catch (error) {
    console.error("graduate-image POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}
