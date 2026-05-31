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
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">

        {/* 表紙画像 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2/3" }}>
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url!}
              alt={post.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2 p-3"
              style={{ background: "linear-gradient(135deg, #f5e6c8, #e8c878)" }}
            >
              <span className="text-4xl">📖</span>
              <p className="text-xs text-amber-900 font-semibold text-center line-clamp-4 leading-snug">
                {post.title}
              </p>
            </div>
          )}

          {/* いいね数バッジ */}
          {(post.likes_count ?? 0) > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
              <span>❤️</span>
              <span>{post.likes_count}</span>
            </div>
          )}
        </div>

        {/* 情報エリア */}
        <div className="p-3 flex flex-col gap-1 flex-1">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
            {post.title}
          </h3>
          {post.author && (
            <p className="text-xs text-gray-500 truncate">{post.author}</p>
          )}
          <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
            <Link
              href={`/user/${encodeURIComponent(post.nickname)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold truncate max-w-[65%] hover:underline"
              style={{ color: "#b45309" }}
            >
              {post.nickname}
            </Link>
            <span className="text-xs text-gray-400 shrink-0">
              💬 {post.comments_count ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
