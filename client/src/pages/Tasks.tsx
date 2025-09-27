import { useMemo, useState } from "react";
import { addDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Filter } from "lucide-react";
import { TaskCard, type TaskStatus, type TaskPriority } from "@/components/TaskCard";
import { NewTaskModal, type NewTaskData } from "@/components/NewTaskModal";
import { TaskDetailModal, type TaskDetailData } from "@/components/TaskDetailModal";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  createSampleTasksData,
  hydrateTaskForList,
  hydrateTaskDetail,
  type TaskSeed,
  type TaskDetailSeed,
  type TaskStateLike,
} from "@/data/tasks";

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
  tags?: string[];
  estimatedHours?: number;
}

const referenceDate = new Date();
const sampleData = createSampleTasksData(referenceDate);
const seedMap = new Map<string, TaskSeed>(sampleData.seeds.map((seed) => [seed.id, seed]));
const detailMap = sampleData.details as Record<string, TaskDetailSeed | undefined>;

const initializeState = (): TaskStateLike[] => {
  return sampleData.seeds.map((seed) => ({
    id: seed.id,
    title: seed.title,
    description: seed.description,
    status: seed.status,
    priority: seed.priority,
    assigneeId: seed.assigneeId,
    dueDate: seed.dueInDays !== undefined ? addDays(referenceDate, seed.dueInDays) : undefined,
    relatedChatId: seed.relatedChatId,
    relatedMeetingId: seed.relatedMeetingId,
    tags: seed.tags,
    estimatedHours: seed.estimatedHours,
    createdAt: addDays(referenceDate, -7),
    updatedAt: referenceDate,
  }));
};

export default function Tasks() {
  const { t } = useTranslation();

  const [taskStates, setTaskStates] = useState<TaskStateLike[]>(initializeState);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskDetailData | null>(null);

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

  const hydratedTasks = useMemo(() => {
    return taskStates.map((task) => hydrateTaskForList({ task, translate: t }));
  }, [taskStates, t]);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return hydratedTasks.filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) {
        return false;
      }

      if (filterPriority !== "all" && task.priority !== filterPriority) {
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
  }, [hydratedTasks, filterStatus, filterPriority, searchQuery]);

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

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTaskStates((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date() } : task))
    );
  };

  const handleTaskClick = (taskId: string) => {
    const overrides = taskStates.find((task) => task.id === taskId);
    if (!overrides) {
      return;
    }

    const seed = seedMap.get(taskId);
    const extras = detailMap[taskId];
    const detail = hydrateTaskDetail({
      seed,
      overrides,
      extras,
      translate: t,
      referenceDate,
    });

    setSelectedTaskId(taskId);
    setSelectedTask(detail);
  };

  const handleCreateTask = (data: NewTaskData) => {
    const id = `task-${Date.now()}`;
    const newTask: TaskStateLike = {
      id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate,
      tags: data.tags,
      relatedChatId: data.relatedChatId,
      estimatedHours: data.estimatedHours,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTaskStates((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<TaskDetailData>) => {
    const now = new Date();

    setTaskStates((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          title: updates.title ?? task.title,
          description: updates.description ?? task.description,
          status: (updates.status as TaskStatus | undefined) ?? task.status,
          priority: (updates.priority as TaskPriority | undefined) ?? task.priority,
          assigneeId: updates.assignee?.id ?? task.assigneeId,
          dueDate: updates.dueDate ?? task.dueDate,
          tags: updates.tags ?? task.tags,
          estimatedHours: updates.estimatedHours ?? task.estimatedHours,
          actualHours: updates.actualHours ?? task.actualHours,
          subtasks: updates.subtasks ?? task.subtasks,
          comments: updates.comments ?? task.comments,
          timeEntries: updates.timeEntries ?? task.timeEntries,
          updatedAt: now,
        } satisfies TaskStateLike;
      })
    );

    setSelectedTask((current) => {
      if (!current || current.id !== taskId) {
        return current;
      }

      return {
        ...current,
        ...updates,
        assignee: updates.assignee ?? current.assignee,
        tags: updates.tags ?? current.tags,
        comments: updates.comments ?? current.comments,
        subtasks: updates.subtasks ?? current.subtasks,
        timeEntries: updates.timeEntries ?? current.timeEntries,
        status: (updates.status as TaskStatus | undefined) ?? current.status,
        priority: (updates.priority as TaskPriority | undefined) ?? current.priority,
        dueDate: updates.dueDate ?? current.dueDate,
        estimatedHours: updates.estimatedHours ?? current.estimatedHours,
        actualHours: updates.actualHours ?? current.actualHours,
        updatedAt: now,
      };
    });
  };

  const handleTaskDelete = (taskId: string) => {
    setTaskStates((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTaskId(null);
    setSelectedTask(null);
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
    setSearchQuery("");
  };

  const totalTasks = hydratedTasks.length;
  const visibleTasks = filteredTasks.length;

  return (
    <div className="p-6" data-testid="page-tasks">
      {/* ラップを追加し space-y-6 の対象要素からカンバン部を分離 */}
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

              {(filterStatus !== "all" || filterPriority !== "all" || searchQuery) && (
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")}
            data-testid="button-view-mode"
            className="h-8"
          >
            {viewMode === "kanban" ? t("tasks.viewModes.list") : t("tasks.viewModes.kanban")}
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1" data-testid="kanban-board">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            return (
              <Card key={column.id} className="h-fit">
                <CardHeader className="pb-3">
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
      ) : (
        <div className="space-y-4" data-testid="task-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onStatusChange={handleStatusChange}
              onClick={handleTaskClick}
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

      <NewTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTaskCreate={handleCreateTask}
      />

      <TaskDetailModal
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTaskId(null);
            setSelectedTask(null);
          }
        }}
        task={selectedTask}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
}
