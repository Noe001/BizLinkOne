import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Folder, 
  Calendar, 
  Users, 
  CheckSquare, 
  TrendingUp,
  Clock,
  Target,
  Edit3,
  MessageSquare,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";

interface ProjectDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDetail | null;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description?: string;
  status: "planning" | "active" | "on-hold" | "completed" | "archived";
  progress: number;
  startDate: Date;
  endDate?: Date;
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    assignee?: string;
  }>;
  stats: {
    totalTasks: number;
    completedTasks: number;
    totalMilestones: number;
    completedMilestones: number;
  };
}

const statusConfig = {
  planning: { label: "📋 Planning", color: "bg-gray-100 text-gray-800" },
  active: { label: "🚀 Active", color: "bg-blue-100 text-blue-800" },
  "on-hold": { label: "⏸ On Hold", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "✅ Completed", color: "bg-green-100 text-green-800" },
  archived: { label: "📦 Archived", color: "bg-gray-100 text-gray-800" },
};

export function ProjectDetailModal({
  open,
  onOpenChange,
  project,
}: ProjectDetailModalProps) {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const dateLocale = language === "ja" ? jaLocale : undefined;

  if (!project) return null;

  const taskProgress = project.stats.totalTasks > 0 
    ? (project.stats.completedTasks / project.stats.totalTasks) * 100 
    : 0;

  const milestoneProgress = project.stats.totalMilestones > 0
    ? (project.stats.completedMilestones / project.stats.totalMilestones) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Folder className="h-6 w-6 text-primary" />
              <div>
                <DialogTitle className="text-2xl">{project.name}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.description || t("projects.detail.noDescription")}
                </p>
              </div>
            </div>
            <Badge className={statusConfig[project.status].color}>
              {statusConfig[project.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t("projects.detail.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="team">{t("projects.detail.tabs.team")}</TabsTrigger>
            <TabsTrigger value="tasks">{t("projects.detail.tabs.tasks")}</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="overview" className="space-y-6 m-0">
              {/* Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t("projects.detail.overallProgress")}</span>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">{project.progress}%</div>
                  <Progress value={project.progress} className="mt-2" />
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t("projects.detail.tasks")}</span>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    {project.stats.completedTasks}/{project.stats.totalTasks}
                  </div>
                  <Progress value={taskProgress} className="mt-2" />
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t("projects.detail.milestones")}</span>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    {project.stats.completedMilestones}/{project.stats.totalMilestones}
                  </div>
                  <Progress value={milestoneProgress} className="mt-2" />
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{t("projects.detail.timeline")}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">
                      {t("projects.detail.startDate")}
                    </div>
                    <div className="font-medium">
                      {format(project.startDate, "yyyy/MM/dd", { locale: dateLocale })}
                    </div>
                  </div>
                  {project.endDate && (
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t("projects.detail.endDate")}
                      </div>
                      <div className="font-medium">
                        {format(project.endDate, "yyyy/MM/dd", { locale: dateLocale })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Milestones */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{t("projects.detail.upcomingMilestones")}</h3>
                </div>
                <div className="space-y-2">
                  {project.milestones.slice(0, 5).map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          readOnly
                          className="rounded"
                        />
                        <div>
                          <div className={`text-sm font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}>
                            {milestone.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(milestone.dueDate, "yyyy/MM/dd", { locale: dateLocale })}
                          </div>
                        </div>
                      </div>
                      {milestone.completed && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {t("projects.detail.completed")}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {project.milestones.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">
                      {t("projects.detail.noMilestones")}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4 m-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">
                    {t("projects.detail.teamMembers", { count: project.team.length })}
                  </h3>
                </div>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  {t("projects.detail.addMember")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4 m-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">
                    {t("projects.detail.projectTasks", { count: project.tasks.length })}
                  </h3>
                </div>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  {t("projects.detail.createTask")}
                </Button>
              </div>

              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.assignee && `${t("projects.detail.assignedTo")} ${task.assignee}`}
                      </div>
                    </div>
                    <Badge variant="outline">{task.status}</Badge>
                  </div>
                ))}
                {project.tasks.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">
                    {t("projects.detail.noTasks")}
                  </p>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
