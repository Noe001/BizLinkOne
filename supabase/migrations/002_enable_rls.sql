-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

-- RLS を有効化
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- User Profiles Policies
-- ==========================================

DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- Tasks Policies
-- ==========================================

DROP POLICY IF EXISTS "Authenticated users can view all tasks" ON public.tasks;
CREATE POLICY "Authenticated users can view all tasks"
  ON public.tasks FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can create tasks" ON public.tasks;
CREATE POLICY "Authenticated users can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update tasks" ON public.tasks;
CREATE POLICY "Authenticated users can update tasks"
  ON public.tasks FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete tasks" ON public.tasks;
CREATE POLICY "Authenticated users can delete tasks"
  ON public.tasks FOR DELETE
  USING (auth.role() = 'authenticated');

-- ==========================================
-- Knowledge Articles Policies
-- ==========================================

DROP POLICY IF EXISTS "Anyone can view knowledge articles" ON public.knowledge_articles;
CREATE POLICY "Anyone can view knowledge articles"
  ON public.knowledge_articles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.knowledge_articles;
CREATE POLICY "Authenticated users can create articles"
  ON public.knowledge_articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authors can update their articles" ON public.knowledge_articles;
CREATE POLICY "Authors can update their articles"
  ON public.knowledge_articles FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete their articles" ON public.knowledge_articles;
CREATE POLICY "Authors can delete their articles"
  ON public.knowledge_articles FOR DELETE
  USING (auth.uid() = author_id);

-- ==========================================
-- Meetings Policies
-- ==========================================

DROP POLICY IF EXISTS "Authenticated users can view all meetings" ON public.meetings;
CREATE POLICY "Authenticated users can view all meetings"
  ON public.meetings FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can create meetings" ON public.meetings;
CREATE POLICY "Authenticated users can create meetings"
  ON public.meetings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update meetings" ON public.meetings;
CREATE POLICY "Authenticated users can update meetings"
  ON public.meetings FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete meetings" ON public.meetings;
CREATE POLICY "Authenticated users can delete meetings"
  ON public.meetings FOR DELETE
  USING (auth.role() = 'authenticated');

-- ==========================================
-- Chat Messages Policies
-- ==========================================

DROP POLICY IF EXISTS "Authenticated users can view all messages" ON public.chat_messages;
CREATE POLICY "Authenticated users can view all messages"
  ON public.chat_messages FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.chat_messages;
CREATE POLICY "Authenticated users can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
