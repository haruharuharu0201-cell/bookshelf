"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  nickname: string;
  review: string;
  learnings: string | null;
};

const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition";

export default function EditForm({ post }: { post: Post }) {
  const router = useRouter();
  const [review, setReview] = useState(post.review);
  const [learnings, setLearnings] = useState(post.learnings || "");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const nickname = localStorage.getItem("bookshelf_nickname");
    const adminPassword = localStorage.getItem("bookshelf_admin_password");
    if (nickname !== post.nickname && !adminPassword) {
      setAuthError(true);
    }
  }, [post.nickname]);

  if (authError) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">この投稿を編集する権限がありません。</p>
        <p className="text-xs text-gray-400 mt-1">投稿者本人のみ編集できます。</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim()) return;

    setSubmitting(true);
    const nickname = localStorage.getItem("bookshelf_nickname");
    const adminPassword = localStorage.getItem("bookshelf_admin_password") || undefined;

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, review: review.trim(), learnings: learnings.trim(), adminPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "更新に失敗しました");
        return;
      }

      router.push(`/post/${post.id}`);
      router.refresh();
    } catch {
      alert("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          読んだ感想 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          className={`${inputClass} resize-y`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          学んだこと・印象に残ったこと
          <span className="text-xs text-gray-400 font-normal ml-2">（任意）</span>
        </label>
        <textarea
          value={learnings}
          onChange={(e) => setLearnings(e.target.value)}
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={submitting || !review.trim()}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40"
          style={{ background: "#b45309" }}
        >
          {submitting ? "更新中…" : "保存する"}
        </button>
      </div>
    </form>
  );
}
