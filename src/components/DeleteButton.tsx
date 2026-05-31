"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  postNickname: string;
};

export default function DeleteButton({ postId, postNickname }: Props) {
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const nickname = localStorage.getItem("bookshelf_nickname");
    const adminPassword = localStorage.getItem("bookshelf_admin_password");
    setCanDelete(nickname === postNickname || !!adminPassword);
  }, [postNickname]);

  if (!canDelete) return null;

  const handleDelete = async () => {
    setDeleting(true);
    const nickname = localStorage.getItem("bookshelf_nickname") || postNickname;
    const adminPassword = localStorage.getItem("bookshelf_admin_password") || undefined;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, adminPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "削除に失敗しました");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      alert("ネットワークエラーが発生しました");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">本当に削除しますか？</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? "削除中…" : "削除する"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
        >
          キャンセル
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
    >
      投稿を削除
    </button>
  );
}
