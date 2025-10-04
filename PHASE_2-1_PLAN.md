# Phase 2-1: リアルタイムチャット実装計画

## 目標
Supabase Realtime を使用してリアルタイムメッセージング機能を実装

## 実装ステップ

### Step 1: Supabase Realtime セットアップ ✅ 完了
- [x] `shared/schema.ts` に `chatMessages` テーブル定義済み
- [x] `workspaceId` で適切にスコープ分離
- [x] Realtime チャンネル購読の設定
- [x] Realtime 設定追加（`eventsPerSecond: 10`）
- [ ] Row Level Security (RLS) ポリシー設定（Supabase ダッシュボードで実施）

### Step 2: チャンネル管理テーブル追加 ✅ 完了
データベーステーブル定義完了:
```typescript
✅ chatChannels - チャンネル管理（public/private/dm）
✅ chatChannelMembers - チャンネルメンバーシップ（admin/member ロール）
✅ chatMessages - メッセージ拡張（parentMessageId, editedAt, deletedAt）
✅ chatAttachments - ファイル添付
✅ chatReactions - メッセージリアクション
✅ chatReadReceipts - 既読管理
```

### Step 3: Realtime 購読実装 (クライアント) ✅ 完了
`client/src/hooks/useRealtimeMessages.ts` 作成完了:
- [x] INSERT イベント購読
- [x] UPDATE イベント購読（編集機能用）
- [x] DELETE イベント購読（削除機能用）
- [x] ワークスペース + チャンネルでフィルタリング
- [x] Query キャッシュ自動無効化
- [x] 接続状態管理（isConnected）
- [x] エラーハンドリング
- [x] クリーンアップ処理

### Step 4: オンラインプレゼンス実装 ✅ 完了
`client/src/hooks/useOnlinePresence.ts` 作成完了:
- [x] Presence チャンネル作成
- [x] ユーザー情報トラッキング（user_id, user_name, online_at）
- [x] Join/Leave イベント検知
- [x] Presence sync による状態同期
- [x] オンラインユーザー配列返却
- [x] クリーンアップ処理

### Step 5: Chat ページ統合 ✅ 完了
`client/src/pages/Chat.tsx` 更新完了:
- [x] useRealtimeMessages フック統合
- [x] useOnlinePresence フック統合
- [x] Realtime 接続状態 UI 表示（Wifi/WifiOff アイコン）
- [x] オンラインユーザー数表示（"X online"）
- [x] `timestamp` → `createdAt` 対応
- [x] Realtime エラーハンドリング（Toast 通知）
- [x] Graceful degradation（Supabase 未設定時）

### Step 6: メッセージ送信最適化 ✅ 完了
- [x] Optimistic UI 更新 (送信前に UI に表示)
- [x] 送信失敗時のロールバック処理
- [x] 送信中インジケーター（アニメーション付き）
- [x] TanStack Query の `onMutate` 活用

### Step 7: ファイル添付機能 ⏳ 部分実装
スキーマ定義完了、UI実装完了、Supabase統合は保留:
- [x] `chatAttachments` テーブル作成
- [x] FileUploadButton コンポーネント作成
- [x] ChatInput にファイル選択機能統合
- [x] ファイルプレビュー機能（画像）
- [x] ファイルサイズ制限（10MB）
- [ ] Supabase Storage バケット作成（`chat-attachments`）
- [ ] RLS ポリシー設定
- [ ] 実際のファイルアップロード処理

### Step 8: リアクション/絵文字機能 ⏳ 部分実装
スキーマ定義完了、基本コンポーネント作成完了:
- [x] `chatReactions` テーブル作成
- [x] `MessageReactions.tsx` コンポーネント作成
- [x] 10種類のクイックリアクション
- [x] Popover で絵文字ピッカー
- [ ] ChatMessage コンポーネントに統合
- [ ] リアクション API 実装
- [ ] Realtime リアクション更新

### Step 9: 未読メッセージ管理 ⏳ 未実装
スキーマ定義完了、実装は未着手:
- [x] `chatReadReceipts` テーブル作成
- [ ] チャンネルごとの最終読み取り位置保存
- [ ] 未読カウント表示
- [ ] 「新着メッセージ」セパレーター
- [ ] スクロール位置復元

## 成功基準

### 必須 (Must Have)
- [x] チャンネル定義（6テーブル作成完了）
- [x] リアルタイムメッセージ受信（1秒以内）
- [x] ワークスペーススコープ分離
- [x] オンラインステータス表示
- [ ] Optimistic UI 更新

### 重要 (Should Have)
- [ ] ファイル添付 (画像/ドキュメント)
- [ ] メッセージリアクション
- [ ] 未読管理
- [ ] チャンネルリスト動的取得

### あれば良い (Nice to Have)
- [ ] タイピングインジケーター
- [ ] メッセージ編集/削除
- [ ] メンション機能 (@user)
- [ ] スレッド返信
- [ ] 検索機能

## 技術スタック

- **Realtime**: Supabase Realtime (PostgreSQL LISTEN/NOTIFY) ✅
- **Storage**: Supabase Storage (ファイル添付用) ⏳
- **State**: React Query + Realtime 購読 ✅
- **Optimistic Updates**: TanStack Query の `optimisticData` ⏳

## 推定工数

| タスク | 工数 | ステータス |
|--------|------|----------|
| チャンネル管理テーブル | 1h | ✅ 完了 |
| Realtime 購読実装 | 2h | ✅ 完了 |
| オンラインプレゼンス | 1h | ✅ 完了 |
| Chat ページ統合 | 1h | ✅ 完了 |
| Optimistic UI | 1h | ⏳ 次 |
| ファイル添付 | 2h | ⏳ |
| リアクション機能 | 1.5h | ⏳ |
| 未読管理 | 1.5h | ⏳ |

**完了**: 5時間 / 10時間 (50%)

## 完了したファイル

### 新規作成 (3ファイル)
- ✅ `client/src/hooks/useRealtimeMessages.ts` (155行)
- ✅ `client/src/hooks/useOnlinePresence.ts` (115行)
- ✅ `PHASE_2-1_PLAN.md` (このファイル)

### 変更 (4ファイル)
- ✅ `shared/schema.ts` - 6テーブル追加、Zod スキーマ拡張
- ✅ `client/src/lib/supabase.ts` - Realtime 設定追加
- ✅ `client/src/pages/Chat.tsx` - Realtime 統合、UI 更新
- ✅ `server/storage.ts` - スキーマ変更対応、シードデータ修正
- ✅ `server/routes.ts` - `timestamp` → `createdAt` 対応

## 次のアクション

1. ✅ チャンネル管理テーブル追加 (完了)
2. ✅ Realtime hooks 実装 (完了)
3. ✅ UI 統合 (完了)
4. ✅ スキーマ変更対応 (完了)
5. 🔄 Optimistic UI 実装 (次)
6. ⏳ ファイル添付機能
7. ⏳ リアクション機能
8. ⏳ 未読管理

**現在の完了率: 50%**
