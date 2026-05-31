"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  postNickname: string;
};

export default function EditButton({ postId, postNickname }: Props) {
  const router = useRouter();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const nickname = localStorage.getItem("bookshelf_nickname");
    const adminPassword = localStorage.getItem("bookshelf_admin_password");
    setCanEdit(nickname === postNickname || !!adminPassword);
  }, [postNickname]);

  if (!canEdit) return null;

  return (
    <button
      onClick={() => router.push(`/post/${postId}/edit`)}
      className="px-3 py-1.5 border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors"
    >
      編集する
    </button>
  );
}
