import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, SortDesc } from "lucide-react";
import { TaskCard, type TaskStatus, type TaskPriority } from "@/components/TaskCard";
import { NewTaskModal, type NewTaskData } from "@/components/NewTaskModal";
import { TaskDetailModal, type TaskDetailData } from "@/components/TaskDetailModal";

// Task interface for consistent typing across the application
interface Task {
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

// todo: remove mock functionality
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement user authentication system",
    description: "Set up JWT-based authentication with login, logout, and registration functionality.",
    status: "in-progress" as TaskStatus,
    priority: "high" as TaskPriority,
    assignee: { id: "john-doe", name: "John Doe" },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    relatedChatId: "development",
    tags: ["backend", "security"],
    estimatedHours: 8,
  },
  {
    id: "task-2",
    title: "Update API documentation",
    description: "Review and update the API documentation to reflect recent changes in the authentication endpoints.",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignee: { id: "sarah-wilson", name: "Sarah Wilson" },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    relatedChatId: "development",
    tags: ["documentation", "api"],
    estimatedHours: 4,
  },
  {
    id: "task-3",
    title: "Fix responsive design issues",
    description: "Address layout problems on mobile devices, particularly in the dashboard and chat interfaces.",
    status: "review" as TaskStatus,
    priority: "urgent" as TaskPriority,
    assignee: { id: "mike-johnson", name: "Mike Johnson" },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    relatedChatId: "design",
    tags: ["frontend", "mobile", "css"],
    estimatedHours: 6,
  },
  {
    id: "task-4",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment pipeline for the main application.",
    status: "todo" as TaskStatus,
    priority: "low" as TaskPriority,
    assignee: { id: "alice-cooper", name: "Alice Cooper" },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    tags: ["devops", "automation"],
    estimatedHours: 12,
  },
  {
    id: "task-5",
    title: "Database optimization",
    description: "Optimize database queries and add appropriate indexes to improve performance.",
    status: "done" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignee: { id: "bob-smith", name: "Bob Smith" },
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    tags: ["database", "performance"],
    estimatedHours: 5,
  },
  {
    id: "task-6",
    title: "User onboarding flow",
    description: "Design and implement an intuitive onboarding process for new users.",
    status: "in-progress" as TaskStatus,
    priority: "high" as TaskPriority,
    assignee: { id: "sarah-wilson", name: "Sarah Wilson" },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    relatedChatId: "product",
    tags: ["frontend", "ux"],
    estimatedHours: 10,
  },
];

const statusColumns = [
  { id: "todo", title: "To Do", status: "todo" as TaskStatus },
  { id: "in-progress", title: "In Progress", status: "in-progress" as TaskStatus },
  { id: "review", title: "Review", status: "review" as TaskStatus },
  { id: "done", title: "Done", status: "done" as TaskStatus },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDetailData | null>(null);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // Convert task to TaskDetailData format
      const taskDetail: TaskDetailData = {
        ...task,
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30),
        updatedAt: new Date(),
        actualHours: Math.random() * 10,
        tags: task.tags || [],
        subtasks: [],
        comments: [],
        timeEntries: [],
      };
      setSelectedTask(taskDetail);
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<TaskDetailData>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    
    // Update selected task if it's the one being edited
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setSelectedTask(null);
  };

  const handleCreateTask = (newTaskData: NewTaskData) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskData.title,
      description: newTaskData.description,
      status: newTaskData.status,
      priority: newTaskData.priority,
      assignee: (newTaskData.assigneeId && newTaskData.assigneeId !== "unassigned") ? { 
        id: newTaskData.assigneeId, 
        name: mockTeamMembers.find(m => m.id === newTaskData.assigneeId)?.name || "Unknown"
      } : { id: "unassigned", name: "Unassigned" },
      dueDate: newTaskData.dueDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      ...(newTaskData.relatedChatId && newTaskData.relatedChatId !== "none" && { relatedChatId: newTaskData.relatedChatId }),
      tags: newTaskData.tags || [],
      estimatedHours: newTaskData.estimatedHours || 0,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Mock team members data needed for task creation
  const mockTeamMembers = [
    { id: "john-doe", name: "John Doe", avatar: "", role: "Developer" },
    { id: "sarah-wilson", name: "Sarah Wilson", avatar: "", role: "Designer" },
    { id: "mike-johnson", name: "Mike Johnson", avatar: "", role: "Product Manager" },
    { id: "alice-cooper", name: "Alice Cooper", avatar: "", role: "DevOps Engineer" },
    { id: "bob-smith", name: "Bob Smith", avatar: "", role: "QA Engineer" },
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-tasks">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage your team's tasks and track progress across projects.
          </p>
        </div>
        <Button data-testid="button-new-task" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-tasks"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40" data-testid="filter-status">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">📋 To Do</SelectItem>
              <SelectItem value="in-progress">🔄 In Progress</SelectItem>
              <SelectItem value="review">👀 Review</SelectItem>
              <SelectItem value="done">✅ Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40" data-testid="filter-priority">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">🔴 Urgent</SelectItem>
              <SelectItem value="high">🟠 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">🟢 Low</SelectItem>
            </SelectContent>
          </Select>

          {(filterStatus !== "all" || filterPriority !== "all" || searchQuery) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setFilterStatus("all");
                setFilterPriority("all");
                setSearchQuery("");
              }}
              className="px-3"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{filteredTasks.length}</p>
              </div>
              <Badge variant="outline">{mockTasks.length}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getTasksByStatus("in-progress").length}
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {getTasksByStatus("review").length}
                </p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {getTasksByStatus("done").length}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Done
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode and Additional Filters */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTasks.length} of {mockTasks.length} tasks
        </div>
        <Button 
          variant="outline" 
          onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")}
          data-testid="button-view-mode"
        >
          {viewMode === "kanban" ? "List View" : "Kanban View"}
        </Button>
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="kanban-board">
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
                    <div />
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
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No tasks</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
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
                <p className="text-muted-foreground">No tasks found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* New Task Modal */}
      <NewTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTaskCreate={handleCreateTask}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
}
