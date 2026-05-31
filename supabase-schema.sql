-- BookShelf データベーススキーマ
-- Supabaseのダッシュボード > SQL Editor で実行してください

-- 投稿テーブル
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL,
  amazon_url TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  cover_image_url TEXT,
  review TEXT NOT NULL,
  learnings TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- いいねテーブル（同一ニックネームは1投稿につき1回のみ）
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, nickname)
);

-- コメントテーブル
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS（Row Level Security）を有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 全員が読み書きできるポリシー（社内ポータルのため認証なし）
CREATE POLICY "全員が投稿を閲覧できる" ON posts FOR SELECT USING (true);
CREATE POLICY "全員が投稿できる" ON posts FOR INSERT WITH CHECK (true);

CREATE POLICY "全員がいいねを閲覧できる" ON likes FOR SELECT USING (true);
CREATE POLICY "全員がいいねできる" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "いいねを取り消せる" ON likes FOR DELETE USING (true);

CREATE POLICY "全員がコメントを閲覧できる" ON comments FOR SELECT USING (true);
CREATE POLICY "全員がコメントできる" ON comments FOR INSERT WITH CHECK (true);

-- パフォーマンス向上のためのインデックス
CREATE INDEX posts_created_at_idx ON posts (created_at DESC);
CREATE INDEX posts_nickname_idx ON posts (nickname);
CREATE INDEX likes_post_id_idx ON likes (post_id);
CREATE INDEX comments_post_id_idx ON comments (post_id);
