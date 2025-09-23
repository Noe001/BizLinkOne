import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  BarChart3, 
  CheckSquare, 
  Clock, 
  Users,
  Target,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { GanttChart, sampleGanttTasks } from "@/components/GanttChart";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { TaskCard } from "@/components/TaskCard";
import type { TaskStatus } from "@/components/TaskCard";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed";
  progress: number;
  startDate: Date;
  endDate: Date;
  manager: {
    id: string;
    name: string;
    avatar?: string;
  };
  teamSize: number;
  taskCount: number;
  completedTasks: number;
  milestones: {
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
  }[];
}

// Sample projects data
const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "Core Platform",
    description: "Main application infrastructure and authentication system",
    status: "active",
    progress: 65,
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2025, 10, 30),
    manager: { id: "1", name: "John Doe" },
    teamSize: 4,
    taskCount: 12,
    completedTasks: 8,
    milestones: [
      { id: "m1", title: "Authentication Complete", dueDate: new Date(2025, 8, 30), completed: true },
      { id: "m2", title: "Database Migration", dueDate: new Date(2025, 9, 15), completed: false },
      { id: "m3", title: "API Integration", dueDate: new Date(2025, 10, 1), completed: false },
    ]
  },
  {
    id: "proj-2",
    name: "Frontend",
    description: "User interface and experience improvements",
    status: "active",
    progress: 45,
    startDate: new Date(2025, 8, 15),
    endDate: new Date(2025, 11, 15),
    manager: { id: "3", name: "Mike Johnson" },
    teamSize: 3,
    taskCount: 8,
    completedTasks: 3,
    milestones: [
      { id: "m4", title: "Component Library", dueDate: new Date(2025, 8, 30), completed: false },
      { id: "m5", title: "Responsive Design", dueDate: new Date(2025, 9, 30), completed: false },
    ]
  },
  {
    id: "proj-3",
    name: "Documentation",
    description: "Technical and user documentation",
    status: "planning",
    progress: 15,
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 11, 30),
    manager: { id: "4", name: "Emily Chen" },
    teamSize: 2,
    taskCount: 6,
    completedTasks: 1,
    milestones: [
      { id: "m6", title: "API Documentation", dueDate: new Date(2025, 9, 30), completed: false },
      { id: "m7", title: "User Guide", dueDate: new Date(2025, 10, 30), completed: false },
    ]
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredProjects = sampleProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-gray-100 text-gray-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Sample tasks for the selected project
  const projectTasks = sampleGanttTasks.filter(task => 
    selectedProject ? task.project === sampleProjects.find(p => p.id === selectedProject)?.name : false
  );

  const handleTaskClick = (taskId: string) => {
    console.log(`Clicked task: ${taskId}`);
  };

  const handleProjectCreate = (projectData: any) => {
    console.log("Creating project:", projectData);
    // Here you would typically call an API to create the project
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-projects">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track progress across teams
          </p>
        </div>
        <Button data-testid="button-new-project" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sampleProjects.length}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sampleProjects.filter(p => p.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sampleProjects.reduce((sum, p) => sum + p.taskCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {sampleProjects.reduce((sum, p) => sum + p.completedTasks, 0)} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sampleProjects.reduce((sum, p) => sum + p.teamSize, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all projects
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProject === project.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{project.teamSize} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{project.completedTasks}/{project.taskCount} tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDistanceToNow(project.endDate)} left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{project.milestones.length} milestones</span>
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {project.manager.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {project.manager.name}
                      </span>
                    </div>
                    
                    {/* Warning for overdue milestones */}
                    {project.milestones.some(m => !m.completed && m.dueDate < new Date()) && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <GanttChart 
            tasks={sampleGanttTasks} 
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {selectedProject ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Tasks for {sampleProjects.find(p => p.id === selectedProject)?.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTasks.map((task) => (
                  <TaskCard 
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={`Progress: ${task.progress}%`}
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
              <p>Select a project to view its tasks</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Project Progress Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleProjects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{project.name}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getProgressColor(project.progress)}`}
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
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleProjects
                    .flatMap(p => p.milestones.map(m => ({ ...m, projectName: p.name })))
                    .filter(m => !m.completed)
                    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                    .slice(0, 5)
                    .map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{milestone.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {milestone.projectName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatDistanceToNow(milestone.dueDate, { addSuffix: true })}
                          </div>
                          <Badge variant={milestone.dueDate < new Date() ? "destructive" : "secondary"} className="text-xs">
                            {milestone.dueDate < new Date() ? "Overdue" : "Upcoming"}
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

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreate={handleProjectCreate}
      />
    </div>
  );
}
