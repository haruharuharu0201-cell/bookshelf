import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]/like">
) {
  const { id } = await ctx.params;
  const { nickname } = await request.json();

  if (!nickname) {
    return Response.json({ error: "ニックネームが必要です" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", id)
    .eq("nickname", nickname)
    .single();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    return Response.json({ liked: false });
  }

  await supabase.from("likes").insert({ post_id: id, nickname });
  return Response.json({ liked: true });
}
