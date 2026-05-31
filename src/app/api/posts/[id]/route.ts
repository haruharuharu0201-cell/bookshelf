import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/posts/[id]">
) {
  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("posts")
    .select(`*, likes(count), comments(count)`)
    .eq("id", id)
    .single();

  if (error) {
    return Response.json({ error: "投稿が見つかりません" }, { status: 404 });
  }

  const post = {
    ...data,
    likes_count: data.likes?.[0]?.count ?? 0,
    comments_count: data.comments?.[0]?.count ?? 0,
  };

  return Response.json({ post });
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]">
) {
  const { id } = await ctx.params;
  const { nickname, adminPassword } = await request.json();

  const isAdmin = adminPassword && adminPassword === process.env.ADMIN_PASSWORD;

  if (!nickname && !isAdmin) {
    return Response.json({ error: "ニックネームが必要です" }, { status: 400 });
  }

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("nickname")
    .eq("id", id)
    .single();

  if (fetchError || !post) {
    return Response.json({ error: "投稿が見つかりません" }, { status: 404 });
  }

  if (post.nickname !== nickname && !isAdmin) {
    return Response.json({ error: "削除できるのは投稿者本人のみです" }, { status: 403 });
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]">
) {
  const { id } = await ctx.params;
  const { nickname, review, learnings, adminPassword } = await request.json();

  const isAdmin = adminPassword && adminPassword === process.env.ADMIN_PASSWORD;

  if (!review) {
    return Response.json({ error: "感想は必須です" }, { status: 400 });
  }

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("nickname")
    .eq("id", id)
    .single();

  if (fetchError || !post) {
    return Response.json({ error: "投稿が見つかりません" }, { status: 404 });
  }

  if (post.nickname !== nickname && !isAdmin) {
    return Response.json({ error: "編集できるのは投稿者本人のみです" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ review, learnings: learnings || null })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ post: data });
}
