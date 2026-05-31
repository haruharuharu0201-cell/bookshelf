export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { Post } from "@/lib/types";
import BookGrid from "@/components/BookGrid";
import Link from "next/link";

async function getUserPosts(nickname: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, likes(count), comments(count)`)
    .eq("nickname", nickname)
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data || []).map((post) => ({
    ...post,
    likes_count: post.likes?.[0]?.count ?? 0,
    comments_count: post.comments?.[0]?.count ?? 0,
  }));
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;
  const decodedNickname = decodeURIComponent(nickname);
  const posts = await getUserPosts(decodedNickname);

  return (
    <div>
      <Link
        href="/"
        className="text-sm text-amber-700 hover:text-amber-900 mb-6 inline-flex items-center gap-1"
      >
        ← 本棚に戻る
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          📚 {decodedNickname} の本棚
        </h1>
        <p className="text-gray-500 text-sm">{posts.length} 冊投稿</p>
      </div>

      <BookGrid
        posts={posts}
        emptyMessage="まだ投稿がありません"
      />
    </div>
  );
}
