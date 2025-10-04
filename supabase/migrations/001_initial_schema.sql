-- ==========================================
-- BizLinkOne Initial Schema Migration
-- ==========================================

-- UUID拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Tables
-- ==========================================

-- User Profiles テーブル (auth.users の拡張)
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
-- Indexes
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
-- Functions
-- ==========================================

-- updated_at 自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- ==========================================
-- Triggers
-- ==========================================

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_knowledge_articles_updated_at ON public.knowledge_articles;
CREATE TRIGGER update_knowledge_articles_updated_at
  BEFORE UPDATE ON public.knowledge_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
