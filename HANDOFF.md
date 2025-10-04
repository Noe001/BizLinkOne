# BizLinkOne - 継続実装ガイド

**最終更新**: 2025年10月4日  
**現在の進捗**: Phase 2-1 (70%完了)

---

## 🚀 開始手順（必須）

### 1. 状況把握（5分）
以下のファイルを読んでください：
```bash
# 最重要（必読）
IMPLEMENTATION_STATUS.md  # 実装進捗・完了機能
DEVELOPMENT_GUIDELINES.md # 開発ルール・コーディング規約

# 参考
.github/copilot-instructions.md  # アーキテクチャ概要
PHASE_2-1_PLAN.md               # 現在進行中のフェーズ詳細
```

### 2. 環境確認
```bash
npm install
npm run dev  # http://localhost:5000 で起動
```

### 3. デモログイン
- メール: `demo@example.com`
- パスワード: 任意（デモモードは検証なし）

---

## 📊 現在の状態

### ✅ 完了済み (30%)
- **Phase 1**: 認証・ワークスペース管理 (100%)
- **Phase 2-1**: リアルタイムチャット (70%)
  - ✅ Realtime購読・Presence
  - ✅ Optimistic UI（onMutate/onError）
  - ✅ ファイル添付UI（`FileUploadButton.tsx` 作成済み）
  - ✅ リアクションUI（`MessageReactions.tsx` 作成済み）

### 🔄 実装中（残り30% = ~2h）
- ⏳ 未読メッセージ管理（1.5h）
- ⏳ リアクション統合（1h）
- ⏳ ファイルアップロードAPI（1.5h）

### ⏰ 次の優先タスク
**Option A**: Phase 2-1完了 (~2h)  
**Option B**: Phase 2-2開始（Kanbanボード ~4h）

詳細は [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) 参照

---

## 🎯 実装ルール（厳守）

### 必ず守ること
1. **UI変更禁止** - 必要な場合を除き既存UIを維持
2. **非破壊的実装** - 既存機能を壊さずに追加
3. **TypeScript厳格** - `any`禁止、型推論活用
4. **i18n必須** - すべてのテキストを `client/src/locales/ja.ts` に追加
5. **段階的実装** - 各段階でブラウザテスト実行

詳細は [`DEVELOPMENT_GUIDELINES.md`](DEVELOPMENT_GUIDELINES.md) 参照

### データフロー
```
Schema定義 (shared/schema.ts)
  ↓
API実装 (server/routes.ts) ← Zodバリデーション
  ↓
データアクセス (server/storage.ts)
  ↓
TanStack Query (client) ← キャッシング
  ↓
Context (client/src/contexts) ← グローバル状態
```

---

## 🛠️ 技術スタック

### 現在使用中
- React 19 + TypeScript + Vite
- TanStack Query (状態管理)
- Supabase (Auth + Realtime + Storage)
- Drizzle ORM + PostgreSQL
- Tailwind CSS + shadcn/ui

### 今後導入予定
- `@dnd-kit` (Kanban - Phase 2-2)
- `@tiptap/react` (Richエディタ - Phase 2-3)
- `Vitest` (テスト - Phase 4-2)

---

## 📝 実装パターン

### 新しいAPIエンドポイント
```typescript
// server/routes.ts
app.post("/api/tasks", async (req, res) => {
  const result = insertTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: fromZodError(result.error).message 
    });
  }
  const task = await storage.createTask(result.data);
  res.json(task);
});
```

### TanStack Query（データ取得）
```typescript
const { data } = useQuery({
  queryKey: ["/api/workspaces", workspaceId, "tasks"],
  enabled: !!workspaceId,
});
```

### カスタムフック
```typescript
export function useMyFeature(param: string) {
  const [state, setState] = useState();
  useEffect(() => {
    // 初期化
    return () => { /* クリーンアップ */ };
  }, [param]);
  return { state };
}
```

---

## 🚨 よくある問題

| 問題 | 原因 | 解決方法 |
|------|------|----------|
| 型エラー (`never`) | Supabaseテーブル未作成 | fetch APIを使用（既存実装参照） |
| HMRが動作しない | キャッシュ | `Ctrl+C` → `npm run dev` |
| localStorage消失 | 認証失敗 | デモモード使用（`@example.com`） |
| Realtime接続失敗 | 環境変数未設定 | `.env` 確認またはデモモード |

---

## ✅ 完了チェックリスト

実装完了後に確認：
- [ ] `IMPLEMENTATION_STATUS.md` を更新
- [ ] `npm run typecheck` でエラー0件
- [ ] 既存機能が動作（ブラウザ確認）
- [ ] 新機能が動作（ブラウザ確認）
- [ ] 翻訳キーが `ja.ts` に存在
- [ ] コンソールエラーなし

---

## 💬 次のAIに渡すプロンプト

新しいAIセッションで使用してください：

```
BizLinkOneプロジェクトの実装を継続します。

1. まず HANDOFF.md を読んで現在の状況を把握してください
2. IMPLEMENTATION_STATUS.md で詳細な進捗を確認してください
3. DEVELOPMENT_GUIDELINES.md で開発ルールを確認してください

現在Phase 2-1が70%完了しています。
次に実装すべき内容を教えてください。
```

これだけで状況把握→実装開始が可能です。

---

**補足**: 詳細な実装手順・技術負債・テスト結果は [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) (1260行) を参照してください。このファイルは簡潔な引き継ぎ専用です。
