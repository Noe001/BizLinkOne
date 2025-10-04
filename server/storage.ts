import {
  type User, type InsertUser,
  type ChatMessage, type InsertChatMessage,
  type ChatAttachment, type InsertChatAttachment,
  type ChatReaction, type InsertChatReaction,
  type ChatReadReceipt, type InsertChatReadReceipt,
  type Task, type InsertTask,
  type KnowledgeArticle, type InsertKnowledgeArticle,
  type Meeting, type InsertMeeting
} from "@shared/schema";
import { randomUUID } from "crypto";

// Demo workspace ID for seed data
const DEMO_WORKSPACE_ID = "demo-workspace-1";
const DEMO_USER_ID = "demo-user-1";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Chat Messages
  getChatMessages(workspaceId: string, channelId?: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  createChatAttachment(attachment: InsertChatAttachment): Promise<ChatAttachment>;
  getChatAttachments(messageIds: string[]): Promise<ChatAttachment[]>;
  addChatReaction(reaction: InsertChatReaction): Promise<ChatReaction>;
  removeChatReaction(messageId: string, userId: string, emoji: string): Promise<void>;
  getChatReactions(messageIds: string[]): Promise<ChatReaction[]>;
  getReadReceipt(workspaceId: string, userId: string, channelId: string): Promise<ChatReadReceipt | undefined>;
  upsertReadReceipt(receipt: InsertChatReadReceipt & { lastReadAt?: Date }): Promise<ChatReadReceipt>;

  // Tasks
  getTasks(workspaceId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;

  // Knowledge Articles
  getKnowledgeArticles(workspaceId: string): Promise<KnowledgeArticle[]>;
  getKnowledgeArticle(id: string): Promise<KnowledgeArticle | undefined>;
  createKnowledgeArticle(article: InsertKnowledgeArticle): Promise<KnowledgeArticle>;
  incrementArticleViews(id: string): Promise<void>;

  // Meetings
  getMeetings(workspaceId: string): Promise<Meeting[]>;
  getMeeting(id: string): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatMessages: Map<string, ChatMessage>;
  private chatAttachments: Map<string, ChatAttachment>;
  private chatReactions: Map<string, ChatReaction>;
  private chatReadReceipts: Map<string, ChatReadReceipt>;
  private tasks: Map<string, Task>;
  private knowledgeArticles: Map<string, KnowledgeArticle>;
  private meetings: Map<string, Meeting>;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.chatAttachments = new Map();
    this.chatReactions = new Map();
    this.chatReadReceipts = new Map();
    this.tasks = new Map();
    this.knowledgeArticles = new Map();
    this.meetings = new Map();
    
    // Seed with some initial data
    this.seedData();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // username is actually email in this context
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      avatarUrl: null,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  // Chat Messages
  async getChatMessages(workspaceId: string, channelId?: string): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values()).filter(
      (msg) => msg.workspaceId === workspaceId,
    );

    const filtered = channelId
      ? messages.filter((msg) => msg.channelId === channelId)
      : messages;

    return filtered.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      parentMessageId: insertMessage.parentMessageId ?? null,
      editedAt: null,
      deletedAt: null,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async createChatAttachment(insertAttachment: InsertChatAttachment): Promise<ChatAttachment> {
    const id = randomUUID();
    const attachment: ChatAttachment = {
      ...insertAttachment,
      id,
      uploadedAt: new Date(),
    };
    this.chatAttachments.set(id, attachment);
    return attachment;
  }

  async getChatAttachments(messageIds: string[]): Promise<ChatAttachment[]> {
    if (messageIds.length === 0) {
      return [];
    }
    const idSet = new Set(messageIds);
    return Array.from(this.chatAttachments.values()).filter((attachment) =>
      idSet.has(attachment.messageId)
    );
  }

  async addChatReaction(insertReaction: InsertChatReaction): Promise<ChatReaction> {
    const existing = Array.from(this.chatReactions.values()).find((reaction) =>
      reaction.messageId === insertReaction.messageId &&
      reaction.userId === insertReaction.userId &&
      reaction.emoji === insertReaction.emoji
    );

    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const reaction: ChatReaction = {
      ...insertReaction,
      id,
      createdAt: new Date(),
    };
    this.chatReactions.set(id, reaction);
    return reaction;
  }

  async removeChatReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const entry = Array.from(this.chatReactions.entries()).find(([, reaction]) =>
      reaction.messageId === messageId &&
      reaction.userId === userId &&
      reaction.emoji === emoji
    );
    if (entry) {
      this.chatReactions.delete(entry[0]);
    }
  }

  async getChatReactions(messageIds: string[]): Promise<ChatReaction[]> {
    if (messageIds.length === 0) {
      return [];
    }
    const idSet = new Set(messageIds);
    return Array.from(this.chatReactions.values()).filter((reaction) =>
      idSet.has(reaction.messageId)
    );
  }

  async getReadReceipt(workspaceId: string, userId: string, channelId: string): Promise<ChatReadReceipt | undefined> {
    return this.chatReadReceipts.get(`${workspaceId}:${userId}:${channelId}`);
  }

  async upsertReadReceipt(receipt: InsertChatReadReceipt & { lastReadAt?: Date }): Promise<ChatReadReceipt> {
    const key = `${receipt.workspaceId}:${receipt.userId}:${receipt.channelId}`;
    const existing = this.chatReadReceipts.get(key);
    const now = receipt.lastReadAt ?? new Date();

    const record: ChatReadReceipt = {
      id: existing?.id ?? randomUUID(),
      workspaceId: receipt.workspaceId,
      userId: receipt.userId,
      channelId: receipt.channelId,
      lastReadMessageId: receipt.lastReadMessageId ?? existing?.lastReadMessageId ?? null,
      lastReadAt: now,
    };

    if (receipt.lastReadMessageId) {
      record.lastReadMessageId = receipt.lastReadMessageId;
    }

    this.chatReadReceipts.set(key, record);
    return record;
  }

  // Tasks
  async getTasks(workspaceId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter((task) => task.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      description: insertTask.description ?? null,
      assigneeId: insertTask.assigneeId ?? null,
      assigneeName: insertTask.assigneeName ?? null,
      dueDate: insertTask.dueDate ?? null,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    
    const updated: Task = { ...existing, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  // Knowledge Articles
  async getKnowledgeArticles(workspaceId: string): Promise<KnowledgeArticle[]> {
    return Array.from(this.knowledgeArticles.values())
      .filter((article) => article.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getKnowledgeArticle(id: string): Promise<KnowledgeArticle | undefined> {
    return this.knowledgeArticles.get(id);
  }

  async createKnowledgeArticle(insertArticle: InsertKnowledgeArticle): Promise<KnowledgeArticle> {
    const id = randomUUID();
    const now = new Date();
    const article: KnowledgeArticle = {
      ...insertArticle,
      id,
      excerpt: insertArticle.excerpt ?? null,
      tags: insertArticle.tags ? [...insertArticle.tags] : null,
      views: 0,
      createdAt: now,
      updatedAt: now
    };
    this.knowledgeArticles.set(id, article);
    return article;
  }

  async incrementArticleViews(id: string): Promise<void> {
    const article = this.knowledgeArticles.get(id);
    if (article) {
      article.views += 1;
      this.knowledgeArticles.set(id, article);
    }
  }

  // Meetings
  async getMeetings(workspaceId: string): Promise<Meeting[]> {
    return Array.from(this.meetings.values())
      .filter((meeting) => meeting.workspaceId === workspaceId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = randomUUID();
    const meeting: Meeting = {
      ...insertMeeting,
      id,
      description: insertMeeting.description ?? null,
      participants: insertMeeting.participants ? [...insertMeeting.participants] : null,
      meetingUrl: insertMeeting.meetingUrl ?? null,
      createdAt: new Date()
    };
    this.meetings.set(id, meeting);
    return meeting;
  }

  async updateMeeting(id: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const existing = this.meetings.get(id);
    if (!existing) return undefined;
    
    // Merge participants safely: if updates.participants is provided, use a shallow copy; otherwise keep existing
    const participants = updates.participants !== undefined ? (updates.participants ? [...updates.participants] : null) : existing.participants;

    const updated: Meeting = { ...existing, ...updates, participants };
    this.meetings.set(id, updated);
    return updated;
  }

  private seedData() {
    const now = new Date();
    const MINUTES = 60 * 1000;
    const HOURS = 60 * MINUTES;
    const DAYS = 24 * HOURS;

    // Seed chat messages
    const messages: ChatMessage[] = [
      {
        id: randomUUID(),
        workspaceId: DEMO_WORKSPACE_ID,
        channelId: "general",
        userId: "john-doe",
        userName: "John Doe",
        content: "The new authentication system is ready for testing. Can someone review the PR?",
        parentMessageId: null,
        editedAt: null,
        deletedAt: null,
        createdAt: new Date(now.getTime() - 15 * MINUTES),
      },
      {
        id: randomUUID(),
        workspaceId: DEMO_WORKSPACE_ID,
        channelId: "general",
        userId: "sarah-wilson",
        userName: "Sarah Wilson",
        content: "I've updated the API documentation with the latest endpoints.",
        parentMessageId: null,
        editedAt: null,
        deletedAt: null,
        createdAt: new Date(now.getTime() - 30 * MINUTES),
      },
    ];
    messages.forEach(msg => this.chatMessages.set(msg.id, msg));

    // Seed tasks
    const tasks: Task[] = [
      {
        id: randomUUID(),
        workspaceId: DEMO_WORKSPACE_ID,
        title: "Review authentication PR",
        description: "Review the new authentication system implementation",
        status: "todo",
        priority: "high",
        assigneeId: "current",
        assigneeName: "You",
        dueDate: new Date(now.getTime() + DAYS),
        createdBy: DEMO_USER_ID,
        createdAt: now,
      },
      {
        id: randomUUID(),
        workspaceId: DEMO_WORKSPACE_ID,
        title: "Update deployment docs",
        description: "Update documentation for the new deployment process",
        status: "in-progress",
        priority: "medium",
        assigneeId: "sarah",
        assigneeName: "Sarah Wilson",
        dueDate: new Date(now.getTime() + 3 * DAYS),
        createdBy: DEMO_USER_ID,
        createdAt: now,
      },
    ];
    tasks.forEach(task => this.tasks.set(task.id, task));

    // Seed knowledge articles
    const articles: KnowledgeArticle[] = [
      {
        id: randomUUID(),
        workspaceId: DEMO_WORKSPACE_ID,
        title: "Authentication Best Practices",
        content: "Guidelines for implementing secure authentication in our applications...",
        excerpt: "Guidelines for implementing secure authentication in our applications.",
        tags: ["security", "auth"],
        authorId: "john",
        authorName: "John Doe",
        views: 45,
        createdAt: new Date(now.getTime() - DAYS),
        updatedAt: new Date(now.getTime() - DAYS),
      },
    ];
    articles.forEach(article => this.knowledgeArticles.set(article.id, article));

    // Seed meetings
    const meetings: Meeting[] = [
      {
        id: randomUUID(),
        workspaceId: DEMO_WORKSPACE_ID,
        title: "Daily Standup",
        description: "Daily team sync meeting",
        startTime: new Date(now.getTime() + 30 * MINUTES),
        endTime: new Date(now.getTime() + HOURS),
        status: "scheduled",
        participants: [
          { id: "john", name: "John Doe" },
          { id: "sarah", name: "Sarah Wilson" },
          { id: "mike", name: "Mike Johnson" },
        ],
        meetingUrl: "https://meet.google.com/abc-def-ghi",
        createdBy: DEMO_USER_ID,
        createdAt: now,
      },
    ];
    meetings.forEach(meeting => this.meetings.set(meeting.id, meeting));
  }
}

export const storage = new MemStorage();
