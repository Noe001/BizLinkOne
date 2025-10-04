import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { addDays, subDays } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewTaskData } from "@/components/NewTaskModal";
import type { TaskDetailData } from "@/components/TaskDetailModal";
import type { CreateKnowledgeData } from "@/components/CreateKnowledgeModal";
import { createSampleTasksData, type TaskStateLike, type TaskDetailSeed } from "@/data/tasks";
import { knowledgeArticleSeeds } from "@/data/knowledge/seeds";
import { sampleParticipants, sampleChannels, type SampleParticipant, type SampleChannel } from "@/data/sampleWorkspace";
import { createSampleMeetingData, type MeetingSeed } from "@/data/meetings";
import { useAuth } from "./AuthContext";

interface TaskOrigin {
  source: "chat" | "meeting" | "manual";
  referenceId?: string;
  referenceLabel?: string;
}

interface TaskMessageContext {
  messageId?: string;
  content?: string;
  authorName?: string;
}

export interface CreateTaskInput extends NewTaskData {
  relatedMeetingId?: string;
  origin?: TaskOrigin;
  messageContext?: TaskMessageContext;
}

export interface WorkspaceTask extends TaskStateLike {
  origin?: TaskOrigin;
  messageContext?: TaskMessageContext;
}

export interface WorkspaceKnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  authorId?: string;
  authorName?: string;
  createdAt: Date;
  updatedAt?: Date;
  views: number;
  relatedChatId?: string;
  relatedMeetingId?: string;
  source?: "chat" | "meeting" | "manual";
}

interface WorkspaceDataContextValue {
  referenceDate: Date;
  tasks: WorkspaceTask[];
  createTask: (input: CreateTaskInput) => { id: string; task: WorkspaceTask };
  updateTask: (taskId: string, updates: Partial<TaskDetailData>) => void;
  deleteTask: (taskId: string) => void;
  knowledgeArticles: WorkspaceKnowledgeArticle[];
  createKnowledge: (input: WorkspaceKnowledgeArticleInput) => { id: string };
  updateKnowledge: (id: string, updates: Partial<WorkspaceKnowledgeArticle>) => void;
  deleteKnowledge: (id: string) => void;
  getParticipantById: (id: string | undefined) => SampleParticipant | undefined;
  getChannelById: (id: string | undefined) => SampleChannel | undefined;
  getMeetingById: (id: string | undefined) => MeetingSeed | undefined;
}

interface WorkspaceKnowledgeArticleInput extends CreateKnowledgeData {
  authorId?: string;
  authorName?: string;
  relatedMeetingId?: string;
  source?: "chat" | "meeting" | "manual";
}

const WorkspaceDataContext = createContext<WorkspaceDataContextValue | undefined>(undefined);

const buildInitialTasks = (referenceDate: Date): WorkspaceTask[] => {
  const { seeds, details } = createSampleTasksData(referenceDate);
  return seeds.map((seed) => {
    const extras: TaskDetailSeed | undefined = details[seed.id];

    const createdAt = extras ? subDays(referenceDate, extras.createdDaysAgo) : subDays(referenceDate, 7);
    const updatedAt = extras ? subDays(referenceDate, extras.updatedDaysAgo) : referenceDate;

    const subtasks = extras?.subtasks?.map((subtask) => ({
      id: subtask.id,
      title: subtask.title,
      completed: subtask.completed,
      assigneeId: subtask.assigneeId,
    })) ?? [];

    const participantMap = new Map(sampleParticipants.map((participant) => [participant.id, participant]));

    const comments = extras?.comments?.map((comment) => {
      const participant = participantMap.get(comment.authorId);
      return {
        id: comment.id,
        content: comment.content,
        authorId: comment.authorId,
        authorName: participant?.name ?? comment.authorId,
        authorAvatar: participant?.avatar,
        createdAt: subDays(referenceDate, comment.createdDaysAgo),
      } satisfies TaskDetailData["comments"][number];
    }) ?? [];

    const timeEntries = extras?.timeEntries?.map((entry) => {
      const participant = participantMap.get(entry.userId);
      return {
        id: entry.id,
        description: entry.description,
        hours: entry.hours,
        date: subDays(referenceDate, entry.daysAgo),
        userId: entry.userId,
        userName: participant?.name ?? entry.userId,
      } satisfies TaskDetailData["timeEntries"][number];
    }) ?? [];

    return {
      id: seed.id,
      title: seed.title,
      description: seed.description,
      status: seed.status,
      priority: seed.priority,
      assigneeId: seed.assigneeId,
      dueDate: seed.dueInDays !== undefined ? addDays(referenceDate, seed.dueInDays) : undefined,
      relatedChatId: seed.relatedChatId,
      relatedMeetingId: seed.relatedMeetingId,
      projectId: seed.projectId,
      tags: seed.tags,
      estimatedHours: seed.estimatedHours,
      createdAt,
      updatedAt,
      actualHours: extras?.actualHours,
      subtasks,
      comments,
      timeEntries,
    } satisfies WorkspaceTask;
  });
};

const buildInitialKnowledge = (referenceDate: Date): WorkspaceKnowledgeArticle[] => {
  return knowledgeArticleSeeds.map((seed) => ({
    id: seed.id,
    title: seed.title,
    summary: seed.excerpt,
    content: seed.excerpt,
    category: "General",
    tags: seed.tags,
    authorId: seed.authorId,
    createdAt: subDays(referenceDate, seed.createdDaysAgo),
    updatedAt: seed.updatedDaysAgo !== undefined ? subDays(referenceDate, seed.updatedDaysAgo) : undefined,
    views: seed.views ?? 0,
    relatedChatId: seed.relatedChatId,
    source: "manual",
  }));
};

const participantMap = new Map(sampleParticipants.map((participant) => [participant.id, participant]));
const channelMap = new Map(sampleChannels.map((channel) => [channel.id, channel]));

export function WorkspaceDataProvider({ children }: { children: React.ReactNode }) {
  const [referenceDate] = useState(() => new Date());
  const { user, isAuthenticated, currentWorkspaceId } = useAuth();
  const queryClient = useQueryClient();

  const initialMeetings = useMemo(() => createSampleMeetingData(referenceDate).meetings, [referenceDate]);
  const meetingMap = useMemo(() => new Map(initialMeetings.map((meeting) => [meeting.id, meeting])), [initialMeetings]);

  // Supabase からタスクを取得
  // 現在は開発環境なので、サーバーAPIを使用
  const { data: supabaseTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', currentWorkspaceId],
    queryFn: async () => {
      if (!currentWorkspaceId) return [];
      const response = await fetch(`/api/tasks?workspaceId=${currentWorkspaceId}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasks = await response.json();
      return tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status as WorkspaceTask["status"],
        priority: task.priority as WorkspaceTask["priority"],
        assigneeId: task.assignee_id ?? undefined,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        relatedChatId: undefined, // TODO: 今後実装
        relatedMeetingId: undefined, // TODO: 今後実装
        projectId: undefined, // TODO: 今後実装
        tags: [], // TODO: 今後実装
        estimatedHours: undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.created_at), // updated_atがないのでcreated_atを使用
        actualHours: 0,
        subtasks: [],
        comments: [],
        timeEntries: [],
        origin: { source: "manual" as const },
      } as WorkspaceTask));
    },
    enabled: isAuthenticated && !!currentWorkspaceId,
    staleTime: Infinity,
  });

  // ナレッジ記事を取得
  // 現在は開発環境なので、サーバーAPIを使用
  const { data: supabaseKnowledge, isLoading: knowledgeLoading } = useQuery({
    queryKey: ['knowledge', currentWorkspaceId],
    queryFn: async () => {
      if (!currentWorkspaceId) return [];
      const response = await fetch(`/api/knowledge?workspaceId=${currentWorkspaceId}`);
      if (!response.ok) throw new Error('Failed to fetch knowledge');
      const articles = await response.json();
      return articles.map((article: any) => ({
        id: article.id,
        title: article.title,
        summary: article.excerpt ?? article.content.substring(0, 200),
        content: article.content,
        category: "General", // TODO: カテゴリ機能を実装
        tags: article.tags || [],
        authorId: article.authorId,
        authorName: article.authorName,
        createdAt: new Date(article.createdAt),
        updatedAt: article.updatedAt ? new Date(article.updatedAt) : undefined,
        views: article.views,
        relatedChatId: undefined,
        relatedMeetingId: undefined,
        source: "manual" as const,
      } as WorkspaceKnowledgeArticle));
    },
    enabled: isAuthenticated && !!currentWorkspaceId,
    staleTime: Infinity,
  });

  // フォールバック: 認証前またはデータ取得中はモックデータ
  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => buildInitialTasks(referenceDate));
  const [knowledgeArticles, setKnowledgeArticles] = useState<WorkspaceKnowledgeArticle[]>(() => buildInitialKnowledge(referenceDate));

  // Supabase データが取得できたら反映
  useEffect(() => {
    if (isAuthenticated && supabaseTasks) {
      setTasks(supabaseTasks);
    } else if (!isAuthenticated) {
      setTasks(buildInitialTasks(referenceDate));
    }
  }, [isAuthenticated, supabaseTasks, referenceDate]);

  useEffect(() => {
    if (isAuthenticated && supabaseKnowledge) {
      setKnowledgeArticles(supabaseKnowledge);
    } else if (!isAuthenticated) {
      setKnowledgeArticles(buildInitialKnowledge(referenceDate));
    }
  }, [isAuthenticated, supabaseKnowledge, referenceDate]);

  const createTask = useCallback((input: CreateTaskInput) => {
    if (!isAuthenticated || !user) {
      // 認証されていない場合はローカルのみ
      const now = new Date();
      const id = `task-${now.getTime()}`;
      const normalizedStatus = input.status ?? "todo";
      const normalizedPriority = input.priority ?? "medium";

      const newTask: WorkspaceTask = {
        id,
        title: input.title,
        description: input.description,
        status: normalizedStatus,
        priority: normalizedPriority,
        assigneeId: input.assigneeId,
        dueDate: input.dueDate,
        relatedChatId: input.relatedChatId,
        relatedMeetingId: input.relatedMeetingId,
        projectId: input.projectId,
        tags: input.tags ?? [],
        estimatedHours: input.estimatedHours,
        createdAt: now,
        updatedAt: now,
        actualHours: 0,
        subtasks: [],
        comments: [],
        timeEntries: [],
        origin: input.origin ?? { source: "manual" },
        messageContext: input.messageContext,
      };

      setTasks((previous) => [newTask, ...previous]);
      return { id, task: newTask };
    }

    // APIに保存
    const now = new Date();
    const tempId = `task-${now.getTime()}`;
    
    // currentWorkspaceIdがあればAPIに保存
    if (currentWorkspaceId) {
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: currentWorkspaceId,
          title: input.title,
          description: input.description ?? null,
          status: input.status ?? "todo",
          priority: input.priority ?? "medium",
          assigneeId: input.assigneeId ?? null,
          assigneeName: null, // TODO: ユーザー名の解決が必要
          dueDate: input.dueDate ?? null,
          createdBy: user.id,
        }),
      }).then(async (response) => {
        if (response.ok) {
          // 作成成功後、キャッシュを更新
          queryClient.invalidateQueries({ queryKey: ['tasks', currentWorkspaceId] });
        } else {
          console.error('Failed to create task:', await response.text());
        }
      }).catch((error) => {
        console.error('Failed to create task:', error);
      });
    }

    // 楽観的更新: 即座にUIに反映
    const optimisticTask: WorkspaceTask = {
      id: tempId,
      title: input.title,
      description: input.description,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      relatedChatId: input.relatedChatId,
      relatedMeetingId: input.relatedMeetingId,
      projectId: input.projectId,
      tags: input.tags ?? [],
      estimatedHours: input.estimatedHours,
      createdAt: now,
      updatedAt: now,
      actualHours: 0,
      subtasks: [],
      comments: [],
      timeEntries: [],
      origin: input.origin ?? { source: "manual" },
      messageContext: input.messageContext,
    };

    setTasks((previous) => [optimisticTask, ...previous]);
    return { id: tempId, task: optimisticTask };
  }, [isAuthenticated, user, queryClient]);

  const updateTask = useCallback((taskId: string, updates: Partial<TaskDetailData>) => {
    // 楽観的更新: 即座にUIに反映
    setTasks((previous) =>
      previous.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          title: updates.title ?? task.title,
          description: updates.description ?? task.description,
          status: (updates.status as WorkspaceTask["status"] | undefined) ?? task.status,
          priority: (updates.priority as WorkspaceTask["priority"] | undefined) ?? task.priority,
          assigneeId: updates.assignee?.id ?? task.assigneeId,
          dueDate: updates.dueDate ?? task.dueDate,
          tags: updates.tags ?? task.tags,
          estimatedHours: updates.estimatedHours ?? task.estimatedHours,
          actualHours: updates.actualHours ?? task.actualHours,
          subtasks: updates.subtasks ?? task.subtasks,
          comments: updates.comments ?? task.comments,
          timeEntries: updates.timeEntries ?? task.timeEntries,
          updatedAt: new Date(),
        } satisfies WorkspaceTask;
      })
    );

    // 認証されている場合はAPIにも保存
    if (isAuthenticated && user && currentWorkspaceId) {
      fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          assigneeId: updates.assignee?.id ?? null,
          assigneeName: updates.assignee?.name ?? null,
          dueDate: updates.dueDate ?? null,
        }),
      }).then(async (response) => {
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['tasks', currentWorkspaceId] });
        } else {
          console.error('Failed to update task:', await response.text());
          queryClient.invalidateQueries({ queryKey: ['tasks', currentWorkspaceId] });
        }
      }).catch((error: unknown) => {
        console.error('Failed to update task:', error);
        // エラー時はクエリを再取得して最新状態に戻す
        queryClient.invalidateQueries({ queryKey: ['tasks', currentWorkspaceId] });
      });
    }
  }, [isAuthenticated, user, queryClient]);

  const deleteTask = useCallback((taskId: string) => {
    // 楽観的更新: 即座にUIから削除
    setTasks((previous) => previous.filter((task) => task.id !== taskId));

    // 認証されている場合はAPIからも削除
    if (isAuthenticated && currentWorkspaceId) {
      fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      }).then(async (response) => {
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['tasks', currentWorkspaceId] });
        } else {
          console.error('Failed to delete task:', await response.text());
          queryClient.invalidateQueries({ queryKey: ['tasks', currentWorkspaceId] });
        }
      }).catch((error: unknown) => {
        console.error('Failed to delete task:', error);
        queryClient.invalidateQueries({ queryKey: ['tasks', currentWorkspaceId] });
      });
    }
  }, [isAuthenticated, currentWorkspaceId, queryClient]);

  const createKnowledge = useCallback((input: WorkspaceKnowledgeArticleInput) => {
    const now = new Date();
    const tempId = `kb-${now.getTime()}`;

    // 楽観的更新
    const optimisticArticle: WorkspaceKnowledgeArticle = {
      id: tempId,
      title: input.title,
      summary: input.summary,
      content: input.content,
      category: input.category,
      tags: input.tags,
      authorId: input.authorId,
      authorName: input.authorName,
      createdAt: now,
      updatedAt: now,
      views: 0,
      relatedChatId: input.relatedChatId,
      relatedMeetingId: input.relatedMeetingId,
      source: input.source ?? "manual",
    };

    setKnowledgeArticles((previous) => [optimisticArticle, ...previous]);

    // 認証されている場合はAPIに保存
    if (isAuthenticated && user && currentWorkspaceId) {
      fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: currentWorkspaceId,
          title: input.title,
          content: input.content,
          excerpt: input.summary ?? null,
          tags: input.tags.length > 0 ? input.tags : null,
          authorId: user.id,
          authorName: input.authorName || user.name,
        }),
      }).then(async (response) => {
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['knowledge', currentWorkspaceId] });
        } else {
          console.error('Failed to create knowledge:', await response.text());
        }
      }).catch((error) => {
        console.error('Failed to create knowledge:', error);
      });
    }

    return { id: tempId };
  }, [isAuthenticated, user, queryClient]);

  const updateKnowledge = useCallback((id: string, updates: Partial<WorkspaceKnowledgeArticle>) => {
    setKnowledgeArticles((previous) =>
      previous.map((article) =>
        article.id === id
          ? {
              ...article,
              ...updates,
              updatedAt: new Date(),
            }
          : article
      )
    );

    // 認証されている場合はAPIにも保存
    if (isAuthenticated && user && currentWorkspaceId) {
      fetch(`/api/knowledge/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updates.title,
          content: updates.content,
          excerpt: updates.summary ?? null,
          tags: updates.tags && updates.tags.length > 0 ? updates.tags : null,
        }),
      }).then(async (response) => {
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['knowledge', currentWorkspaceId] });
        } else {
          console.error('Failed to update knowledge:', await response.text());
          queryClient.invalidateQueries({ queryKey: ['knowledge', currentWorkspaceId] });
        }
      }).catch((error: unknown) => {
        console.error('Failed to update knowledge:', error);
        queryClient.invalidateQueries({ queryKey: ['knowledge', currentWorkspaceId] });
      });
    }
  }, [isAuthenticated, user, currentWorkspaceId, queryClient]);

  const deleteKnowledge = useCallback((id: string) => {
    setKnowledgeArticles((previous) => previous.filter((article) => article.id !== id));

    // 認証されている場合はAPIからも削除
    if (isAuthenticated && currentWorkspaceId) {
      fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
      }).then(async (response) => {
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['knowledge', currentWorkspaceId] });
        } else {
          console.error('Failed to delete knowledge:', await response.text());
          queryClient.invalidateQueries({ queryKey: ['knowledge', currentWorkspaceId] });
        }
      }).catch((error: unknown) => {
        console.error('Failed to delete knowledge:', error);
        queryClient.invalidateQueries({ queryKey: ['knowledge', currentWorkspaceId] });
      });
    }
  }, [isAuthenticated, currentWorkspaceId, queryClient]);

  const value = useMemo<WorkspaceDataContextValue>(() => ({
    referenceDate,
    tasks,
    createTask,
    updateTask,
    deleteTask,
    knowledgeArticles,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
    getParticipantById: (id: string | undefined) => (id ? participantMap.get(id) : undefined),
    getChannelById: (id: string | undefined) => (id ? channelMap.get(id) : undefined),
    getMeetingById: (id: string | undefined) => (id ? meetingMap.get(id) : undefined),
  }), [referenceDate, tasks, knowledgeArticles, meetingMap, createTask, updateTask, deleteTask, createKnowledge, updateKnowledge, deleteKnowledge]);

  return <WorkspaceDataContext.Provider value={value}>{children}</WorkspaceDataContext.Provider>;
}

export function useWorkspaceData() {
  const context = useContext(WorkspaceDataContext);
  if (!context) {
    throw new Error("useWorkspaceData must be used within a WorkspaceDataProvider");
  }
  return context;
}
