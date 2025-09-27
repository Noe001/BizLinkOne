import { addDays } from "date-fns";

// Type aliases for clarity
export type LocalizedKey = string;

export interface ProjectMilestoneSeed {
  id: string;
  titleKey: LocalizedKey;
  dueInDays: number;
  completed: boolean;
}

export interface ProjectDetailSeed {
  id: string;
  nameKey: LocalizedKey;
  descriptionKey: LocalizedKey;
  status: "planning" | "active" | "on-hold" | "completed";
  progress: number;
  startInDays: number;
  endInDays: number;
  managerId: string;
  teamSize: number;
  taskCount: number;
  completedTasks: number;
  healthKey: LocalizedKey;
  milestones: ProjectMilestoneSeed[];
}

export interface ProjectTaskSeed {
  id: string;
  projectId: string;
  titleKey: LocalizedKey;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  progress: number;
  assigneeId?: string;
  startInDays: number;
  endInDays: number;
}

export const projectDetailSeeds: ProjectDetailSeed[] = [
  {
    id: "proj-1",
    nameKey: "projects.samples.core.name",
    descriptionKey: "projects.samples.core.description",
    status: "active",
    progress: 68,
    startInDays: -45,
    endInDays: 40,
    managerId: "john-doe",
    teamSize: 6,
    taskCount: 18,
    completedTasks: 11,
    healthKey: "projects.samples.core.health",
    milestones: [
      { id: "core-m1", titleKey: "projects.samples.core.milestones.auth", dueInDays: -20, completed: true },
      { id: "core-m2", titleKey: "projects.samples.core.milestones.database", dueInDays: -5, completed: false },
      { id: "core-m3", titleKey: "projects.samples.core.milestones.api", dueInDays: 14, completed: false },
    ],
  },
  {
    id: "proj-2",
    nameKey: "projects.samples.frontend.name",
    descriptionKey: "projects.samples.frontend.description",
    status: "active",
    progress: 52,
    startInDays: -30,
    endInDays: 55,
    managerId: "mike-johnson",
    teamSize: 5,
    taskCount: 14,
    completedTasks: 6,
    healthKey: "projects.samples.frontend.health",
    milestones: [
      { id: "fe-m1", titleKey: "projects.samples.frontend.milestones.library", dueInDays: -10, completed: false },
      { id: "fe-m2", titleKey: "projects.samples.frontend.milestones.responsive", dueInDays: 7, completed: false },
      { id: "fe-m3", titleKey: "projects.samples.frontend.milestones.accessibility", dueInDays: 28, completed: false },
    ],
  },
  {
    id: "proj-3",
    nameKey: "projects.samples.documentation.name",
    descriptionKey: "projects.samples.documentation.description",
    status: "planning",
    progress: 22,
    startInDays: -14,
    endInDays: 70,
    managerId: "alice-cooper",
    teamSize: 3,
    taskCount: 9,
    completedTasks: 2,
    healthKey: "projects.samples.documentation.health",
    milestones: [
      { id: "doc-m1", titleKey: "projects.samples.documentation.milestones.api", dueInDays: 10, completed: false },
      { id: "doc-m2", titleKey: "projects.samples.documentation.milestones.userGuide", dueInDays: 32, completed: false },
      { id: "doc-m3", titleKey: "projects.samples.documentation.milestones.review", dueInDays: 55, completed: false },
    ],
  },
];

export const projectTaskSeeds: ProjectTaskSeed[] = [
  {
    id: "proj-1-task-1",
    projectId: "proj-1",
    titleKey: "projects.samples.tasks.core.auth",
    status: "in-progress",
    priority: "high",
    progress: 70,
    assigneeId: "john-doe",
    startInDays: -7,
    endInDays: 2,
  },
  {
    id: "proj-1-task-2",
    projectId: "proj-1",
    titleKey: "projects.samples.tasks.core.database",
    status: "todo",
    priority: "urgent",
    progress: 20,
    assigneeId: "sarah-wilson",
    startInDays: -2,
    endInDays: 8,
  },
  {
    id: "proj-1-task-3",
    projectId: "proj-1",
    titleKey: "projects.samples.tasks.core.monitoring",
    status: "review",
    priority: "medium",
    progress: 55,
    assigneeId: "alice-cooper",
    startInDays: -5,
    endInDays: 5,
  },
  {
    id: "proj-2-task-1",
    projectId: "proj-2",
    titleKey: "projects.samples.tasks.frontend.library",
    status: "review",
    priority: "medium",
    progress: 82,
    assigneeId: "mike-johnson",
    startInDays: -6,
    endInDays: 1,
  },
  {
    id: "proj-2-task-2",
    projectId: "proj-2",
    titleKey: "projects.samples.tasks.frontend.a11y",
    status: "in-progress",
    priority: "high",
    progress: 48,
    assigneeId: "bob-smith",
    startInDays: -1,
    endInDays: 6,
  },
  {
    id: "proj-2-task-3",
    projectId: "proj-2",
    titleKey: "projects.samples.tasks.frontend.docs",
    status: "todo",
    priority: "medium",
    progress: 10,
    assigneeId: "sarah-wilson",
    startInDays: 4,
    endInDays: 12,
  },
  {
    id: "proj-3-task-1",
    projectId: "proj-3",
    titleKey: "projects.samples.tasks.documentation.outline",
    status: "in-progress",
    priority: "medium",
    progress: 35,
    assigneeId: "alice-cooper",
    startInDays: -3,
    endInDays: 4,
  },
  {
    id: "proj-3-task-2",
    projectId: "proj-3",
    titleKey: "projects.samples.tasks.documentation.guides",
    status: "todo",
    priority: "low",
    progress: 5,
    assigneeId: "emily-chen",
    startInDays: 6,
    endInDays: 16,
  },
  {
    id: "proj-3-task-3",
    projectId: "proj-3",
    titleKey: "projects.samples.tasks.documentation.review",
    status: "todo",
    priority: "medium",
    progress: 0,
    startInDays: 20,
    endInDays: 35,
  },
];

// Helper to produce concrete dates if needed externally
export const referenceDate = new Date();
export function resolveProjectDates<T extends { startInDays: number; endInDays: number }>(items: T[]) {
  return items.map(item => ({
    ...item,
    startDate: addDays(referenceDate, item.startInDays),
    endDate: addDays(referenceDate, item.endInDays),
  }));
}
