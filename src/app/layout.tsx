import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "みんなの本棚",
  description: "読んだ本のナレッジをみんなでシェアしよう",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJP.className}>
      <body className="min-h-screen" style={{ background: "#f8f5f0" }}>
        <header className="sticky top-0 z-20 shadow-sm" style={{ background: "#3d2b1f" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl">📚</span>
              <div>
                <span className="block text-lg font-bold text-amber-100 leading-tight group-hover:text-white transition-colors">
                  みんなの本棚
                </span>
                <span className="block text-xs text-amber-300/70 leading-tight">
                  読んだ本をみんなでシェア
                </span>
              </div>
            </Link>
            <Link
              href="/post/new"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
              style={{ background: "#e8a030", color: "#1a1a1a" }}
            >
              <span className="text-base">＋</span>
              <span>本を投稿する</span>
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
