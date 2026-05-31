export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { Post } from "@/lib/types";
import BookGrid from "@/components/BookGrid";

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, likes(count), comments(count)`)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error) return [];

  return (data || []).map((post) => ({
    ...post,
    likes_count: post.likes?.[0]?.count ?? 0,
    comments_count: post.comments?.[0]?.count ?? 0,
  }));
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">新着の本</h1>
          <p className="text-gray-500 text-sm">
            みんなで <span className="font-bold text-amber-700">{posts.length}</span> 冊の本をシェア中
          </p>
        </div>
      </div>
      <BookGrid
        posts={posts}
        emptyMessage="まだ誰も本を投稿していません。最初の一冊を投稿しましょう！"
      />
    </div>
  );
}
