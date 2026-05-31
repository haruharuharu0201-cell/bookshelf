# BookShelf セットアップ手順

## 1. Supabaseプロジェクトを作成する

1. [supabase.com](https://supabase.com) にアクセスしてアカウントを作成
2. 「New Project」でプロジェクトを作成
3. **Project Settings > API** を開いて以下を確認：
   - `Project URL`（例: `https://xxxx.supabase.co`）
   - `anon` キー

## 2. データベースを初期化する

1. Supabaseダッシュボードの **SQL Editor** を開く
2. `supabase-schema.sql` の内容をコピーして実行

## 3. 環境変数を設定する

`.env.local` ファイルを編集して実際の値を入力：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. 開発サーバーを起動する

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## 5. Vercelにデプロイする（任意）

1. [vercel.com](https://vercel.com) でアカウント作成
2. このフォルダをGitHubにプッシュ
3. Vercelでリポジトリをインポート
4. 環境変数を設定（`.env.local` と同じ内容）
5. Deploy！

---

## ディレクトリ構成

```
bookshelf/
├── src/
│   ├── app/
│   │   ├── page.tsx              # ホーム（本棚グリッド）
│   │   ├── post/new/page.tsx     # 新規投稿
│   │   ├── post/[id]/page.tsx    # 投稿詳細
│   │   ├── user/[nickname]/page.tsx  # ユーザー本棚
│   │   └── api/                  # APIルート
│   ├── components/               # UIコンポーネント
│   └── lib/                      # Supabaseクライアント・型定義
├── supabase-schema.sql           # DBスキーマ
└── .env.local                    # 環境変数（要設定）
```
