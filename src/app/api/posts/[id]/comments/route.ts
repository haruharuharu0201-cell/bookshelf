import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/posts/[id]/comments">
) {
  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ comments: data });
}

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]/comments">
) {
  const { id } = await ctx.params;
  const { nickname, content } = await request.json();

  if (!nickname || !content) {
    return Response.json(
      { error: "ニックネームとコメントが必要です" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: id, nickname, content })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ comment: data }, { status: 201 });
}
