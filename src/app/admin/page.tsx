"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bookshelf_admin_password");
    if (saved) setIsAdmin(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("パスワードが違います");
        return;
      }

      localStorage.setItem("bookshelf_admin_password", password);
      setIsAdmin(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bookshelf_admin_password");
    setIsAdmin(false);
    setPassword("");
  };

  if (isAdmin) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">管理者ログイン中</h1>
          <p className="text-sm text-gray-500 mb-6">
            すべての投稿の編集・削除が可能です
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl text-sm font-bold text-white mb-3 hover:opacity-90 transition"
            style={{ background: "#b45309" }}
          >
            本棚に戻る
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-xl font-bold text-gray-900">管理者ログイン</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理者パスワード"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
          {error && (
            <p className="text-sm text-red-600 font-medium">⚠ {error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition"
            style={{ background: "#b45309" }}
          >
            {loading ? "確認中…" : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
