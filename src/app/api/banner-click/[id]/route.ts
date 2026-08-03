import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: banner } = await supabase
    .from("banners")
    .select("link_url, is_active")
    .eq("id", id)
    .single();

  if (!banner) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  await supabase.from("banner_events").insert({
    banner_id: id,
    event_type: "click",
    page_path: request.nextUrl.searchParams.get("from"),
  });

  return NextResponse.redirect(banner.link_url);
}
