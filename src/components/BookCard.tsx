"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types";

type Props = { post: Post };

export default function BookCard({ post }: Props) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const showImage = post.cover_image_url && !imgError;

  return (
    <div className="group cursor-pointer" onClick={() => router.push(`/post/${post.id}`)}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">

        {/* 画像エリア：正方形 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1", background: "#f7f3ec" }}>
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url!}
              alt={post.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #f5e6c8, #e8c878)" }}>
              <span className="text-5xl">📖</span>
              <p className="text-xs text-amber-900 font-bold text-center line-clamp-3 px-4 leading-snug">{post.title}</p>
            </div>
          )}

          {(post.likes_count ?? 0) > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm font-medium">
              ❤️ {post.likes_count}
            </div>
          )}
        </div>

        {/* テキストエリア */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2" style={{ fontSize: "14px" }}>
            {post.title}
          </h3>
          {post.author && (
            <p className="text-xs text-gray-500 truncate mb-3">{post.author}</p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <Link
              href={`/user/${encodeURIComponent(post.nickname)}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 min-w-0"
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "#b45309", fontSize: "10px" }}>
                {post.nickname.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-gray-700 truncate hover:text-amber-700 transition-colors">
                {post.nickname}
              </span>
            </Link>
            <span className="text-xs text-gray-400 shrink-0 ml-2">
              💬 {post.comments_count ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
