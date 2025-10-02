import { addDays, differenceInHours, subDays } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Filter } from "lucide-react";
import { GanttChart } from "@/components/GanttChart";
import { TaskCard, type TaskStatus, type TaskPriority } from "@/components/TaskCard";
import { NewTaskModal, type NewTaskData } from "@/components/NewTaskModal";
import { TaskDetailModal, type TaskDetailData } from "@/components/TaskDetailModal";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useTranslation } from "@/contexts/LanguageContext";
import { hydrateTaskForList, hydrateTaskDetail } from "@/data/tasks";
import { projectDetailSeeds } from "@/data/projects/seeds";
import { useWorkspaceData } from "@/contexts/WorkspaceDataContext";
import { useNotifications } from "@/components/NotificationPanel";
import { toast } from "@/hooks/use-toast";

interface TaskListItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  relatedChatId?: string;
  relatedMeetingId?: string;
  projectId?: string;
  projectName?: string;
  tags?: string[];
  estimatedHours?: number;
}

export default function Tasks() {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const notifiedTaskIdsRef = useRef(new Set<string>());

  const {
    tasks: taskStates,
    createTask: createWorkspaceTask,
    updateTask: updateWorkspaceTask,
    deleteTask: deleteWorkspaceTask,
    referenceDate,
    getParticipantById,
  } = useWorkspaceData();
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "gantt">("kanban");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

  const statusOptionLabels = useMemo(
    () => ({
      all: t("tasks.filters.status.options.all"),
      todo: t("tasks.filters.status.options.todo"),
      "in-progress": t("tasks.filters.status.options.inProgress"),
      review: t("tasks.filters.status.options.review"),
      done: t("tasks.filters.status.options.done"),
    }),
    [t]
  );

  const priorityOptionLabels = useMemo(
    () => ({
      all: t("tasks.filters.priority.options.all"),
      urgent: t("tasks.filters.priority.options.urgent"),
      high: t("tasks.filters.priority.options.high"),
      medium: t("tasks.filters.priority.options.medium"),
      low: t("tasks.filters.priority.options.low"),
    }),
    [t]
  );

  const projectOptions = useMemo(() => {
    return [
      { id: "all", name: t("tasks.filters.project.options.all") },
      ...projectDetailSeeds.map((seed) => ({ id: seed.id, name: t(seed.nameKey) })),
    ];
  }, [t]);

  const projectNameMap = useMemo(() => {
    const map = new Map<string, string>();
    projectDetailSeeds.forEach((seed) => {
      map.set(seed.id, t(seed.nameKey));
    });
    return map;
  }, [t]);

  const hydratedTasks = useMemo(() => {
    return taskStates.map((task) => {
      const hydrated = hydrateTaskForList({ task, translate: t });
      return {
        ...hydrated,
        projectId: task.projectId,
        projectName: task.projectId ? projectNameMap.get(task.projectId) ?? task.projectId : undefined,
      };
    });
  }, [taskStates, t, projectNameMap]);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return hydratedTasks.filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) {
        return false;
      }

      if (filterPriority !== "all" && task.priority !== filterPriority) {
        return false;
      }

      if (projectFilter !== "all" && task.projectId !== projectFilter) {
        return false;
      }

      if (normalizedQuery) {
        const values = [
          task.title,
          task.description ?? "",
          task.assignee?.name ?? "",
          ...(task.tags ?? []),
        ];

        const matches = values.some((value) => value.toLowerCase().includes(normalizedQuery));
        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }, [hydratedTasks, filterStatus, filterPriority, projectFilter, searchQuery]);

  const statusColumns = useMemo(
    () => [
      { id: "todo", title: t("tasks.kanban.columns.todo"), status: "todo" as TaskStatus },
      { id: "in-progress", title: t("tasks.kanban.columns.inProgress"), status: "in-progress" as TaskStatus },
      { id: "review", title: t("tasks.kanban.columns.review"), status: "review" as TaskStatus },
      { id: "done", title: t("tasks.kanban.columns.done"), status: "done" as TaskStatus },
    ],
    [t]
  );

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };
  const ganttTasks = useMemo(() => {
    return filteredTasks.map((task) => {
      const endDate = task.dueDate ?? addDays(referenceDate, 1);
      const startDate = task.dueDate ? subDays(task.dueDate, 3) : addDays(referenceDate, -1);
      const progressByStatus: Record<TaskStatus, number> = {
        todo: 15,
        'in-progress': 55,
        review: 80,
        done: 100,
      };

      return {
        id: task.id,
        title: task.title,
        startDate,
        endDate,
        progress: progressByStatus[task.status],
        status: task.status,
        assignee: task.assignee,
        project: task.projectName ?? t("tasks.gantt.unknownProject"),
        priority: task.priority,
      };
    });
  }, [filteredTasks, referenceDate, t]);
  useEffect(() => {
    const now = new Date();
    taskStates.forEach((task) => {
      if (!task.dueDate || task.status === "done") {
        if (notifiedTaskIdsRef.current.has(task.id)) {
          notifiedTaskIdsRef.current.delete(task.id);
        }
        return;
      }
      const hoursUntilDue = differenceInHours(task.dueDate, now);
      if (hoursUntilDue <= 24 && hoursUntilDue >= 0 && !notifiedTaskIdsRef.current.has(task.id)) {
        const assignee = task.assigneeId ? getParticipantById(task.assigneeId) : undefined;
        const taskTitle = task.title ?? t("tasks.notifications.dueSoon.fallbackTitle");
        addNotification({
          type: "task",
          title: t("tasks.notifications.dueSoon.title", { title: taskTitle }),
          message: t("tasks.notifications.dueSoon.message", { title: taskTitle, hours: Math.max(1, Math.round(hoursUntilDue)) }),
          actionUrl: "/tasks",
          sourceId: task.id,
          ...(assignee ? { sourceName: assignee.name } : {}),
        });
        notifiedTaskIdsRef.current.add(task.id);
      }
      if (hoursUntilDue < 0 && notifiedTaskIdsRef.current.has(task.id)) {
        notifiedTaskIdsRef.current.delete(task.id);
      }
    });
  }, [taskStates, addNotification, t, getParticipantById]);



  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateWorkspaceTask(taskId, { status: newStatus });
  };

  const handleTaskClick = (taskId: string) => {
    const exists = taskStates.some((task) => task.id === taskId);
    if (!exists) {
      return;
    }

    setSelectedTaskId(taskId);
  };

  const handleCreateTask = (data: NewTaskData) => {
    createWorkspaceTask({
      ...data,
      origin: { source: "manual" },
    });
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<TaskDetailData>) => {
    updateWorkspaceTask(taskId, updates);
  };

  const handleTaskDelete = (taskId: string) => {
    const task = taskStates.find((t) => t.id === taskId);
    if (task) {
      setTaskToDelete({ id: taskId, title: task.title ?? taskId });
      setDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteWorkspaceTask(taskToDelete.id);
      setSelectedTaskId((current) => (current === taskToDelete.id ? null : current));
      toast({
        title: t("tasks.notifications.deleted.title"),
        description: t("tasks.notifications.deleted.message", { title: taskToDelete.title }),
      });
      setTaskToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleTaskEdit = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleTaskDuplicate = (taskId: string) => {
    const task = taskStates.find((t) => t.id === taskId);
    if (task) {
      createWorkspaceTask({
        title: `${task.title} (Copy)`,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
        projectId: task.projectId,
        relatedChatId: task.relatedChatId,
        relatedMeetingId: task.relatedMeetingId,
        tags: task.tags || [],
        estimatedHours: task.estimatedHours,
        origin: { source: "manual" },
      });
      toast({
        title: t("tasks.notifications.duplicated.title"),
        description: t("tasks.notifications.duplicated.message"),
      });
    }
  };

  const handleTaskArchive = (taskId: string) => {
    // TODO: Implement archive functionality
    toast({
      title: t("tasks.notifications.archived.title"),
      description: t("tasks.notifications.archived.message"),
    });
  };

  const handleTaskShare = (taskId: string) => {
    // TODO: Implement share functionality
    toast({
      title: t("tasks.notifications.shared.title"),
      description: t("tasks.notifications.shared.message"),
    });
  };

  const handleToggleFavorite = (taskId: string) => {
    // TODO: Implement favorite functionality
    toast({
      title: t("tasks.notifications.favorited.title"),
      description: t("tasks.notifications.favorited.message"),
    });
  };

  const selectedTaskState = useMemo(() => {
    if (!selectedTaskId) {
      return null;
    }

    return taskStates.find((task) => task.id === selectedTaskId) ?? null;
  }, [taskStates, selectedTaskId]);

  const selectedTaskDetail = useMemo(() => {
    if (!selectedTaskState) {
      return null;
    }

    return hydrateTaskDetail({
      seed: undefined,
      overrides: selectedTaskState,
      extras: undefined,
      translate: t,
      referenceDate,
    });
  }, [selectedTaskState, t, referenceDate]);

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
    setProjectFilter("all");
    setSearchQuery("");
  };

  const totalTasks = hydratedTasks.length;
  const visibleTasks = filteredTasks.length;

  return (
    <div className="p-6" data-testid="page-tasks">
      {/* ラチEEを追加ぁEspace-y-6 の対象要素からカンバン部をE離 */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground">{t("tasks.header.description")}</p>
        <Button data-testid="button-new-task" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("tasks.actions.new")}
        </Button>
        </div>

        <Card>
          <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              {t("tasks.filters.title")}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-3 w-3" />
                <Input
                  className="pl-7 h-8 w-full sm:w-64 md:w-80"
                  placeholder={t("tasks.filters.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  data-testid="tasks-search"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-32 h-8" data-testid="filter-status">
                  <SelectValue placeholder={t("tasks.filters.status.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{statusOptionLabels.all}</SelectItem>
                  <SelectItem value="todo">{statusOptionLabels.todo}</SelectItem>
                  <SelectItem value="in-progress">{statusOptionLabels["in-progress"]}</SelectItem>
                  <SelectItem value="review">{statusOptionLabels.review}</SelectItem>
                  <SelectItem value="done">{statusOptionLabels.done}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-28 h-8" data-testid="filter-priority">
                  <SelectValue placeholder={t("tasks.filters.priority.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{priorityOptionLabels.all}</SelectItem>
                  <SelectItem value="urgent">{priorityOptionLabels.urgent}</SelectItem>
                  <SelectItem value="high">{priorityOptionLabels.high}</SelectItem>
                  <SelectItem value="medium">{priorityOptionLabels.medium}</SelectItem>
                  <SelectItem value="low">{priorityOptionLabels.low}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-full sm:w-40 h-8" data-testid="filter-project">
                  <SelectValue placeholder={t("tasks.filters.project.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterStatus !== "all" || filterPriority !== "all" || projectFilter !== "all" || searchQuery) && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="h-8 px-2">
                  {t("tasks.filters.clear")}
                </Button>
              )}
            </div>
          </div>

          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t("tasks.stats.showing", { count: visibleTasks, total: totalTasks })}
          </p>
          <div className="flex items-center gap-2">
            {(['kanban', 'list', 'gantt'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(mode)}
                data-testid={'tasks-view-' + mode}
                className="h-8"
              >
                {t('tasks.viewModes.' + mode)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1" data-testid="kanban-board">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            return (
              <Card key={column.id} className="h-fit transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">{columnTasks.length}</div>
                      <span className="text-sm font-medium">{column.title}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      {...task}
                      onStatusChange={handleStatusChange}
                      onClick={handleTaskClick}
                      onEdit={handleTaskEdit}
                      onDelete={handleTaskDelete}
                      onDuplicate={handleTaskDuplicate}
                      onArchive={handleTaskArchive}
                      onShare={handleTaskShare}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      {t("tasks.empty.column")}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-4" data-testid="task-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onStatusChange={handleStatusChange}
              onClick={handleTaskClick}
              onEdit={handleTaskEdit}
              onDelete={handleTaskDelete}
              onDuplicate={handleTaskDuplicate}
              onArchive={handleTaskArchive}
              onShare={handleTaskShare}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
          {filteredTasks.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">{t("tasks.empty.list")}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {viewMode === "gantt" && (
        
            <GanttChart tasks={ganttTasks} onTaskClick={handleTaskClick} />
          
      )}

      <NewTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTaskCreate={handleCreateTask}
      />

      <TaskDetailModal
        open={Boolean(selectedTaskDetail)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTaskId(null);
          }
        }}
        task={selectedTaskDetail}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />

      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        itemType="task"
        itemName={taskToDelete?.title}
      />
    </div>
  );
}




