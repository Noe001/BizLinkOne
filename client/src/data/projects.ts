export interface ProjectSeed {
  id: string;
  nameKey: string;
  descriptionKey: string;
  status: "planning" | "active" | "on-hold" | "completed";
  progress: number;
  teamSize: number;
  taskCount: number;
  completedTasks: number;
}

export const sampleProjects: ProjectSeed[] = [
  {
    id: "proj-1",
    nameKey: "dashboard.projects.core.name",
    descriptionKey: "dashboard.projects.core.description",
    status: "active",
    progress: 65,
    teamSize: 4,
    taskCount: 12,
    completedTasks: 8,
  },
  {
    id: "proj-2",
    nameKey: "dashboard.projects.frontend.name",
    descriptionKey: "dashboard.projects.frontend.description",
    status: "active",
    progress: 45,
    teamSize: 3,
    taskCount: 8,
    completedTasks: 3,
  },
  {
    id: "proj-3",
    nameKey: "dashboard.projects.documentation.name",
    descriptionKey: "dashboard.projects.documentation.description",
    status: "planning",
    progress: 15,
    teamSize: 2,
    taskCount: 6,
    completedTasks: 1,
  },
];

export interface DashboardSummary {
  chatsDelta: number;
  tasksDueToday: number;
  projectsOnTrack: number;
  knowledgeThisWeek: number;
  meetingsNextInHours: number;
}

export const dashboardSummary: DashboardSummary = {
  chatsDelta: 2,
  tasksDueToday: 3,
  projectsOnTrack: 2,
  knowledgeThisWeek: 1,
  meetingsNextInHours: 2,
};

// NOTE: Detailed project & task seeds relocated to data/projects/seeds.ts
export * from "./projects";
