#!/usr/bin/env tsx
/**
 * Supabase データベースリセットスクリプト
 * 
 * ⚠️ 警告: このスクリプトは全てのテーブルとデータを削除します！
 * 開発環境でのみ使用してください。
 * 
 * 使用方法:
 *   npm run supabase:reset
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// .envファイルを読み込み
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetDatabase() {
  console.log('⚠️  警告: データベースをリセットします');
  console.log('⚠️  すべてのテーブルとデータが削除されます！\n');

  // 確認（本番環境では実行しない）
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ 本番環境ではリセットできません');
    process.exit(1);
  }

  try {
    console.log('🗑️  テーブルを削除中...\n');

    const dropSql = `
      DROP TABLE IF EXISTS public.chat_messages CASCADE;
      DROP TABLE IF EXISTS public.meetings CASCADE;
      DROP TABLE IF EXISTS public.knowledge_articles CASCADE;
      DROP TABLE IF EXISTS public.tasks CASCADE;
      DROP TABLE IF EXISTS public.user_profiles CASCADE;
      DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
      DROP FUNCTION IF EXISTS increment_article_views CASCADE;
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: dropSql });

    if (error) {
      console.error('❌ リセットエラー:', error);
      process.exit(1);
    }

    console.log('✅ データベースをリセットしました\n');
    console.log('次のコマンドを実行してください:');
    console.log('  npm run supabase:setup\n');

  } catch (error: any) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

resetDatabase().catch(console.error);
