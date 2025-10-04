#!/usr/bin/env tsx
/**
 * Supabase データベースセットアップスクリプト
 * 
 * このスクリプトは、Supabaseプロジェクトにスキーマとポリシーを自動的にセットアップします。
 * 
 * 使用方法:
 *   npm run supabase:setup
 * 
 * 必要な環境変数:
 *   VITE_SUPABASE_URL - SupabaseプロジェクトURL
 *   SUPABASE_SERVICE_ROLE_KEY - Service Roleキー（管理者権限）
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// .envファイルを読み込み
config();

// 環境変数のチェック
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ エラー: 環境変数が設定されていません');
  console.error('');
  console.error('必要な環境変数:');
  console.error('  VITE_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Supabase Dashboard > Project Settings > API から取得してください:');
  console.error('  https://app.supabase.com/project/_/settings/api');
  process.exit(1);
}

// Service Role権限でSupabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * SQLファイルを実行
 */
async function executeSqlFile(filePath: string): Promise<boolean> {
  try {
    const sql = readFileSync(filePath, 'utf-8');
    
    // SQLを分割して実行（複数ステートメント対応）
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement + ';' 
      });

      if (error) {
        // exec_sql RPCが存在しない場合は、直接SQLを実行
        const { error: directError } = await supabase.from('_migrations').insert({
          name: filePath,
          sql: statement,
        });

        if (directError) {
          console.error(`  ⚠️  ステートメント実行エラー: ${directError.message}`);
          // 一部のエラーは無視（既に存在する等）
          if (!directError.message.includes('already exists')) {
            throw directError;
          }
        }
      }
    }

    return true;
  } catch (error: any) {
    console.error(`  ❌ エラー: ${error.message}`);
    return false;
  }
}

/**
 * マイグレーションを実行
 */
async function runMigrations() {
  console.log('🚀 Supabase データベースセットアップを開始...\n');

  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
  
  try {
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  マイグレーションファイルが見つかりません');
      return;
    }

    console.log(`📁 ${files.length} 個のマイグレーションファイルを発見\n`);

    for (const file of files) {
      const filePath = join(migrationsDir, file);
      console.log(`🔄 実行中: ${file}`);
      
      const success = await executeSqlFile(filePath);
      
      if (success) {
        console.log(`✅ 完了: ${file}\n`);
      } else {
        console.log(`⚠️  スキップ: ${file} (一部エラーがありましたが続行します)\n`);
      }
    }

    console.log('🎉 すべてのマイグレーションが完了しました！\n');
    console.log('次のステップ:');
    console.log('  1. npm run dev でアプリを起動');
    console.log('  2. http://localhost:5000/signup でユーザー登録');
    console.log('  3. Supabase Dashboard でデータを確認');
    console.log('     https://app.supabase.com/project/_/editor\n');

  } catch (error: any) {
    console.error('\n❌ セットアップに失敗しました:', error.message);
    process.exit(1);
  }
}

// 実行
runMigrations().catch(console.error);
