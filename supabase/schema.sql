-- ==========================================
-- BizLinkOne Supabase Database Schema
-- ==========================================
-- このSQLスクリプトをSupabaseダッシュボードのSQL Editorで実行してください
-- https://app.supabase.com/project/_/sql

-- ==========================================
-- 1. Extensions
-- ==========================================
-- UUID生成用の拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. Tables
-- ==========================================

-- Users テーブル (Supabase Authと連携)
-- 注意: このテーブルは通常不要です。Supabase Authの auth.users テーブルを使用します。
-- カスタムプロフィール情報が必要な場合のみ作成してください。
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks テーブル
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assignee_name TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Articles テーブル
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  author_name TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings テーブル
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  participants JSONB DEFAULT '[]',
  meeting_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Chat Messages テーブル
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  channel_id TEXT,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('channel', 'dm')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. Indexes (パフォーマンス最適化)
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_knowledge_author ON public.knowledge_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_created_at ON public.knowledge_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_tags ON public.knowledge_articles USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);

CREATE INDEX IF NOT EXISTS idx_chat_channel ON public.chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_timestamp ON public.chat_messages(timestamp DESC);

-- ==========================================
-- 4. Row Level Security (RLS) ポリシー
-- ==========================================

-- RLSを有効化
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- User Profiles のポリシー
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Tasks のポリシー
CREATE POLICY "Authenticated users can view all tasks"
  ON public.tasks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update any task"
  ON public.tasks FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete any task"
  ON public.tasks FOR DELETE
  USING (auth.role() = 'authenticated');

-- Knowledge Articles のポリシー
CREATE POLICY "Anyone can view knowledge articles"
  ON public.knowledge_articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create articles"
  ON public.knowledge_articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their articles"
  ON public.knowledge_articles FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their articles"
  ON public.knowledge_articles FOR DELETE
  USING (auth.uid() = author_id);

-- Meetings のポリシー
CREATE POLICY "Authenticated users can view all meetings"
  ON public.meetings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create meetings"
  ON public.meetings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update meetings"
  ON public.meetings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete meetings"
  ON public.meetings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Chat Messages のポリシー
CREATE POLICY "Authenticated users can view all messages"
  ON public.chat_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- ==========================================
-- 5. Functions (便利な関数)
-- ==========================================

-- ナレッジ記事の閲覧数を増やす関数
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.knowledge_articles
  SET views = views + 1
  WHERE id = article_id;
END;
$$;

-- updated_at を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_articles_updated_at
  BEFORE UPDATE ON public.knowledge_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 6. サンプルデータ (開発用 - オプション)
-- ==========================================

-- 注意: 本番環境では不要です。開発・テスト環境でのみ実行してください。
-- サンプルデータは実際のauth.usersが存在する場合のみ動作します。

-- サンプルタスク
-- INSERT INTO public.tasks (title, description, status, priority, assignee_name)
-- VALUES 
--   ('プロジェクト計画書の作成', 'Q2プロジェクトの詳細計画を作成する', 'in-progress', 'high', 'テストユーザー'),
--   ('デザインレビュー', 'UIデザインのレビューと承認', 'todo', 'medium', 'デザイナー');

-- サンプルナレッジ記事
-- INSERT INTO public.knowledge_articles (title, content, excerpt, tags, author_name)
-- VALUES 
--   ('Supabaseの基本', 'Supabaseは...', 'Supabaseの基本的な使い方', ARRAY['database', 'supabase'], 'Admin');

-- ==========================================
-- 完了
-- ==========================================
-- スキーマの作成が完了しました。
-- 次のステップ:
-- 1. Supabase AuthでEmailプロバイダーを有効化
-- 2. フロントエンドの.envファイルに接続情報を設定
-- 3. アプリケーションを起動してテスト
