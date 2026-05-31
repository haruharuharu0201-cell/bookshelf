"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/lib/types";

type Props = {
  postId: string;
  initialComments: Comment[];
};

export default function CommentSection({ postId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bookshelf_nickname");
    if (saved) setNickname(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setSubmitting(true);
    localStorage.setItem("bookshelf_nickname", nickname.trim());

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "コメントの投稿に失敗しました");
        return;
      }

      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setContent("");
    } catch {
      alert("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        コメント ({comments.length})
      </h2>

      <div className="space-y-3 mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">まだコメントはありません</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-amber-700">
                  {comment.nickname}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">コメントを追加</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="ニックネーム"
            maxLength={30}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="コメントを書いてください..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            required
          />
          <button
            type="submit"
            disabled={submitting || !nickname.trim() || !content.trim()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "送信中..." : "コメントする"}
          </button>
        </div>
      </form>
    </div>
  );
}
