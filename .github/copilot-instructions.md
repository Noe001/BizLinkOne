# BizLinkOne - Copilot Instructions (concise)

These notes give an AI coding agent the essential, discoverable knowledge to be productive in this repo. Keep edits small and follow existing patterns.

- Architecture overview
  - Monorepo with three layers:
    - client/: Vite + React + TypeScript + Tailwind + shadcn/ui (UI, pages, components, locales).
    - server/: Node entry at `server/index.ts` (serves API routes and the Vite client in dev).
    - shared/: `shared/schema.ts` contains Drizzle schema and Zod types used by both sides.

- Key commands (repo root)
  - npm run dev — start dev server (server + Vite client).
  - npm run build — build frontend and bundle server.
  - npm run db:push — push Drizzle schema changes (requires DATABASE_URL).

- Project-specific conventions
  - Path aliases: `@/` → `client/src`, `@shared/` → `shared/` (see `vite.config.ts` / `tsconfig.json`).
  - i18n: all user-facing strings use `t()` and live in `client/src/locales/` (esp. `ja.ts`). Do not hardcode English.
  - Schema-first: canonical data shapes live in `shared/schema.ts`. Use Zod schemas for server validation and to derive types for the client.

- Data & integration patterns
  - TanStack Query: `client/src/lib/queryClient.ts` defines `getQueryFn` that maps query keys to REST paths — queryKey segments become path segments (example: ["/api","tasks"] → GET /api/tasks).
  - WorkspaceDataContext: cross-feature mutations and helpers live in `client/src/contexts/WorkspaceDataContext.tsx`. Extend this context when an operation affects multiple UI areas.
  - Storage abstraction: server storage follows an `IStorage` interface in `server/storage.ts`. `MemStorage` is the in-memory dev implementation — copy its method signatures when adding routes.

- Validation & error handling
  - Server routes import Zod schemas from `@shared/schema` and validate with `safeParse`. Convert validation errors using `fromZodError` before returning to clients (see `server/routes.ts`).

- Common flows / examples (copy these)
  - Query mapping: `client/src/lib/queryClient.ts` — queryKey ["/api","tasks"] → GET /api/tasks.
  - Chat → create task/knowledge: `client/src/pages/Chat.tsx` passes origin metadata `{ source: 'chat', referenceId, referenceLabel }` and `messageContext` when creating records. See `CreateTaskModal.tsx` / `CreateKnowledgeModal.tsx` for modal wiring.

- Quick developer checks
  - Windows: server listen includes platform-specific handling; use `npm run dev` for local development.
  - If you change `shared/schema.ts`, update types first. If a real DB is used, run `npm run db:push`.
  - QueryClient defaults: retries disabled and staleTime = Infinity — explicitly invalidate queries after mutations (example: `queryClient.invalidateQueries({ queryKey: ["chatMessages"] })`).

- Files to inspect when changing behavior
  - Query wiring: `client/src/lib/queryClient.ts`
  - Cross-feature operations: `client/src/contexts/WorkspaceDataContext.tsx`
  - Routes & validation: `server/routes.ts`, `shared/schema.ts`
  - Storage & seeds: `server/storage.ts`
  - i18n usage: `client/src/locales/ja.ts`

If you'd like, I can append short code snippets showing the minimal patterns (a sample route using a Zod schema, a queryClient example, and a WorkspaceDataContext mutation). Tell me which snippet to add.
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
