"use client";

import { useState, useEffect } from "react";

type Props = {
  postId: string;
  initialCount: number;
};

export default function LikeButton({ postId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bookshelf_nickname");
    if (saved) setNickname(saved);

    const likedPosts = JSON.parse(
      localStorage.getItem("bookshelf_liked_posts") || "[]"
    ) as string[];
    setLiked(likedPosts.includes(postId));
  }, [postId]);

  const handleLike = async () => {
    const currentNickname =
      nickname ||
      prompt("いいねするためにニックネームを入力してください") ||
      "";
    if (!currentNickname.trim()) return;

    if (!nickname) {
      setNickname(currentNickname.trim());
      localStorage.setItem("bookshelf_nickname", currentNickname.trim());
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: currentNickname.trim() }),
      });

      if (!res.ok) return;

      const data = await res.json();
      const newLiked: boolean = data.liked;
      setLiked(newLiked);
      setCount((prev) => (newLiked ? prev + 1 : prev - 1));

      const likedPosts = JSON.parse(
        localStorage.getItem("bookshelf_liked_posts") || "[]"
      ) as string[];
      if (newLiked) {
        localStorage.setItem(
          "bookshelf_liked_posts",
          JSON.stringify([...likedPosts, postId])
        );
      } else {
        localStorage.setItem(
          "bookshelf_liked_posts",
          JSON.stringify(likedPosts.filter((id) => id !== postId))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
        liked
          ? "bg-red-50 border-red-300 text-red-600"
          : "bg-white border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
      } disabled:opacity-50`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
    </button>
  );
}
