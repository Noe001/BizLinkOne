import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, ChevronLeft, ChevronRight, MoreHorizontal, Users, Clock, CheckSquare } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isWithinInterval, differenceInDays } from "date-fns";

interface GanttTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
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
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Calculate week range
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Group tasks by project
  const tasksByProject = useMemo(() => {
    const grouped: Record<string, GanttTask[]> = {};
    tasks.forEach(task => {
      if (!grouped[task.project]) {
        grouped[task.project] = [];
      }
      grouped[task.project].push(task);
    });
    return grouped;
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-gray-200 text-gray-800";
      case "in-progress": return "bg-blue-200 text-blue-800";
      case "review": return "bg-yellow-200 text-yellow-800";
      case "done": return "bg-green-200 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "border-l-gray-400";
      case "medium": return "border-l-yellow-400";
      case "high": return "border-l-orange-400";
      case "urgent": return "border-l-red-400";
      default: return "border-l-gray-400";
    }
  };

  const calculateTaskPosition = (task: GanttTask) => {
    const taskStart = task.startDate;
    const taskEnd = task.endDate;
    
    // Check if task overlaps with current week
    if (!isWithinInterval(taskStart, { start: weekStart, end: weekEnd }) && 
        !isWithinInterval(taskEnd, { start: weekStart, end: weekEnd }) &&
        !isWithinInterval(weekStart, { start: taskStart, end: taskEnd })) {
      return null;
    }

    const startOffset = Math.max(0, differenceInDays(taskStart, weekStart));
    const endOffset = Math.min(6, differenceInDays(taskEnd, weekStart));
    const duration = endOffset - startOffset + 1;

    return {
      left: `${(startOffset / 7) * 100}%`,
      width: `${(duration / 7) * 100}%`,
    };
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(prev => addDays(prev, direction === "next" ? 7 : -7));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
              Today
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Header with days */}
        <div className="grid grid-cols-12 gap-2 mb-4">
          <div className="col-span-4 font-medium text-sm text-muted-foreground">
            Tasks
          </div>
          <div className="col-span-8 grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className={`text-center text-xs font-medium p-2 rounded ${
                  isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <div>{format(day, "EEE")}</div>
                <div className="text-lg">{format(day, "d")}</div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Tasks by project */}
        <div className="space-y-6">
          {Object.entries(tasksByProject).map(([projectName, projectTasks]) => (
            <div key={projectName} className="space-y-2">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                {projectName}
                <Badge variant="outline" className="ml-2">
                  {projectTasks.length} tasks
                </Badge>
              </h3>

              {projectTasks.map((task) => {
                const position = calculateTaskPosition(task);
                
                return (
                  <div key={task.id} className="grid grid-cols-12 gap-2 py-2 hover:bg-accent/50 rounded-lg transition-colors">
                    {/* Task Info */}
                    <div className="col-span-4 flex items-center gap-2">
                      <div 
                        className={`w-1 h-8 rounded ${getPriorityColor(task.priority)}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium text-sm cursor-pointer hover:text-primary truncate"
                          onClick={() => {
                            setSelectedTask(task.id);
                            onTaskClick?.(task.id);
                          }}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(task.status)}`}
                          >
                            {task.status}
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

                    {/* Timeline */}
                    <div className="col-span-8 relative h-8 flex items-center">
                      {position && (
                        <div
                          className={`absolute h-6 rounded-md shadow-sm border-l-4 ${getPriorityColor(task.priority)} ${
                            selectedTask === task.id ? 'ring-2 ring-primary' : ''
                          } ${getStatusColor(task.status)} cursor-pointer transition-all hover:shadow-md`}
                          style={{ left: position.left, width: position.width }}
                          onClick={() => {
                            setSelectedTask(task.id);
                            onTaskClick?.(task.id);
                          }}
                        >
                          <div className="px-2 py-1 flex items-center justify-between h-full">
                            <span className="text-xs font-medium truncate">
                              {task.progress}%
                            </span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">
                                {differenceInDays(task.endDate, task.startDate) + 1}d
                              </span>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b">
                            <div
                              className="h-full bg-white/60 rounded-b transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Show task extends beyond current week */}
                      {!position && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks scheduled for this time period</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Sample data for testing
export const sampleGanttTasks: GanttTask[] = [
  {
    id: "task-1",
    title: "Authentication System Setup",
    startDate: new Date(2025, 8, 23), // Sept 23, 2025
    endDate: new Date(2025, 8, 27),   // Sept 27, 2025
    progress: 75,
    status: "in-progress",
    assignee: { id: "1", name: "John Doe" },
    project: "Core Platform",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Database Migration",
    startDate: new Date(2025, 8, 25), // Sept 25, 2025
    endDate: new Date(2025, 8, 30),   // Sept 30, 2025
    progress: 30,
    status: "todo",
    assignee: { id: "2", name: "Sarah Wilson" },
    project: "Core Platform",
    priority: "urgent",
    dependencies: ["task-1"],
  },
  {
    id: "task-3",
    title: "UI Component Library",
    startDate: new Date(2025, 8, 22), // Sept 22, 2025
    endDate: new Date(2025, 8, 26),   // Sept 26, 2025
    progress: 90,
    status: "review",
    assignee: { id: "3", name: "Mike Johnson" },
    project: "Frontend",
    priority: "medium",
  },
  {
    id: "task-4",
    title: "API Documentation",
    startDate: new Date(2025, 8, 28), // Sept 28, 2025
    endDate: new Date(2025, 9, 2),    // Oct 2, 2025
    progress: 10,
    status: "todo",
    assignee: { id: "4", name: "Emily Chen" },
    project: "Documentation",
    priority: "low",
  },
];
