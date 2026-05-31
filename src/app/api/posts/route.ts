import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 24;
  const offset = (page - 1) * limit;
  const nickname = searchParams.get("nickname");

  let query = supabase
    .from("posts")
    .select(
      `*, likes(count), comments(count)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (nickname) {
    query = query.eq("nickname", nickname);
  }

  const { data, error, count } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const posts = (data || []).map((post) => ({
    ...post,
    likes_count: post.likes?.[0]?.count ?? 0,
    comments_count: post.comments?.[0]?.count ?? 0,
  }));

  return Response.json({ posts, total: count ?? 0 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nickname, amazon_url, title, author, cover_image_url, review, learnings } = body;

  if (!nickname || !amazon_url || !title || !review) {
    return Response.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ nickname, amazon_url, title, author, cover_image_url, review, learnings })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ post: data }, { status: 201 });
}
