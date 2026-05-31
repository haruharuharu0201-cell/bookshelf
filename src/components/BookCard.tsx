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
      {/* カード全体を正方形に、余白あり */}
      <div
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden"
        style={{ aspectRatio: "1/1", padding: "10px" }}
      >
        {/* 表紙画像：2/3の縦長を維持しつつカード内に収める */}
        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl min-h-0">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url!}
              alt={post.title}
              onError={() => setImgError(true)}
              className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-1 rounded-xl"
              style={{ background: "linear-gradient(135deg, #f5e6c8, #e8c878)" }}
            >
              <span className="text-3xl">📖</span>
              <p className="text-xs text-amber-900 font-semibold text-center line-clamp-3 px-2 leading-snug">
                {post.title}
              </p>
            </div>
          )}
        </div>

        {/* 情報エリア */}
        <div className="pt-2 shrink-0">
          <h3 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">
            {post.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <Link
              href={`/user/${encodeURIComponent(post.nickname)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold truncate max-w-[65%] hover:underline"
              style={{ color: "#b45309" }}
            >
              {post.nickname}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
              {(post.likes_count ?? 0) > 0 && <span>❤️ {post.likes_count}</span>}
              <span>💬 {post.comments_count ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
