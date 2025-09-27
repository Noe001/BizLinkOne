import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, ChevronLeft, ChevronRight, MoreHorizontal, Users, Clock, CheckSquare } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, isWithinInterval, differenceInDays } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";

interface GanttTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: "todo" | "in-progress" | "review" | "done";
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dependencies?: string[];
  project: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskClick?: (taskId: string) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void;
}

export function GanttChart({ tasks, onTaskClick, onTaskUpdate }: GanttChartProps) {
  const { t, language } = useTranslation();
  const locale = language === "ja" ? jaLocale : undefined;

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  const tasksByProject = useMemo(() => {
    const grouped: Record<string, GanttTask[]> = {};
    tasks.forEach((task) => {
      if (!grouped[task.project]) {
        grouped[task.project] = [];
      }
      grouped[task.project].push(task);
    });
    return grouped;
  }, [tasks]);

  const statusLabels: Record<GanttTask["status"], string> = {
    todo: t("projects.timeline.status.todo"),
    "in-progress": t("projects.timeline.status.inProgress"),
    review: t("projects.timeline.status.review"),
    done: t("projects.timeline.status.done"),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-200 text-gray-800";
      case "in-progress":
        return "bg-blue-200 text-blue-800";
      case "review":
        return "bg-yellow-200 text-yellow-800";
      case "done":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "border-l-gray-400";
      case "medium":
        return "border-l-yellow-400";
      case "high":
        return "border-l-orange-400";
      case "urgent":
        return "border-l-red-400";
      default:
        return "border-l-gray-400";
    }
  };

  const calculateTaskPosition = (task: GanttTask) => {
    if (
      !isWithinInterval(task.startDate, { start: weekStart, end: weekEnd }) &&
      !isWithinInterval(task.endDate, { start: weekStart, end: weekEnd }) &&
      !isWithinInterval(weekStart, { start: task.startDate, end: task.endDate })
    ) {
      return null;
    }

    const startOffset = Math.max(0, differenceInDays(task.startDate, weekStart));
    const endOffset = Math.min(6, differenceInDays(task.endDate, weekStart));
    const duration = endOffset - startOffset + 1;

    return {
      left: `${(startOffset / 7) * 100}%`,
      width: `${(duration / 7) * 100}%`,
      days: duration,
    };
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => addDays(prev, direction === "next" ? 7 : -7));
  };

  const formatWeekLabel = (date: Date, pattern: string) => format(date, pattern, { locale });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("projects.timeline.title")}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("prev")}
              aria-label={t("projects.timeline.actions.previous")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {formatWeekLabel(weekStart, language === "ja" ? "M月d日" : "MMM d")} - {formatWeekLabel(weekEnd, language === "ja" ? "M月d日, yyyy" : "MMM d, yyyy")}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("next")}
              aria-label={t("projects.timeline.actions.next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
              {t("projects.timeline.actions.today")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-12 gap-2 mb-4 text-xs font-medium text-muted-foreground">
          <div className="col-span-4 flex items-center gap-2">
            <CheckSquare className="h-3 w-3" />
            {t("projects.timeline.columns.tasks")}
          </div>
          <div className="col-span-8 grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className="text-center"
              >
                {formatWeekLabel(day, language === "ja" ? "M/d" : "MMM d")}
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="space-y-6">
          {Object.entries(tasksByProject).map(([projectName, projectTasks]) => (
            <div key={projectName} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{projectName}</h4>
                <span className="text-xs text-muted-foreground">
                  {t("projects.timeline.count", { count: projectTasks.length })}
                </span>
              </div>

              <div className="space-y-2">
                {projectTasks.map((task) => {
                  const position = calculateTaskPosition(task);
                  const durationDays = position ? position.days : differenceInDays(task.endDate, task.startDate) + 1;

                  return (
                    <div key={task.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="flex-1">
                          <div
                            className="text-sm font-medium truncate"
                            title={task.title}
                          >
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getStatusColor(task.status)}`}
                            >
                              {statusLabels[task.status]}
                            </Badge>
                            {task.assignee && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span className="truncate">{task.assignee.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-8 relative h-8 flex items-center">
                        {position ? (
                          <div
                            className={`absolute h-6 rounded-md shadow-sm border-l-4 ${getPriorityColor(task.priority)} ${
                              selectedTask === task.id ? "ring-2 ring-primary" : ""
                            } ${getStatusColor(task.status)} cursor-pointer transition-all hover:shadow-md`}
                            style={{ left: position.left, width: position.width }}
                            onClick={() => {
                              setSelectedTask(task.id);
                              onTaskClick?.(task.id);
                            }}
                          >
                            <div className="px-2 py-1 flex items-center justify-between h-full">
                              <span className="text-xs font-medium truncate">{task.progress}%</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">
                                  {t("projects.timeline.duration", { count: durationDays })}
                                </span>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b">
                              <div
                                className="h-full bg-white/60 rounded-b transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("projects.timeline.empty")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
