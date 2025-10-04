import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Supabase接続情報の取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 環境変数のチェック（開発環境では警告のみ）
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 
    'Supabase環境変数が設定されていません。\n' +
    '.envファイルに以下の変数を設定してください:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY\n\n' +
    '詳細は.env.exampleを参照してください。';
  
  if (import.meta.env.PROD) {
    throw new Error(errorMessage);
  } else {
    console.warn('⚠️', errorMessage);
    console.warn('開発モードではモックデータを使用します。');
  }
}

// Supabaseクライアントの作成（環境変数がない場合はダミー値を使用）
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
