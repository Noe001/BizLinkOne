import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertChatMessageSchema, 
  insertTaskSchema, 
  insertKnowledgeArticleSchema, 
  insertMeetingSchema 
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat Messages API
  app.get("/api/messages", async (req, res) => {
    try {
      const { channelId } = req.query;
      const messages = await storage.getChatMessages(channelId as string);
      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertChatMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }
      
      const message = await storage.createChatMessage(result.data);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Tasks API
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error getting tasks:", error);
      res.status(500).json({ error: "Failed to get tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error getting task:", error);
      res.status(500).json({ error: "Failed to get task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const result = insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }
      
      const task = await storage.createTask(result.data);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const result = insertTaskSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }
      
      const task = await storage.updateTask(req.params.id, result.data);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // Knowledge Articles API
  app.get("/api/knowledge", async (req, res) => {
    try {
      const articles = await storage.getKnowledgeArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error getting knowledge articles:", error);
      res.status(500).json({ error: "Failed to get knowledge articles" });
    }
  });

  app.get("/api/knowledge/:id", async (req, res) => {
    try {
      const article = await storage.getKnowledgeArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementArticleViews(req.params.id);
      
      res.json(article);
    } catch (error) {
      console.error("Error getting knowledge article:", error);
      res.status(500).json({ error: "Failed to get knowledge article" });
    }
  });

  app.post("/api/knowledge", async (req, res) => {
    try {
      const result = insertKnowledgeArticleSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }
      
      const article = await storage.createKnowledgeArticle(result.data);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating knowledge article:", error);
      res.status(500).json({ error: "Failed to create knowledge article" });
    }
  });

  // Meetings API
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      console.error("Error getting meetings:", error);
      res.status(500).json({ error: "Failed to get meetings" });
    }
  });

  app.get("/api/meetings/:id", async (req, res) => {
    try {
      const meeting = await storage.getMeeting(req.params.id);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      console.error("Error getting meeting:", error);
      res.status(500).json({ error: "Failed to get meeting" });
    }
  });

  app.post("/api/meetings", async (req, res) => {
    try {
      const result = insertMeetingSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }
      
      const meeting = await storage.createMeeting(result.data);
      res.status(201).json(meeting);
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ error: "Failed to create meeting" });
    }
  });

  app.patch("/api/meetings/:id", async (req, res) => {
    try {
      const result = insertMeetingSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }
      
      const meeting = await storage.updateMeeting(req.params.id, result.data);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      console.error("Error updating meeting:", error);
      res.status(500).json({ error: "Failed to update meeting" });
    }
  });

  // Dashboard Stats API
  app.get("/api/stats", async (req, res) => {
    try {
      const [messages, tasks, knowledge, meetings] = await Promise.all([
        storage.getChatMessages(),
        storage.getTasks(),
        storage.getKnowledgeArticles(),
        storage.getMeetings()
      ]);
      
      const now = new Date();
      const upcomingMeetings = meetings.filter(m => 
        new Date(m.startTime) > now && m.status === 'scheduled'
      );
      
      const pendingTasks = tasks.filter(t => 
        t.status !== 'done'
      );
      
      const recentMessages = messages.filter(m => 
        new Date(m.timestamp) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
      );
      
      const stats = {
        activeChats: recentMessages.length,
        pendingTasks: pendingTasks.length,
        knowledgeArticles: knowledge.length,
        upcomingMeetings: upcomingMeetings.length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
