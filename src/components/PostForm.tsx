"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition";

export default function PostForm() {
  const router = useRouter();
  const [amazonUrl, setAmazonUrl] = useState("");
  const [bookInfo, setBookInfo] = useState<{
    title: string;
    author: string;
    coverImageUrl: string;
  } | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [nickname, setNickname] = useState("");
  const [review, setReview] = useState("");
  const [learnings, setLearnings] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bookshelf_nickname");
    if (saved) setNickname(saved);
  }, []);

  const handleFetchBook = async () => {
    if (!amazonUrl.trim()) return;
    setFetching(true);
    setFetchError("");
    setBookInfo(null);

    try {
      const res = await fetch("/api/fetch-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: amazonUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error || "取得に失敗しました");
        return;
      }
      setBookInfo(data);
    } catch {
      setFetchError("ネットワークエラーが発生しました");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookInfo || !nickname.trim() || !review.trim()) return;

    setSubmitting(true);
    localStorage.setItem("bookshelf_nickname", nickname.trim());

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          amazon_url: amazonUrl,
          title: bookInfo.title,
          author: bookInfo.author,
          cover_image_url: bookInfo.coverImageUrl,
          review: review.trim(),
          learnings: learnings.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "投稿に失敗しました");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      alert("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Step 1: Amazon URL */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          ① Amazon リンクを貼り付ける
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={amazonUrl}
            onChange={(e) => setAmazonUrl(e.target.value)}
            placeholder="https://www.amazon.co.jp/dp/..."
            className={`${inputClass} flex-1`}
            required
          />
          <button
            type="button"
            onClick={handleFetchBook}
            disabled={fetching || !amazonUrl.trim()}
            className="px-4 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
            style={{ background: "#b45309" }}
          >
            {fetching ? "取得中…" : "情報を取得"}
          </button>
        </div>
        {fetchError && (
          <p className="mt-2 text-sm text-red-600 font-medium">⚠ {fetchError}</p>
        )}
      </div>

      {/* 本のプレビュー */}
      {bookInfo && (
        <div className="flex gap-4 p-4 rounded-2xl border-2 border-amber-300" style={{ background: "#fef9ed" }}>
          {bookInfo.coverImageUrl && (
            <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden shadow-md">
              <Image
                src={bookInfo.coverImageUrl}
                alt={bookInfo.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="min-w-0 flex flex-col justify-center gap-1">
            <p className="font-bold text-gray-900 text-sm leading-snug">{bookInfo.title}</p>
            {bookInfo.author && (
              <p className="text-xs text-gray-600">{bookInfo.author}</p>
            )}
            <p className="text-xs font-bold mt-1" style={{ color: "#16a34a" }}>✓ 本の情報を取得しました</p>
          </div>
        </div>
      )}

      {/* Step 2: ニックネーム */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          ② ニックネーム
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="あなたの名前（例: 田中さん）"
          maxLength={30}
          className={inputClass}
          required
        />
      </div>

      {/* Step 3: 感想 */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          ③ 読んだ感想
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="この本を読んでどう感じましたか？おすすめポイントや気づきを自由に書いてください。"
          rows={4}
          className={`${inputClass} resize-y`}
          required
        />
      </div>

      {/* Step 4: 学んだこと（任意） */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          ④ 学んだこと・印象に残ったこと
          <span className="text-xs text-gray-400 font-normal ml-2">（任意）</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">箇条書きでも OK！</p>
        <textarea
          value={learnings}
          onChange={(e) => setLearnings(e.target.value)}
          placeholder="・〇〇という考え方が刺さった&#10;・△△の方法を早速試したい"
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !bookInfo || !nickname.trim() || !review.trim()}
        className="w-full py-3.5 rounded-xl text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        style={{ background: submitting ? "#9ca3af" : "#b45309" }}
      >
        {submitting ? "投稿中…" : "📚 本棚に投稿する"}
      </button>
    </form>
  );
}
