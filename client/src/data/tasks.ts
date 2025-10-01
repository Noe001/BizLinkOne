import { addDays, subDays } from "date-fns";
import type { TaskPriority, TaskStatus } from "@/components/TaskCard";
import type { TaskDetailData } from "@/components/TaskDetailModal";
import type { TranslationParams } from "@/contexts/LanguageContext";
import { sampleParticipants, sampleChannels } from "./sampleWorkspace";

interface TaskParticipantRef {
  id: string;
  name: string;
  email?: string;
  roleKey?: string;
  avatar?: string;
}

const participantMap = new Map(sampleParticipants.map((participant) => [participant.id, participant]));
const channelMap = new Map(sampleChannels.map((channel) => [channel.id, channel]));

export interface TaskSeed {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueInDays?: number;
  relatedChatId?: string;
  relatedMeetingId?: string;
  projectId?: string;
  tags?: string[];
  estimatedHours?: number;
}

interface SubtaskSeed {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}

interface CommentSeed {
  id: string;
  content: string;
  authorId: string;
  createdDaysAgo: number;
}

interface TimeEntrySeed {
  id: string;
  description: string;
  hours: number;
  userId: string;
  daysAgo: number;
}

export interface TaskDetailSeed {
  createdDaysAgo: number;
  updatedDaysAgo: number;
  actualHours?: number;
  subtasks?: SubtaskSeed[];
  comments?: CommentSeed[];
  timeEntries?: TimeEntrySeed[];
}

export interface SampleTaskData {
  seeds: TaskSeed[];
  details: Record<string, TaskDetailSeed>;
}

export const createSampleTasksData = (referenceDate = new Date()): SampleTaskData => {
  const seeds: TaskSeed[] = [
    {
      id: "task-1",
      title: "Implement authentication service",
      description: "Ship secure login, refresh tokens, and role-based access for the platform.",
      status: "in-progress",
      priority: "high",
      assigneeId: "john-doe",
      dueInDays: 3,
      relatedChatId: "development",
      projectId: "proj-1",
      tags: ["Backend", "Security"],
      estimatedHours: 8,
      relatedMeetingId: "meeting-2",
    },
    {
      id: "task-2",
      title: "Update API documentation",
      description: "Ensure the public docs reflect the new auth endpoints and webhooks.",
      status: "todo",
      priority: "medium",
      assigneeId: "sarah-wilson",
      dueInDays: 7,
      relatedChatId: "development",
      projectId: "proj-1",
      tags: ["Documentation", "API"],
      estimatedHours: 4,
    },
    {
      id: "task-3",
      title: "Fix responsive layout issues",
      description: "Improve mobile breakpoints for dashboard cards and chat.",
      status: "review",
      priority: "urgent",
      assigneeId: "mike-johnson",
      dueInDays: 1,
      relatedChatId: "design",
      projectId: "proj-2",
      tags: ["Frontend", "Mobile", "CSS"],
      estimatedHours: 6,
    },
    {
      id: "task-4",
      title: "Set up CI/CD pipeline",
      description: "Automate builds, testing, and staging deployments.",
      status: "todo",
      priority: "low",
      assigneeId: "alice-cooper",
      dueInDays: 14,
      projectId: "proj-2",
      tags: ["DevOps", "Automation"],
      estimatedHours: 12,
    },
    {
      id: "task-5",
      title: "Database optimisation",
      description: "Profile hotspots and introduce indexes for heavy queries.",
      status: "done",
      priority: "medium",
      assigneeId: "bob-smith",
      dueInDays: -2,
      projectId: "proj-3",
      tags: ["Database", "Performance"],
      estimatedHours: 5,
    },
    {
      id: "task-6",
      title: "Design onboarding flow",
      description: "Create an intuitive first-time experience for workspace owners.",
      status: "in-progress",
      priority: "high",
      assigneeId: "sarah-wilson",
      dueInDays: 5,
      relatedChatId: "product",
      projectId: "proj-3",
      tags: ["Frontend", "UX"],
      estimatedHours: 10,
    },
  ];

  const details: Record<string, TaskDetailSeed> = {
    "task-1": {
      createdDaysAgo: 12,
      updatedDaysAgo: 1,
      actualHours: 6.5,
      subtasks: [
        { id: "task-1-sub-1", title: "Audit existing sign-in flows", completed: true, assigneeId: "john-doe" },
        { id: "task-1-sub-2", title: "Create JWT issuance service", completed: false, assigneeId: "john-doe" },
        { id: "task-1-sub-3", title: "Add MFA toggle to settings", completed: false, assigneeId: "alice-cooper" },
      ],
      comments: [
        { id: "task-1-comment-1", content: "Let's reuse the encryption helper from the billing project.", authorId: "sarah-wilson", createdDaysAgo: 2 },
        { id: "task-1-comment-2", content: "I'll draft the migration plan for production roll-out.", authorId: "mike-johnson", createdDaysAgo: 1 },
      ],
      timeEntries: [
        { id: "task-1-time-1", description: "Discovery and API contract alignment", hours: 3.5, userId: "john-doe", daysAgo: 3 },
        { id: "task-1-time-2", description: "Implemented token refresh handler", hours: 2, userId: "john-doe", daysAgo: 1 },
      ],
    },
    "task-2": {
      createdDaysAgo: 20,
      updatedDaysAgo: 6,
      actualHours: 2.5,
      subtasks: [
        { id: "task-2-sub-1", title: "Review new endpoints", completed: false, assigneeId: "sarah-wilson" },
      ],
      comments: [
        { id: "task-2-comment-1", content: "Remember to include example payloads for error cases.", authorId: "john-doe", createdDaysAgo: 5 },
      ],
      timeEntries: [
        { id: "task-2-time-1", description: "Drafted authentication section updates", hours: 1.5, userId: "sarah-wilson", daysAgo: 7 },
      ],
    },
    "task-3": {
      createdDaysAgo: 8,
      updatedDaysAgo: 2,
      actualHours: 7,
      subtasks: [
        { id: "task-3-sub-1", title: "Test layouts on iPhone 13", completed: true, assigneeId: "mike-johnson" },
        { id: "task-3-sub-2", title: "Adjust flex behaviour for sidebar", completed: false, assigneeId: "sarah-wilson" },
      ],
      comments: [
        { id: "task-3-comment-1", content: "We should align the spacing scale with the design tokens.", authorId: "alice-cooper", createdDaysAgo: 2 },
      ],
      timeEntries: [
        { id: "task-3-time-1", description: "Refined grid utilities and media queries", hours: 4, userId: "mike-johnson", daysAgo: 2 },
      ],
    },
    "task-4": {
      createdDaysAgo: 30,
      updatedDaysAgo: 15,
      subtasks: [
        { id: "task-4-sub-1", title: "Define staging environment secrets", completed: false, assigneeId: "alice-cooper" },
      ],
      comments: [
        { id: "task-4-comment-1", content: "Linting step is failing due to outdated config; I'll patch it tomorrow.", authorId: "bob-smith", createdDaysAgo: 10 },
      ],
      timeEntries: [],
    },
    "task-5": {
      createdDaysAgo: 18,
      updatedDaysAgo: 3,
      actualHours: 5,
      subtasks: [],
      comments: [
        { id: "task-5-comment-1", content: "Added a ticket to monitor query timings after release.", authorId: "john-doe", createdDaysAgo: 4 },
      ],
      timeEntries: [
        { id: "task-5-time-1", description: "Indexed audit log table and ran benchmarks", hours: 5, userId: "bob-smith", daysAgo: 2 },
      ],
    },
    "task-6": {
      createdDaysAgo: 9,
      updatedDaysAgo: 1,
      actualHours: 4.5,
      subtasks: [
        { id: "task-6-sub-1", title: "Sketch welcome walkthrough", completed: true, assigneeId: "sarah-wilson" },
        { id: "task-6-sub-2", title: "Validate copy with marketing", completed: false, assigneeId: "mike-johnson" },
      ],
      comments: [
        { id: "task-6-comment-1", content: "Marketing provided updated screenshots for step two.", authorId: "john-doe", createdDaysAgo: 1 },
      ],
      timeEntries: [
        { id: "task-6-time-1", description: "Built prototype in Storybook", hours: 2.5, userId: "sarah-wilson", daysAgo: 1 },
      ],
    },
  };

  return { seeds, details };
};

export interface TaskStateLike {
  id: string;
  title?: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
  relatedChatId?: string;
  relatedMeetingId?: string;
  projectId?: string;
  tags?: string[];
  estimatedHours?: number;
  createdAt?: Date;
  updatedAt?: Date;
  actualHours?: number;
  subtasks?: TaskDetailData['subtasks'];
  comments?: TaskDetailData['comments'];
  timeEntries?: TaskDetailData['timeEntries'];
}

interface HydrateTaskParams {
  task: TaskStateLike;
  translate: (key: string, params?: TranslationParams) => string;
}

export const getParticipant = (id?: string): TaskParticipantRef | undefined => {
  return id ? participantMap.get(id) : undefined;
};

export const getChannelName = (id?: string, translate?: (key: string) => string): string | undefined => {
  if (!id || id === "none") return undefined;
  const channel = channelMap.get(id);
  if (!channel) return undefined;
  return channel.name;
};

export const hydrateTaskForList = ({ task, translate }: HydrateTaskParams) => {
  const assignee = getParticipant(task.assigneeId);

  return {
    id: task.id,
    title: task.title ?? "",
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: assignee ? { id: assignee.id, name: assignee.name, avatar: assignee.avatar } : undefined,
    dueDate: task.dueDate,
    relatedChatId: task.relatedChatId,
    relatedMeetingId: task.relatedMeetingId,
    projectId: task.projectId,
    tags: task.tags,
    estimatedHours: task.estimatedHours,
  };
};

interface HydrateTaskDetailParams {
  seed: TaskSeed | undefined;
  overrides: TaskStateLike;
  extras: TaskDetailSeed | undefined;
  translate: (key: string, params?: TranslationParams) => string;
  referenceDate: Date;
}

export const hydrateTaskDetail = ({ seed, overrides, extras, translate, referenceDate }: HydrateTaskDetailParams): TaskDetailData => {
  const assignee = getParticipant(overrides.assigneeId);

  const createdAt = overrides.createdAt ?? (extras ? subDays(referenceDate, extras.createdDaysAgo) : referenceDate);
  const updatedAt = overrides.updatedAt ?? (extras ? subDays(referenceDate, extras.updatedDaysAgo) : referenceDate);

  const fallbackSubtasks = extras?.subtasks?.map((subtask) => ({
    id: subtask.id,
    title: subtask.title,
    completed: subtask.completed,
    assigneeId: subtask.assigneeId,
  })) ?? [];

  const fallbackComments = extras?.comments?.map((comment) => {
    const participant = getParticipant(comment.authorId);
    return {
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      authorName: participant?.name ?? comment.authorId,
      authorAvatar: participant?.avatar,
      createdAt: subDays(referenceDate, comment.createdDaysAgo),
    };
  }) ?? [];

  const fallbackTimeEntries = extras?.timeEntries?.map((entry) => {
    const participant = getParticipant(entry.userId);
    return {
      id: entry.id,
      description: entry.description,
      hours: entry.hours,
      date: subDays(referenceDate, entry.daysAgo),
      userId: entry.userId,
      userName: participant?.name ?? entry.userId,
    };
  }) ?? [];

  const subtasks = overrides.subtasks ?? fallbackSubtasks;
  const comments = overrides.comments ?? fallbackComments;
  const timeEntries = overrides.timeEntries ?? fallbackTimeEntries;

  return {
    id: overrides.id,
    title: overrides.title ?? "",
    description: overrides.description,
    status: overrides.status,
    priority: overrides.priority,
    assignee: assignee
      ? { id: assignee.id, name: assignee.name, avatar: assignee.avatar }
      : undefined,
    dueDate: overrides.dueDate,
    relatedChatId: overrides.relatedChatId,
    relatedMeetingId: overrides.relatedMeetingId,
    projectId: overrides.projectId ?? seed?.projectId,
    tags: overrides.tags ?? [],
    createdAt,
    updatedAt,
    estimatedHours: overrides.estimatedHours ?? seed?.estimatedHours,
    actualHours: overrides.actualHours ?? extras?.actualHours,
    subtasks,
    comments,
    timeEntries,
  };
};

