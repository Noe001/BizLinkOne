import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, SortDesc } from "lucide-react";
import { TaskCard, type TaskStatus, type TaskPriority } from "@/components/TaskCard";

// todo: remove mock functionality
const mockTasks = [
  {
    id: "task-1",
    title: "Implement user authentication system",
    description: "Set up JWT-based authentication with login, logout, and registration functionality.",
    status: "in-progress" as TaskStatus,
    priority: "high" as TaskPriority,
    assignee: { id: "john-doe", name: "John Doe" },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    relatedChatId: "development",
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
  },
  {
    id: "task-4",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment pipeline for the main application.",
    status: "todo" as TaskStatus,
    priority: "low" as TaskPriority,
    assignee: { id: "alice-cooper", name: "Alice Cooper" },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: "task-5",
    title: "Database optimization",
    description: "Optimize database queries and add appropriate indexes to improve performance.",
    status: "done" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignee: { id: "bob-smith", name: "Bob Smith" },
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
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
  },
];

const statusColumns = [
  { id: "todo", title: "To Do", status: "todo" as TaskStatus },
  { id: "in-progress", title: "In Progress", status: "in-progress" as TaskStatus },
  { id: "review", title: "Review", status: "review" as TaskStatus },
  { id: "done", title: "Done", status: "done" as TaskStatus },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(mockTasks);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskClick = (taskId: string) => {
    console.log(`Viewing task details for ${taskId}`);
  };

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
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your team's tasks and track progress across projects.
          </p>
        </div>
        <Button data-testid="button-new-task">
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
            <SelectTrigger className="w-32" data-testid="filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32" data-testid="filter-priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" data-testid="button-view-mode">
            {viewMode === "kanban" ? "List View" : "Kanban View"}
          </Button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusColumns.map((column) => {
          const count = getTasksByStatus(column.status).length;
          return (
            <Card key={column.id} data-testid={`stat-${column.id}`}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-sm text-muted-foreground">{column.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="kanban-board">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            return (
              <Card key={column.id} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">{column.title}</span>
                    <Badge variant="outline" className="h-5 text-xs">
                      {columnTasks.length}
                    </Badge>
                  </CardTitle>
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
    </div>
  );
}