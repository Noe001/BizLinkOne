# BizLinkOne - Copilot Instructions (concise)

These instructions summarize the essential, discoverable patterns for an AI coding agent to be immediately productive in this repo.

- Architecture: full-stack monorepo. Frontend lives in `client/` (Vite + React + TypeScript + Tailwind + shadcn/ui). Backend is `server/` (Express). Shared DB/schema types are in `shared/schema.ts` (Drizzle + Zod).

- Entry commands (from `package.json`):
  - `npm run dev` — starts dev server (tsx runs `server/index.ts` which serves API and Vite client on port 5000).
  - `npm run build` — builds frontend (Vite) and bundles server (esbuild).
  - `npm run db:push` — push Drizzle schema changes (requires DATABASE_URL).

- Critical conventions to follow:
  - Use path aliases: `@/` → `client/src`, `@shared/` → `shared/` (see `vite.config.ts` / `tsconfig.json`).
  - All user-facing strings must use i18n via `t()` (see `client/src/locales/ja.ts`). Don't hardcode English.
  - Data models are schema-driven in `shared/schema.ts`. Routes validate with Zod (`insert*Schema.safeParse`) and return user-friendly zod errors (`fromZodError`).

- Data & state patterns:
  - Frontend queries use TanStack Query with `getQueryFn` and query keys are used as URL path segments (see `client/src/lib/queryClient.ts`). Example: queryKey ["/api", "tasks"] → GET /api/tasks.
  - Cross-feature state in the client is provided by `WorkspaceDataContext` (createTask/createKnowledge etc.). When adding features, extend this context instead of isolated local state.
  - Backend storage is abstracted by `IStorage` in `server/storage.ts`. Currently `MemStorage` is used (seeded data). Follow its CRUD signatures when wiring new APIs.

- API wiring & examples:
  - Server routes in `server/routes.ts` call `storage.*` methods and validate inputs with the Zod insert schemas exported from `@shared/schema` (e.g., `insertTaskSchema`).
  - When creating a task from a chat message, Chat page passes origin metadata: { source: 'chat', referenceId, referenceLabel } and messageContext (see `client/src/pages/Chat.tsx`).

- Developer pitfalls & quick checks:
  - Windows: server listen options handle differences (no reusePort) — prefer local dev with provided npm scripts.
  - When you change shared schema, update `shared/schema.ts` then run `npm run db:push` if using a real DB.
  - QueryClient default options disable retries and set staleTime: Infinity — remember to invalidate queries manually after mutations (use `queryClient.invalidateQueries({ queryKey: ["chatMessages"] })`).

- Where to look for examples:
  - Chat → task/knowledge conversions: `client/src/pages/Chat.tsx` and `client/src/components/NewTaskModal.tsx` / `CreateKnowledgeModal.tsx`.
  - Schema-driven examples: `shared/schema.ts` and `server/routes.ts` (safeParse + fromZodError).
  - Workspace seed & in-memory behavior: `server/storage.ts` (MemStorage) and `client/src/contexts/WorkspaceDataContext.tsx`.

If any part of these instructions is unclear or you want more examples (routes, query key patterns, or modal wiring), tell me which section to expand and I'll update the file.
export type Task = typeof tasks.$inferSelect;
