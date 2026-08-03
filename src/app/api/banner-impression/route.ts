import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const bannerId = body?.bannerId;
  const pagePath = typeof body?.pagePath === "string" ? body.pagePath.slice(0, 500) : null;

  if (typeof bannerId !== "string") {
    return NextResponse.json({ error: "bannerId is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase.from("banner_events").insert({
    banner_id: bannerId,
    event_type: "impression",
    page_path: pagePath,
  });

  return new NextResponse(null, { status: 204 });
}
