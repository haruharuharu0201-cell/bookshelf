export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Comment } from "@/lib/types";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import DeleteButton from "@/components/DeleteButton";

async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, likes(count), comments(count)`)
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...data,
    likes_count: data.likes?.[0]?.count ?? 0,
    comments_count: data.comments?.[0]?.count ?? 0,
  };
}

async function getComments(postId: string): Promise<Comment[]> {
  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  return data || [];
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, comments] = await Promise.all([getPost(id), getComments(id)]);

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="text-sm text-amber-700 hover:text-amber-900 mb-6 inline-flex items-center gap-1"
      >
        ← 本棚に戻る
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex gap-5 mb-6">
          {post.cover_image_url && (
            <div className="w-28 h-40 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover rounded-lg shadow"
              />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">
              {post.title}
            </h1>
            {post.author && (
              <p className="text-sm text-gray-500 mb-2">{post.author}</p>
            )}
            <a
              href={post.amazon_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Amazonで見る →
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <Link
            href={`/user/${encodeURIComponent(post.nickname)}`}
            className="text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            📖 {post.nickname}
          </Link>
          <span className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleDateString("ja-JP")}
          </span>
        </div>

        <section className="mb-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">感想</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.review}
          </p>
        </section>

        {post.learnings && (
          <section className="bg-amber-50 rounded-lg p-4 mb-5">
            <h2 className="text-sm font-semibold text-amber-800 mb-2">
              学んだこと
            </h2>
            <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">
              {post.learnings}
            </p>
          </section>
        )}

        <div className="flex items-center justify-between">
          <LikeButton postId={post.id} initialCount={post.likes_count} />
          <DeleteButton postId={post.id} postNickname={post.nickname} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <CommentSection postId={post.id} initialComments={comments} />
      </div>
    </div>
  );
}
