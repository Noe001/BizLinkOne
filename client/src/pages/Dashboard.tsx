import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CheckSquare, BookOpen, Calendar, Users, TrendingUp, Plus, Bell, FolderOpen, Target, Clock } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { TaskCard } from "@/components/TaskCard";
import type { TaskStatus } from "@/components/TaskCard";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { MeetingCard } from "@/components/MeetingCard";
import type { MeetingStatus } from "@/components/MeetingCard";
import { NotificationPanel, useNotifications } from "@/components/NotificationPanel";
import { 
  StatCardSkeleton, 
  MessageSkeleton, 
  TaskSkeleton, 
  KnowledgeSkeleton, 
  MeetingSkeleton, 
  EmptyState 
} from "@/components/ui/skeleton-components";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage as ChatMessageType, Task, KnowledgeArticle, Meeting } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface DashboardStats {
  activeChats: number;
  pendingTasks: number;
  knowledgeArticles: number;
  upcomingMeetings: number;
}

// Mock project data for integrated dashboard
interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed";
  progress: number;
  teamSize: number;
  taskCount: number;
  completedTasks: number;
  dueDate: Date;
}

const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Core Platform",
    description: "Main application infrastructure and authentication system",
    status: "active",
    progress: 65,
    teamSize: 4,
    taskCount: 12,
    completedTasks: 8,
    dueDate: new Date(2025, 10, 30),
  },
  {
    id: "proj-2",
    name: "Frontend Redesign",
    description: "User interface improvements and responsive design",
    status: "active", 
    progress: 45,
    teamSize: 3,
    taskCount: 8,
    completedTasks: 3,
    dueDate: new Date(2025, 11, 15),
  },
  {
    id: "proj-3",
    name: "Documentation",
    description: "Technical and user documentation updates",
    status: "planning",
    progress: 15,
    teamSize: 2,
    taskCount: 6,
    completedTasks: 1,
    dueDate: new Date(2025, 11, 30),
  },
];

export default function Dashboard() {
  // Notification system
  const { notifications, isOpen, setIsOpen, addNotification, unreadCount } = useNotifications();

  // Fetch real data from API
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

  const handleConvertToTask = (messageId: string) => {
    console.log(`Converting message ${messageId} to task`);
    // Add notification for task conversion
    addNotification({
      type: "task",
      title: "Task Created",
      message: "Message has been converted to a task successfully",
    });
  };

  const handleConvertToKnowledge = (messageId: string) => {
    console.log(`Converting message ${messageId} to knowledge`);
    // Add notification for knowledge conversion
    addNotification({
      type: "knowledge",
      title: "Knowledge Article Created",
      message: "Message has been converted to a knowledge article",
    });
  };

  const handleReply = (messageId: string) => {
    console.log(`Replying to message ${messageId}`);
  };

  // Prepare data for display
  const recentMessages = messages?.slice(0, 2) || [];
  const upcomingTasks = tasks?.slice(0, 2).map(t => {
    const allowed = ['todo','in-progress','review','done'] as const;
    const status = (allowed.includes(t.status as any) ? (t.status as unknown as TaskStatus) : 'todo');
    const allowedPriority = ['low','medium','high','urgent'] as const;
    const priority = (allowedPriority.includes(t.priority as any) ? (t.priority as unknown as typeof allowedPriority[number]) : 'low');
    return {
      ...t,
      description: t.description ?? undefined,
      status,
      priority,
      dueDate: t.dueDate ?? undefined,
    };
  }) || [];
  
  // Transform knowledge articles to match KnowledgeCard expected structure
  const recentKnowledge = knowledge?.slice(0, 1).map(article => ({
    ...article,
    excerpt: article.excerpt ?? undefined,
    author: {
      id: article.authorId,
      name: article.authorName,
      avatar: undefined // No avatar in current schema
    }
  })) || [];
  
  const upcomingMeetings = meetings?.slice(0, 1).map(m => {
    // Map server status (may be 'in-progress') to MeetingCard's status union ('ongoing')
    const allowed: MeetingStatus[] = ['scheduled','ongoing','completed','cancelled'];
    let status: MeetingStatus;
    if (m.status === 'in-progress') {
      status = 'ongoing';
    } else if ((allowed as readonly string[]).includes(m.status as any)) {
      status = m.status as MeetingStatus;
    } else {
      status = 'scheduled';
    }

    return {
      ...m,
      description: m.description ?? undefined,
      participants: m.participants ?? null,
      status,
    };
  }) || [];

  const isLoading = statsLoading || messagesLoading || tasksLoading || knowledgeLoading || meetingsLoading;

  return (
    <div className="p-6 space-y-6" data-testid="page-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening in your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="relative"
            data-testid="notification-button"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
          <Button data-testid="button-new-item">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <Card data-testid="stat-chats">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeChats || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-tasks">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingTasks || 0}</div>
                <p className="text-xs text-muted-foreground">
                  3 due today
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-projects">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProjects.filter(p => p.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">
                  2 on track
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-knowledge">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Knowledge Articles</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.knowledgeArticles || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +1 this week
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-meetings">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.upcomingMeetings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Next in 2 hours
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unread Messages */}
            <Card data-testid="section-recent-messages">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Unread Messages
                </CardTitle>
                <CardDescription>
                  Unread messages from your team channels
                </CardDescription>
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
                      onConvertToTask={handleConvertToTask}
                      onConvertToKnowledge={handleConvertToKnowledge}
                      onReply={handleReply}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={MessageSquare}
                    title="No unread messages"
                    description="You're all caught up! No new messages in your channels."
                    action={
                      <Button variant="outline" size="sm">
                        Browse Channels
                      </Button>
                    }
                  />
                )}
                {!messagesLoading && recentMessages.length > 0 && (
                  <Button variant="outline" className="w-full" data-testid="button-view-all-messages">
                    View All Messages
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card data-testid="section-upcoming-tasks">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Your Tasks
                </CardTitle>
                <CardDescription>
                  Tasks assigned to you or your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasksLoading ? (
                  <>
                    <TaskSkeleton />
                    <TaskSkeleton />
                  </>
                ) : upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <TaskCard key={task.id} {...task} />
                  ))
                ) : (
                  <EmptyState
                    icon={CheckSquare}
                    title="No pending tasks"
                    description="Great work! You have no pending tasks assigned to you."
                    action={
                      <Button variant="outline" size="sm">
                        Create New Task
                      </Button>
                    }
                  />
                )}
                {!tasksLoading && upcomingTasks.length > 0 && (
                  <Button variant="outline" className="w-full" data-testid="button-view-all-tasks">
                    View All Tasks
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Knowledge */}
            <Card data-testid="section-recent-knowledge">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Latest Knowledge
                </CardTitle>
                <CardDescription>
                  Recently updated documentation and guides
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {knowledgeLoading ? (
                  <KnowledgeSkeleton />
                ) : recentKnowledge.length > 0 ? (
                  recentKnowledge.map((article) => (
                    <KnowledgeCard key={article.id} {...article} />
                  ))
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    title="No knowledge articles"
                    description="Start building your team's knowledge base by creating your first article."
                    action={
                      <Button variant="outline" size="sm">
                        Create Article
                      </Button>
                    }
                  />
                )}
                {!knowledgeLoading && recentKnowledge.length > 0 && (
                  <Button variant="outline" className="w-full" data-testid="button-view-all-knowledge">
                    View All Knowledge
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card data-testid="section-upcoming-meetings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Meetings
                </CardTitle>
                <CardDescription>
                  Your scheduled meetings for today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meetingsLoading ? (
                  <MeetingSkeleton />
                ) : upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} {...meeting} />
                  ))
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="No upcoming meetings"
                    description="You have no meetings scheduled for today. Your calendar is clear!"
                    action={
                      <Button variant="outline" size="sm">
                        Schedule Meeting
                      </Button>
                    }
                  />
                )}
                {!meetingsLoading && upcomingMeetings.length > 0 && (
                  <Button variant="outline" className="w-full" data-testid="button-view-all-meetings">
                    View All Meetings
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <Card key={project.id} className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={
                        project.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        project.status === 'planning' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
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
                        className={`h-2 rounded-full transition-all ${
                          project.progress >= 80 ? 'bg-green-500' :
                          project.progress >= 50 ? 'bg-blue-500' :
                          project.progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
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
                      <span>{formatDistanceToNow(project.dueDate)} left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{project.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['todo', 'in-progress', 'review', 'done'].map((status) => {
              const statusTasks = upcomingTasks.filter(task => task.status === status);
              return (
                <Card key={status}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium capitalize">
                        {status === 'in-progress' ? 'In Progress' : status}
                      </CardTitle>
                      <Badge variant="secondary">{statusTasks.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statusTasks.map((task) => (
                      <TaskCard key={task.id} {...task} />
                    ))}
                    {statusTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No {status} tasks
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest messages from all channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    {...message}
                    channelId={message.channelId || undefined}
                    onConvertToTask={handleConvertToTask}
                    onConvertToKnowledge={handleConvertToKnowledge}
                    onReply={handleReply}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest Knowledge Updates</CardTitle>
                <CardDescription>Recently created or updated articles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentKnowledge.map((article) => (
                  <KnowledgeCard key={article.id} {...article} />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Notification Panel */}
      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
