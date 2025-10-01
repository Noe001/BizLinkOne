import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { addDays, subDays } from "date-fns";
import type { NewTaskData } from "@/components/NewTaskModal";
import type { TaskDetailData } from "@/components/TaskDetailModal";
import type { CreateKnowledgeData } from "@/components/CreateKnowledgeModal";
import { createSampleTasksData, type TaskStateLike, type TaskDetailSeed } from "@/data/tasks";
import { knowledgeArticleSeeds } from "@/data/knowledge/seeds";
import { sampleParticipants, sampleChannels, type SampleParticipant, type SampleChannel } from "@/data/sampleWorkspace";
import { createSampleMeetingData, type MeetingSeed } from "@/data/meetings";

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

  const initialMeetings = useMemo(() => createSampleMeetingData(referenceDate).meetings, [referenceDate]);
  const meetingMap = useMemo(() => new Map(initialMeetings.map((meeting) => [meeting.id, meeting])), [initialMeetings]);

  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => buildInitialTasks(referenceDate));
  const [knowledgeArticles, setKnowledgeArticles] = useState<WorkspaceKnowledgeArticle[]>(() => buildInitialKnowledge(referenceDate));

  const createTask = useCallback((input: CreateTaskInput) => {
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
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<TaskDetailData>) => {
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
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((previous) => previous.filter((task) => task.id !== taskId));
  }, []);

  const createKnowledge = useCallback((input: WorkspaceKnowledgeArticleInput) => {
    const now = new Date();
    const id = `kb-${now.getTime()}`;

    setKnowledgeArticles((previous) => [
      {
        id,
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
      },
      ...previous,
    ]);

    return { id };
  }, []);

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
  }, []);

  const deleteKnowledge = useCallback((id: string) => {
    setKnowledgeArticles((previous) => previous.filter((article) => article.id !== id));
  }, []);

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
