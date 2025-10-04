# BizLinkOne - Supabase 開発ガイド

このドキュメントは、BizLinkOneプロジェクトでSupabaseを使用した開発を行うための完全なガイドです。

> **📚 ドキュメント一覧**:
> - **[HANDOFF.md](HANDOFF.md)** - 継続実装用の簡潔ガイド（AIセッション引き継ぎに最適）
> - **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - 詳細な実装進捗・完了機能
> - **[DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)** - 開発ルール・コーディング規約
> - **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - アーキテクチャ概要

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [セットアップ](#セットアップ)
3. [開発ワークフロー](#開発ワークフロー)
4. [テスト](#テスト)
5. [トラブルシューティング](#トラブルシューティング)

---

## プロジェクト概要

### 技術スタック

- **フロントエンド**: Vite + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **バックエンド**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **状態管理**: TanStack Query (React Query)
- **認証**: Supabase Auth (JWT + Row Level Security)

### データベース構造

プロジェクトには以下のテーブルがあります:

- `user_profiles` - ユーザープロフィール情報
- `tasks` - タスク管理
- `knowledge_articles` - ナレッジベース記事
- `meetings` - ミーティング情報
- `chat_messages` - チャットメッセージ

すべてのテーブルでRow Level Security (RLS) が有効化されています。

---

## セットアップ

### 1. 環境変数の設定

`.env` ファイルをプロジェクトルートに作成し、以下を設定:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qarkqclxrdurzchywqkk.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# サーバーサイド専用
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application
PORT=5000
NODE_ENV=development
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:5000 で起動します。

---

## 開発ワークフロー

### Supabase CLI の使用

#### アクセストークンの設定（初回のみ）

1. https://supabase.com/dashboard/account/tokens にアクセス
2. 新しいトークンを生成
3. `.env` に追加:

```env
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### プロジェクトのリンク（初回のみ）

```bash
npm run db:link
```

#### 新しいマイグレーションの作成

```bash
npm run db:new your_migration_name
```

これにより `supabase/migrations/` 配下に新しいSQLファイルが作成されます。

#### マイグレーションの適用（クラウドに反映）

```bash
npm run db:migrate
```

#### マイグレーション状態の確認

```bash
npm run db:status
```

### コード開発のパターン

#### タスクの作成例

```typescript
import { TaskService } from '@/lib/supabaseService';

// タスクを作成
const newTask = await TaskService.create({
  title: 'New Task',
  description: 'Task description',
  status: 'todo',
  priority: 'high',
  created_by: user.id,
});
```

#### データの取得（TanStack Query）

```typescript
import { useQuery } from '@tanstack/react-query';
import { TaskService } from '@/lib/supabaseService';

const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => TaskService.getAll(),
});
```

---

## テスト

### 認証フローのテスト

#### 1. サインアップ

1. http://localhost:5000 を開く
2. 「Sign up」をクリック
3. ユーザー情報を入力
4. アカウントを作成

#### 2. メール確認（開発環境）

Supabase Dashboard で手動確認:
1. https://supabase.com/dashboard/project/qarkqclxrdurzchywqkk/auth/users
2. ユーザーをクリック → 「Confirm email」

#### 3. ログイン

作成したアカウントでログイン

### タスク機能のテスト

1. サイドバーの「Tasks」をクリック
2. 「+ New Task」でタスクを作成
3. タスクの編集・削除をテスト
4. Supabase Dashboard でデータを確認

### データ永続性のテスト

1. タスクを作成
2. ブラウザをリロード
3. データが保持されていることを確認

---

## トラブルシューティング

### 環境変数が読み込まれない

**症状**: コンソールに「Supabase環境変数が設定されていません」と表示される

**解決方法**:
1. `.env` ファイルがプロジェクトルートにあることを確認
2. 開発サーバーを再起動: `Ctrl+C` → `npm run dev`
3. Viteは開発サーバー起動時に環境変数を読み込みます

### 認証エラー

**症状**: ログインできない、セッションが維持されない

**解決方法**:
1. ブラウザの開発者ツール → Application → Local Storage をクリア
2. Supabase Dashboard でユーザーのメール確認状態をチェック
3. `.env` の `VITE_SUPABASE_ANON_KEY` が正しいか確認

### データが表示されない

**症状**: ログイン後にタスクやナレッジが空

**解決方法**:
1. ブラウザのコンソールでエラーを確認
2. Supabase Dashboard → Table Editor でデータを確認
3. RLSポリシーが正しく設定されているか確認

### マイグレーションエラー

**症状**: `npm run db:migrate` でエラーが発生

**解決方法**:
1. `SUPABASE_ACCESS_TOKEN` が設定されているか確認
2. プロジェクトがリンクされているか確認: `npm run db:link`
3. SQLの構文エラーをチェック

---

## 便利なコマンド一覧

```bash
# 開発
npm run dev                 # 開発サーバー起動
npm run build              # 本番ビルド
npm run check              # TypeScript型チェック

# Supabase
npm run db:link            # プロジェクトをリンク
npm run db:new <name>      # 新しいマイグレーション作成
npm run db:migrate         # マイグレーションを適用
npm run db:status          # マイグレーション状態確認
npm run db:pull            # リモートの変更を取得
npm run db:diff            # スキーマの差分確認
```

---

## 参考リンク

- [Supabase Dashboard](https://supabase.com/dashboard/project/qarkqclxrdurzchywqkk)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

---

## プロジェクト構造

```
BizLinkOne/
├── client/              # フロントエンドコード
│   └── src/
│       ├── components/  # UIコンポーネント
│       ├── contexts/    # React Context (Auth, WorkspaceData)
│       ├── lib/         # ユーティリティ (supabase, queryClient)
│       ├── pages/       # ページコンポーネント
│       └── types/       # TypeScript型定義
├── server/              # バックエンドコード（開発サーバー用）
├── shared/              # 共有型定義
├── supabase/            # Supabase設定
│   └── migrations/      # データベースマイグレーション
├── .env                 # 環境変数（Gitにコミットしない）
└── vite.config.ts       # Vite設定
```

---

**最終更新**: 2025年10月4日
