import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckSquare, BookOpen, Calendar, TrendingUp, Plus, FolderOpen } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { TaskCard } from "@/components/TaskCard";
import type { TaskStatus } from "@/components/TaskCard";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { MeetingCard } from "@/components/MeetingCard";
import type { MeetingStatus } from "@/components/MeetingCard";
import { useNotifications } from "@/components/NotificationPanel";
import { NewTaskModal, type NewTaskData } from "@/components/NewTaskModal";
import { CreateKnowledgeModal, type CreateKnowledgeData } from "@/components/CreateKnowledgeModal";
import {
  StatCardSkeleton,
  MessageSkeleton,
  TaskSkeleton,
  KnowledgeSkeleton,
  MeetingSkeleton,
  EmptyState,
} from "@/components/ui/skeleton-components";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage as ChatMessageType, Task, KnowledgeArticle, Meeting } from "@shared/schema";
import { useTranslation } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import type { MessageModalContext } from "@/types";
import { dashboardSummary, sampleProjects } from "@/data/projects";

interface DashboardStats {
  activeChats: number;
  pendingTasks: number;
  knowledgeArticles: number;
  upcomingMeetings: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const [taskModalContext, setTaskModalContext] = useState<MessageModalContext | null>(null);
  const [knowledgeModalContext, setKnowledgeModalContext] = useState<MessageModalContext | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<ChatMessageType[]>({
    queryKey: ["/api/messages"],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: knowledge, isLoading: knowledgeLoading } = useQuery<KnowledgeArticle[]>({
    queryKey: ["/api/knowledge"],
  });

  const { data: meetings, isLoading: meetingsLoading } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const handleRequestTaskCreation = (messageId: string) => {
    const message = (messages ?? []).find(item => item.id === messageId);
    if (!message) {
      console.warn(`Unable to find message ${messageId} for task conversion.`);
      return;
    }

    setTaskModalContext({
      messageId,
      content: message.content,
      authorName: message.userName,
      channelId: message.channelId ?? undefined,
    });
  };

  const handleTaskCreate = (taskData: NewTaskData) => {
    if (!taskModalContext) {
      return;
    }

    console.log(t("dashboard.log.convertToTask"), taskModalContext.messageId, taskData);
    addNotification({
      type: "task",
      title: t("dashboard.notifications.taskCreated.title"),
      message: t("dashboard.notifications.taskCreated.message"),
    });
    setTaskModalContext(null);
  };

  const handleRequestKnowledgeCreation = (messageId: string) => {
    const message = (messages ?? []).find(item => item.id === messageId);
    if (!message) {
      console.warn(`Unable to find message ${messageId} for knowledge conversion.`);
      return;
    }

    setKnowledgeModalContext({
      messageId,
      content: message.content,
      authorName: message.userName,
      channelId: message.channelId ?? undefined,
    });
  };

  const handleKnowledgeCreate = (knowledgeData: CreateKnowledgeData) => {
    if (!knowledgeModalContext) {
      return;
    }

    console.log(t("dashboard.log.convertToKnowledge"), knowledgeModalContext.messageId, knowledgeData);
    addNotification({
      type: "knowledge",
      title: t("dashboard.notifications.knowledgeCreated.title"),
      message: t("dashboard.notifications.knowledgeCreated.message"),
    });
    setKnowledgeModalContext(null);
  };

  const handleReply = (messageId: string) => {
    console.log(t("dashboard.log.reply"), messageId);
  };

  const recentMessages = messages?.slice(0, 2) || [];
  const upcomingTasks =
    tasks?.slice(0, 2).map((task) => {
      const allowedStatuses: TaskStatus[] = ["todo", "in-progress", "review", "done"];
      const status = allowedStatuses.includes(task.status as TaskStatus) ? (task.status as TaskStatus) : "todo";
      const allowedPriority = ["low", "medium", "high", "urgent"] as const;
      const priority = allowedPriority.includes(task.priority as (typeof allowedPriority)[number])
        ? (task.priority as (typeof allowedPriority)[number])
        : "low";

      return {
        ...task,
        description: task.description ?? undefined,
        status,
        priority,
        dueDate: task.dueDate ?? undefined,
      };
    }) || [];

  const recentKnowledge =
    knowledge?.slice(0, 1).map((article) => ({
      ...article,
      excerpt: article.excerpt ?? undefined,
      tags: (article.tags || []).map((tag, index) => ({ id: `${article.id}-tag-${index}`, label: tag })),
      author: {
        id: article.authorId,
        name: article.authorName,
        avatar: undefined,
      },
    })) || [];

  const upcomingMeetings =
    meetings?.slice(0, 1).map((meeting) => {
      const allowedStatuses: MeetingStatus[] = ["scheduled", "ongoing", "completed", "cancelled"];
      let status: MeetingStatus;
      if (meeting.status === "in-progress") {
        status = "ongoing";
      } else if ((allowedStatuses as readonly string[]).includes(meeting.status as string)) {
        status = meeting.status as MeetingStatus;
      } else {
        status = "scheduled";
      }

      return {
        ...meeting,
        description: meeting.description ?? undefined,
        participants: meeting.participants ?? null,
        status,
      };
    }) || [];

  const activeProjects = sampleProjects.filter((project) => project.status === "active").length;
  const isLoading = statsLoading || messagesLoading || tasksLoading || knowledgeLoading || meetingsLoading;

  return (
    <div className="page-container" data-testid="page-dashboard">
      <div className="page-header">
        <p className="text-muted-foreground max-w-3xl text-sm sm:text-base">{t("dashboard.header.description")}</p>
        <div className="page-actions">
          <Button size="sm" className="h-9 sm:h-8 touch-manipulation" data-testid="button-new-item">
            <Plus className="h-4 w-4 mr-2" />
            {t("dashboard.actions.new")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 md:gap-6">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card data-testid="stat-chats" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("dashboard.stats.chats.title")}</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeChats ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {t("dashboard.stats.chats.hint", { delta: dashboardSummary.chatsDelta })}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-tasks" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("dashboard.stats.tasks.title")}</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingTasks ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.stats.tasks.hint", { count: dashboardSummary.tasksDueToday })}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-projects" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("dashboard.stats.projects.title")}</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.stats.projects.hint", { count: dashboardSummary.projectsOnTrack })}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-knowledge" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("dashboard.stats.knowledge.title")}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.knowledgeArticles ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.stats.knowledge.hint", { count: dashboardSummary.knowledgeThisWeek })}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-meetings" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("dashboard.stats.meetings.title")}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.upcomingMeetings ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.stats.meetings.hint", { hours: dashboardSummary.meetingsNextInHours })}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <Card data-testid="section-recent-messages">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t("dashboard.sections.messages.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.sections.messages.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {messagesLoading ? (
                <>
                  <MessageSkeleton />
                  <MessageSkeleton />
                </>
              ) : recentMessages.length > 0 ? (
                recentMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    {...message}
                    channelId={message.channelId || undefined}
                    isOwn={currentUserId === message.userId}
                    onRequestTaskCreation={handleRequestTaskCreation}
                    onRequestKnowledgeCreation={handleRequestKnowledgeCreation}
                    onReply={handleReply}
                  />
                ))
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title={t("dashboard.sections.messages.emptyTitle")}
                  description={t("dashboard.sections.messages.emptyDescription")}
                  action={
                    <Button variant="outline" size="sm">
                      {t("dashboard.sections.messages.browse")}
                    </Button>
                  }
                />
              )}
              {!messagesLoading && recentMessages.length > 0 && (
                <Button variant="outline" className="w-full" data-testid="button-view-all-messages">
                  {t("dashboard.sections.messages.viewAll")}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card data-testid="section-upcoming-tasks">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                {t("dashboard.sections.tasks.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.sections.tasks.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasksLoading ? (
                <>
                  <TaskSkeleton />
                  <TaskSkeleton />
                </>
              ) : upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => <TaskCard key={task.id} {...task} />)
              ) : (
                <EmptyState
                  icon={CheckSquare}
                  title={t("dashboard.sections.tasks.emptyTitle")}
                  description={t("dashboard.sections.tasks.emptyDescription")}
                  action={
                    <Button variant="outline" size="sm">
                      {t("dashboard.sections.tasks.actions.create")}
                    </Button>
                  }
                />
              )}
              {!tasksLoading && upcomingTasks.length > 0 && (
                <Button variant="outline" className="w-full" data-testid="button-view-all-tasks">
                  {t("dashboard.sections.tasks.viewAll")}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card data-testid="section-recent-knowledge">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t("dashboard.sections.knowledge.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.sections.knowledge.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {knowledgeLoading ? (
                <KnowledgeSkeleton />
              ) : recentKnowledge.length > 0 ? (
                recentKnowledge.map((article) => <KnowledgeCard key={article.id} {...article} />)
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title={t("dashboard.sections.knowledge.emptyTitle")}
                  description={t("dashboard.sections.knowledge.emptyDescription")}
                  action={
                    <Button variant="outline" size="sm">
                      {t("dashboard.sections.knowledge.actions.create")}
                    </Button>
                  }
                />
              )}
              {!knowledgeLoading && recentKnowledge.length > 0 && (
                <Button variant="outline" className="w-full" data-testid="button-view-all-knowledge">
                  {t("dashboard.sections.knowledge.viewAll")}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card data-testid="section-upcoming-meetings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("dashboard.sections.meetings.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.sections.meetings.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meetingsLoading ? (
                <MeetingSkeleton />
              ) : upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((meeting) => <MeetingCard key={meeting.id} {...meeting} />)
              ) : (
                <EmptyState
                  icon={Calendar}
                  title={t("dashboard.sections.meetings.emptyTitle")}
                  description={t("dashboard.sections.meetings.emptyDescription")}
                  action={
                    <Button variant="outline" size="sm">
                      {t("dashboard.sections.meetings.actions.schedule")}
                    </Button>
                  }
                />
              )}
              {!meetingsLoading && upcomingMeetings.length > 0 && (
                <Button variant="outline" className="w-full" data-testid="button-view-all-meetings">
                  {t("dashboard.sections.meetings.viewAll")}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <NewTaskModal
        open={Boolean(taskModalContext)}
        onOpenChange={(open) => {
          if (!open) {
            setTaskModalContext(null);
          }
        }}
        onTaskCreate={handleTaskCreate}
        messageContent={taskModalContext?.content}
        relatedChatId={taskModalContext?.channelId}
      />

      <CreateKnowledgeModal
        isOpen={Boolean(knowledgeModalContext)}
        onClose={() => setKnowledgeModalContext(null)}
        onCreateKnowledge={handleKnowledgeCreate}
        messageContent={knowledgeModalContext?.content}
        messageAuthor={knowledgeModalContext?.authorName}
        relatedChatId={knowledgeModalContext?.channelId}
      />
    </div>
  );
}
