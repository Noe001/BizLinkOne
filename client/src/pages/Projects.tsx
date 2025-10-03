import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, Plus, Search, Filter, Calendar, BarChart3, CheckSquare, Clock, Users, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { GanttChart } from "@/components/GanttChart";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { TaskCard, type TaskStatus } from "@/components/TaskCard";
import { addDays, formatDistanceToNow } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";
import { projectDetailSeeds, projectTaskSeeds, type ProjectDetailSeed, type ProjectTaskSeed } from "@/data/projects/seeds";
import { sampleParticipants } from "@/data/sampleWorkspace";

const referenceDate = new Date();

interface LocalisedProject {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed";
  statusLabel: string;
  progress: number;
  startDate: Date;
  endDate: Date;
  manager?: {
    id: string;
    name: string;
    avatar?: string;
  };
  teamSize: number;
  taskCount: number;
  completedTasks: number;
  milestones: Array<{
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
  }>;
}

interface LocalisedTimelineTask {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function Projects() {
  const { t, language } = useTranslation();
  const locale = language === "ja" ? jaLocale : undefined;

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const participantMap = useMemo(() => new Map(sampleParticipants.map((member) => [member.id, member])), []);

  const projects = useMemo<LocalisedProject[]>(() => {
    return projectDetailSeeds.map((seed: ProjectDetailSeed) => {
      const manager = participantMap.get(seed.managerId);
      return {
        id: seed.id,
        name: t(seed.nameKey),
        description: t(seed.descriptionKey),
        status: seed.status,
        statusLabel: t(`projects.status.${seed.status}`),
        progress: seed.progress,
        startDate: addDays(referenceDate, seed.startInDays),
        endDate: addDays(referenceDate, seed.endInDays),
        manager,
        teamSize: seed.teamSize,
        taskCount: seed.taskCount,
        completedTasks: seed.completedTasks,
  milestones: seed.milestones.map((milestone) => ({
          id: milestone.id,
          title: t(milestone.titleKey),
          dueDate: addDays(referenceDate, milestone.dueInDays),
          completed: milestone.completed,
        })),
      };
    });
  }, [t, participantMap]);

  const projectMap = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);

  const timelineTasks = useMemo<LocalisedTimelineTask[]>(() => {
    return projectTaskSeeds.map((seed: ProjectTaskSeed) => {
      const project = projectMap.get(seed.projectId);
      const assignee = seed.assigneeId ? participantMap.get(seed.assigneeId) : undefined;

      return {
        id: seed.id,
        projectId: seed.projectId,
        projectName: project?.name ?? seed.projectId,
        title: t(seed.titleKey),
        startDate: addDays(referenceDate, seed.startInDays),
        endDate: addDays(referenceDate, seed.endInDays),
        progress: seed.progress,
        status: seed.status,
        priority: seed.priority,
        assignee,
      };
    });
  }, [t, projectMap, participantMap]);

  const filteredProjects = useMemo(() => {
    const normalisedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        normalisedSearch.length === 0 ||
        project.name.toLowerCase().includes(normalisedSearch) ||
        project.description.toLowerCase().includes(normalisedSearch);

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const statusOptionLabels = useMemo(() => ({
    all: t("projects.filters.status.options.all"),
    planning: t("projects.filters.status.options.planning"),
    active: t("projects.filters.status.options.active"),
    "on-hold": t("projects.filters.status.options.onHold"),
    completed: t("projects.filters.status.options.completed"),
  }), [t]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const totalTasks = projects.reduce((sum, project) => sum + project.taskCount, 0);
  const completedTasks = projects.reduce((sum, project) => sum + project.completedTasks, 0);
  const totalTeamMembers = projects.reduce((sum, project) => sum + project.teamSize, 0);

  const upcomingMilestones = useMemo(() => {
    return projects
      .flatMap((project) =>
        project.milestones.map((milestone) => ({
          projectId: project.id,
          projectName: project.name,
          title: milestone.title,
          dueDate: milestone.dueDate,
          completed: milestone.completed,
        }))
      )
      .filter((milestone) => !milestone.completed)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [projects]);

  const projectTasks = useMemo(() => {
    if (!selectedProject) {
      return [] as LocalisedTimelineTask[];
    }

    return timelineTasks.filter((task) => task.projectId === selectedProject);
  }, [selectedProject, timelineTasks]);

  const handleTaskClick = (taskId: string) => {
    console.log(t("projects.timeline.log.taskClick"), taskId);
  };

  const handleProjectCreate = (projectData: unknown) => {
    console.log(t("projects.create.log"), projectData);
  };

  return (
    <div className="page-container" data-testid="page-projects">
      <div className="page-header">
        <p className="text-muted-foreground max-w-3xl text-sm sm:text-base">{t("projects.header.description")}</p>
        <Button data-testid="button-new-project" onClick={() => setCreateModalOpen(true)} className="h-9 sm:h-10 touch-manipulation">
          <Plus className="h-4 w-4 mr-2" />
          {t("projects.actions.new")}
        </Button>
      </div>

      <div className="page-header sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-[12rem] sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("projects.filters.searchPlaceholder")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("projects.filters.status.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{statusOptionLabels.all}</SelectItem>
            <SelectItem value="planning">{statusOptionLabels.planning}</SelectItem>
            <SelectItem value="active">{statusOptionLabels.active}</SelectItem>
            <SelectItem value="on-hold">{statusOptionLabels["on-hold"]}</SelectItem>
            <SelectItem value="completed">{statusOptionLabels.completed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto rounded-full bg-card/80 p-1 shadow-sm sm:bg-transparent sm:p-0 sm:shadow-none">
        <TabsList className="grid w-full min-w-[20rem] grid-cols-2 gap-1 sm:min-w-0 sm:flex sm:w-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm rounded-full px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">{t("projects.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs sm:text-sm rounded-full px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">{t("projects.tabs.timeline")}</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm rounded-full px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">{t("projects.tabs.tasks")}</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm rounded-full px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">{t("projects.tabs.analytics")}</TabsTrigger>
        </TabsList>
      </div>


        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("projects.overview.stats.total.title")}</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {t("projects.overview.stats.total.delta", { value: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("projects.overview.stats.active.title")}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">{t("projects.overview.stats.active.hint")}</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("projects.overview.stats.tasks.title")}</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {t("projects.overview.stats.tasks.hint", { completed: completedTasks })}
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("projects.overview.stats.team.title")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTeamMembers}</div>
                <p className="text-xs text-muted-foreground">{t("projects.overview.stats.team.hint")}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
                  selectedProject === project.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedProject(project.id)}
                role="button"
                aria-label={t("projects.overview.project.select", { name: project.name })}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project.id);
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </div>
                    <Badge className={
                      project.status === "active"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : project.status === "planning"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                        : project.status === "on-hold"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }>
                      {project.statusLabel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("projects.overview.project.progress")}</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          project.progress >= 80
                            ? "bg-green-500 dark:bg-green-600"
                            : project.progress >= 60
                            ? "bg-blue-500 dark:bg-blue-600"
                            : project.progress >= 40
                            ? "bg-yellow-500 dark:bg-yellow-600"
                            : "bg-red-500 dark:bg-red-600"
                        }`}
                        style={{ width: `${project.progress}%` }}
                        role="progressbar"
                        aria-valuenow={project.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{t("projects.overview.project.team", { count: project.teamSize })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{t("projects.overview.project.tasks", { total: project.taskCount, completed: project.completedTasks })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{t("projects.overview.project.timeline", {
                        start: formatDistanceToNow(project.startDate, { addSuffix: true, locale }),
                        end: formatDistanceToNow(project.endDate, { addSuffix: true, locale }),
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{t("projects.overview.project.milestones", { total: project.milestones.length })}</span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t("projects.overview.project.upcoming")}</span>
                      <span>{t("projects.overview.project.completed", {
                        completed: project.milestones.filter((milestone) => milestone.completed).length,
                        total: project.milestones.length,
                      })}</span>
                    </div>
                    <div className="space-y-1">
                      {project.milestones.slice(0, 2).map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between text-xs">
                          <span className="truncate" title={milestone.title}>
                            {milestone.title}
                          </span>
                          <span className="text-muted-foreground">
                            {milestone.completed
                              ? t("projects.overview.project.milestoneCompleted")
                              : formatDistanceToNow(milestone.dueDate, { addSuffix: true, locale })}
                          </span>
                        </div>
                      ))}
                    </div>
                    {project.milestones.some((milestone) => !milestone.completed && milestone.dueDate < new Date()) && (
                      <div className="flex items-center gap-2 text-xs text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        {t("projects.overview.project.milestoneWarning")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <div className="rounded-lg border border-card-border bg-card p-2 sm:p-4 shadow-sm">
            <div className="overflow-x-auto">
              <GanttChart
                tasks={timelineTasks.map((task) => ({
                  id: task.id,
                  title: task.title,
                  startDate: task.startDate,
                  endDate: task.endDate,
                  progress: task.progress,
                  status: task.status,
                  assignee: task.assignee,
                  project: task.projectName,
                  priority: task.priority,
                }))}
                onTaskClick={handleTaskClick}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {selectedProject ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {t("projects.tasks.heading", { project: projectMap.get(selectedProject)?.name ?? "" })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={t("projects.tasks.progress", { value: task.progress })}
                    status={task.status as TaskStatus}
                    priority={task.priority}
                    assignee={task.assignee}
                    dueDate={task.endDate}
                    onClick={() => handleTaskClick(task.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("projects.tasks.empty")}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t("projects.analytics.progress.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={`progress-${project.id}`} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{project.name}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            project.progress >= 80
                              ? "bg-green-500"
                              : project.progress >= 60
                              ? "bg-blue-500"
                              : project.progress >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t("projects.analytics.milestones.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingMilestones.slice(0, 5).map((milestone) => (
                    <div key={milestone.title + milestone.projectId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{milestone.title}</div>
                        <div className="text-xs text-muted-foreground">{milestone.projectName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatDistanceToNow(milestone.dueDate, { addSuffix: true, locale })}
                        </div>
                        <Badge
                          variant={milestone.dueDate < new Date() ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {milestone.dueDate < new Date()
                            ? t("projects.analytics.milestones.overdue")
                            : t("projects.analytics.milestones.upcoming")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreate={handleProjectCreate}
      />
    </div>
  );
}
