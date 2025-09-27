export const KNOWLEDGE_ROUTE_BASE = "/knowledge" as const;

export const SLASH_COMMANDS = {
  KNOWLEDGE_SEARCH: "/knowledge",
  KNOWLEDGE_QUICK_SEARCH: "/kb",
} as const;

export const KNOWLEDGE_COMMANDS = [
  SLASH_COMMANDS.KNOWLEDGE_SEARCH,
  SLASH_COMMANDS.KNOWLEDGE_QUICK_SEARCH,
] as const;

export type KnowledgeCommand = typeof KNOWLEDGE_COMMANDS[number];
