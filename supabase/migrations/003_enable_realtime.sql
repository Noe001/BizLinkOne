-- ==========================================
-- Realtime Configuration
-- ==========================================

-- Chat Messages テーブルのRealtimeを有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Tasks テーブルのRealtimeを有効化（オプション）
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- Meetings テーブルのRealtimeを有効化（オプション）
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
