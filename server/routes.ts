import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { workspaceService } from "./services/workspace";
import { 
  insertChatMessageSchema, 
  insertTaskSchema, 
  insertKnowledgeArticleSchema, 
  insertMeetingSchema 
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

// Common error handler
function handleError(error: unknown, operation: string, res: any) {
  console.error(`Error ${operation}:`, error);
  const message = error instanceof Error ? error.message : `Failed to ${operation}`;
  res.status(500).json({ error: message });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat Messages API
  app.get("/api/messages", async (req, res) => {
    try {
      const { channelId } = req.query;
      const messages = await storage.getChatMessages(channelId as string);
      res.json(messages);
    } catch (error) {
      handleError(error, "get messages", res);
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
      handleError(error, "create message", res);
    }
  });

  // Tasks API
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      handleError(error, "get tasks", res);
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
      handleError(error, "get task", res);
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
      handleError(error, "create task", res);
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
      handleError(error, "update task", res);
    }
  });

  // Knowledge Articles API
  app.get("/api/knowledge", async (req, res) => {
    try {
      const articles = await storage.getKnowledgeArticles();
      res.json(articles);
    } catch (error) {
      handleError(error, "get knowledge articles", res);
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
      handleError(error, "get knowledge article", res);
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
      handleError(error, "create knowledge article", res);
    }
  });

  // Meetings API
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      handleError(error, "get meetings", res);
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
      handleError(error, "get meeting", res);
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
      handleError(error, "create meeting", res);
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
      handleError(error, "update meeting", res);
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
        new Date(m.createdAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
      );
      
      const stats = {
        activeChats: recentMessages.length,
        pendingTasks: pendingTasks.length,
        knowledgeArticles: knowledge.length,
        upcomingMeetings: upcomingMeetings.length
      };
      
      res.json(stats);
    } catch (error) {
      handleError(error, "get stats", res);
    }
  });

  // Workspace API
  app.post("/api/workspaces", async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
        description: z.string().optional(),
        ownerId: z.string(),
        ownerEmail: z.string().email(),
        ownerName: z.string(),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }

      const workspace = await workspaceService.createWorkspace(result.data);
      res.status(201).json(workspace);
    } catch (error) {
      handleError(error, "create workspace", res);
    }
  });

  app.get("/api/workspaces/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const workspaces = await workspaceService.getUserWorkspaces(userId);
      res.json(workspaces);
    } catch (error) {
      handleError(error, "get user workspaces", res);
    }
  });

  app.get("/api/workspaces/:workspaceId", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const workspace = await workspaceService.getWorkspace(workspaceId);
      
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      res.json(workspace);
    } catch (error) {
      handleError(error, "get workspace", res);
    }
  });

  app.patch("/api/workspaces/:workspaceId", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const schema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }

      const workspace = await workspaceService.updateWorkspace(workspaceId, result.data);
      
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      res.json(workspace);
    } catch (error) {
      handleError(error, "update workspace", res);
    }
  });

  app.get("/api/workspaces/:workspaceId/members", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const members = await workspaceService.getWorkspaceMembers(workspaceId);
      res.json(members);
    } catch (error) {
      handleError(error, "get workspace members", res);
    }
  });

  app.post("/api/workspaces/:workspaceId/invitations", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const schema = z.object({
        email: z.string().email(),
        role: z.enum(['admin', 'member', 'guest']),
        invitedBy: z.string(),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }

      const invitation = await workspaceService.createInvitation({
        workspaceId,
        ...result.data,
      });

      res.status(201).json(invitation);
    } catch (error) {
      handleError(error, "create invitation", res);
    }
  });

  app.get("/api/invitations/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const invitation = await workspaceService.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ error: "Invitation not found or expired" });
      }

      res.json(invitation);
    } catch (error) {
      handleError(error, "get invitation", res);
    }
  });

  app.post("/api/invitations/:token/accept", async (req, res) => {
    try {
      const { token } = req.params;
      const schema = z.object({
        userId: z.string(),
        userEmail: z.string().email(),
        userName: z.string(),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).toString() 
        });
      }

      const { workspace, member } = await workspaceService.acceptInvitation({
        token,
        ...result.data,
      });

      res.json({ workspace, member });
    } catch (error) {
      handleError(error, "accept invitation", res);
    }
  });

  app.delete("/api/workspaces/:workspaceId/members/:memberId", async (req, res) => {
    try {
      const { workspaceId, memberId } = req.params;
      const success = await workspaceService.removeMember(workspaceId, memberId);
      
      if (!success) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json({ success: true });
    } catch (error) {
      handleError(error, "remove member", res);
    }
  });

  app.delete("/api/invitations/:invitationId", async (req, res) => {
    try {
      const { invitationId } = req.params;
      const success = await workspaceService.deleteInvitation(invitationId);
      
      if (!success) {
        return res.status(404).json({ error: "Invitation not found" });
      }

      res.json({ success: true });
    } catch (error) {
      handleError(error, "delete invitation", res);
    }
  });

  app.get("/api/workspaces/:workspaceId/invitations", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const invitations = await workspaceService.getWorkspaceInvitations(workspaceId);
      res.json(invitations);
    } catch (error) {
      handleError(error, "get workspace invitations", res);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
