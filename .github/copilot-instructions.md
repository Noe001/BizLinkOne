# BizLinkOne AI Agent Instructions

## Project Overview
BizLinkOne is a **chat-centric, all-in-one SaaS platform** for business collaboration, integrating task management, knowledge bases, meetings, and real-time chat into a unified workflow. Built with React + TypeScript (frontend) and Express + Drizzle ORM (backend), deployed on Replit with Neon PostgreSQL.

**Core Philosophy**: Chat acts as the central hub - messages can be converted to tasks or knowledge articles with one click, creating seamless cross-feature linkage.

## Architecture Patterns

### Full-Stack Monorepo Structure
```
client/src/     - React frontend (Vite, Tailwind, shadcn/ui)
server/         - Express backend with in-memory storage (MemStorage)
shared/         - Shared schema definitions (Drizzle + Zod)
```

**Critical**: Use `@/` for client imports, `@shared/` for shared schema, and `@assets/` for static assets (configured in `vite.config.ts`).

### Data Flow & State Management
- **Server State**: TanStack Query handles all API data fetching via `client/src/lib/queryClient.ts`
  - Custom `getQueryFn` uses query keys as URL paths (e.g., `queryKey: ["/api", "tasks"]` → `GET /api/tasks`)
  - `apiRequest()` helper for mutations with automatic error handling
- **Client State**: React Context for auth (`AuthContext`), i18n (`LanguageContext`), and workspace data (`WorkspaceDataContext`)
- **Database**: `server/storage.ts` provides `IStorage` interface - currently `MemStorage` (in-memory), designed for easy swap to Drizzle-based DB

### Schema-Driven Development
All data models live in `shared/schema.ts`:
1. Define Drizzle table schema (e.g., `tasks`, `chatMessages`)
2. Generate Zod insert schemas with `createInsertSchema()`
3. Export TypeScript types with `$inferSelect` and `z.infer<>`
4. Backend validates with `.safeParse()` + `fromZodError()` in routes

**Example**:
```typescript
export const tasks = pgTable("tasks", { /* columns */ });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export type Task = typeof tasks.$inferSelect;
```

## Design System (Cohere-Inspired)

### UI Component Library
- **Base**: shadcn/ui components in `client/src/components/ui/` (New York style)
- **Color System**: Beige background (`40 14% 90%`), section colors (Blue/Red/Purple/Green), red dot indicators for active states
- **Typography**: Inter (body), JetBrains Mono (code/labels), monospace uppercase for technical labels
- **Layout**: Card-based with `rounded-lg`, `p-6` spacing, gray-50 cards on beige backgrounds

**Key Pattern**: Feature components (`TaskCard`, `ChatMessage`, etc.) use Cohere's visual DNA - maintain card hierarchy and section color coding.

### Theme & Internationalization
- **Theme**: `client/src/components/ThemeProvider.tsx` with `next-themes` - supports light/dark/system
- **i18n**: `LanguageContext` with English/Japanese translations in `client/src/locales/`
  - Use `t("namespace.key", { param: value })` for dynamic content
  - Nested keys accessed with dot notation (e.g., `t("tasks.status.done")`)

## Feature Integration Patterns

### Chat → Task/Knowledge Conversion
**Core Workflow**:
1. `ChatMessage` component shows "Create Task" and "Create Knowledge" buttons on each message
2. Click opens modal (`NewTaskModal` or `CreateKnowledgeModal`) pre-filled with message context
3. Modal creates item via `WorkspaceDataContext.createTask()` or `.createKnowledge()`
4. New items store `origin` metadata:
   ```typescript
   origin: { source: "chat", referenceId: messageId, referenceLabel: "From #general" }
   ```

**Implementation**: See `client/src/pages/Chat.tsx` lines 250-350 for message action handlers.

### Workspace Data Context
`WorkspaceDataContext` is the source of truth for cross-feature data (tasks, knowledge, meetings):
- Maintains relationships (e.g., task → meeting, knowledge → chat)
- Handles mock data seeding from `client/src/data/` directory
- Provides CRUD methods that components consume

**When adding features**: Extend this context rather than creating isolated state.

## Development Workflows

### Running the App
```bash
npm run dev          # Starts dev server on port 5000 (both API + frontend)
npm run build        # Production build (Vite + esbuild)
npm run db:push      # Push schema changes to Neon DB
```

**Note**: Dev mode uses Vite HMR with Replit integration. Port 5000 is the ONLY exposed port (handles both API routes and static assets).

### Adding New Features
1. **Define schema** in `shared/schema.ts` (table + insert schema + types)
2. **Add storage methods** to `IStorage` interface and `MemStorage` class
3. **Create API routes** in `server/routes.ts` with Zod validation
4. **Build UI components** following Cohere design patterns
5. **Connect with TanStack Query** in page/component (use `/api/...` query keys)

### Database Migrations
- Schema changes: Update `shared/schema.ts`, then `npm run db:push`
- Connection config in `drizzle.config.ts` (requires `DATABASE_URL` env var)
- Current mode: Uses `MemStorage` with sample data from `client/src/data/` seeds

## Project-Specific Conventions

### File Naming & Organization
- **Pages**: PascalCase in `client/src/pages/` (e.g., `Dashboard.tsx`)
- **Components**: PascalCase in `client/src/components/` or feature subfolders
- **UI primitives**: kebab-case in `client/src/components/ui/` (shadcn convention)
- **Data seeds**: kebab-case in `client/src/data/` with TypeScript exports

### Code Style
- **Import order**: React → Third-party → Local components → Types → Utils
- **Types**: Prefer interfaces for props, types for unions/utility types
- **Error handling**: Wrap API calls in try-catch, log errors, return user-friendly messages
- **Query invalidation**: Use `queryClient.invalidateQueries(["/api", "resource"])` after mutations

### Testing Approach
- **User flow**: Login → Workspace selection → Feature access (all currently mock auth)
- **Sample data**: Rich fixtures in `client/src/data/` for development/demos
- **Auth**: `AuthContext` provides mock user; future: integrate real auth (passport-local configured but unused)

## Critical Context for AI Agents

### What Makes This Codebase Different
1. **Chat-as-hub model**: Unlike typical task apps, every feature connects back to chat. Always consider cross-feature references when adding functionality.
2. **Bilingual by design**: All user-facing strings MUST use `t()` function - never hardcode English.
3. **Mock-first development**: Features use in-memory storage with rich sample data before DB integration. Don't assume database is connected.
4. **Cohere design fidelity**: This isn't generic Material UI - maintain exact color codes, spacing, and card patterns from `design_guidelines.md`.

### Common Gotchas
- **Path aliases**: Use `@/` not `../`, configured in both `tsconfig.json` and `vite.config.ts`
- **Query keys as URLs**: TanStack Query keys are path arrays, not strings: `["/api", "tasks", id]` → `/api/tasks/${id}`
- **Windows compatibility**: Listen options in `server/index.ts` handle platform differences (no `reusePort` on Windows)
- **Date handling**: Use `date-fns` for formatting, store as `timestamp` columns in Drizzle
- **Session storage**: Configured for PostgreSQL (`connect-pg-simple`) but fallback to `memorystore` if DB unavailable

### Reference Files for Patterns
- **API patterns**: `server/routes.ts` (RESTful with Zod validation)
- **Query patterns**: `client/src/pages/Chat.tsx` or `Dashboard.tsx`
- **Modal workflows**: `client/src/components/NewTaskModal.tsx`
- **Context usage**: `client/src/contexts/WorkspaceDataContext.tsx`
- **i18n structure**: `client/src/locales/ja.ts` (comprehensive example)

## AI Agent Guidelines
- **Read before writing**: Check `design_guidelines.md` for UI specs, `essential_features.md` for product vision
- **Preserve types**: Always maintain TypeScript strictness - add types to `shared/schema.ts` for new entities
- **Test cross-feature links**: If you add/modify a feature, verify chat conversion and context references still work
- **Follow the hub pattern**: New features should integrate with chat (consider how messages/notifications flow through the system)
