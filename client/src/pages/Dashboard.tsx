import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckSquare, BookOpen, Calendar, Users, TrendingUp, Plus } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { TaskCard } from "@/components/TaskCard";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { MeetingCard } from "@/components/MeetingCard";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage as ChatMessageType, Task, KnowledgeArticle, Meeting } from "@shared/schema";

interface DashboardStats {
  activeChats: number;
  pendingTasks: number;
  knowledgeArticles: number;
  upcomingMeetings: number;
}

export default function Dashboard() {
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
  };

  const handleConvertToKnowledge = (messageId: string) => {
    console.log(`Converting message ${messageId} to knowledge`);
  };

  const handleReply = (messageId: string) => {
    console.log(`Replying to message ${messageId}`);
  };

  // Prepare data for display
  const recentMessages = messages?.slice(0, 2) || [];
  const upcomingTasks = tasks?.slice(0, 2) || [];
  
  // Transform knowledge articles to match KnowledgeCard expected structure
  const recentKnowledge = knowledge?.slice(0, 1).map(article => ({
    ...article,
    author: {
      id: article.authorId,
      name: article.authorName,
      avatar: undefined // No avatar in current schema
    }
  })) || [];
  
  const upcomingMeetings = meetings?.slice(0, 1) || [];

  const isLoading = statsLoading || messagesLoading || tasksLoading || knowledgeLoading || meetingsLoading;

  return (
    <div className="p-6 space-y-6" data-testid="page-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening in your workspace.
          </p>
        </div>
        <Button data-testid="button-new-item">
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="stat-chats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats?.activeChats || 0}</div>
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
            <div className="text-2xl font-bold">{isLoading ? "..." : stats?.pendingTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              3 due today
            </p>
          </CardContent>
        </Card>

        <Card data-testid="stat-knowledge">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Articles</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats?.knowledgeArticles || 0}</div>
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
            <div className="text-2xl font-bold">{isLoading ? "..." : stats?.upcomingMeetings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Next in 30 minutes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card data-testid="section-recent-messages">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>
              Latest activity from your team channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div>Loading messages...</div>
            ) : (
              recentMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  {...message}
                  onConvertToTask={handleConvertToTask}
                  onConvertToKnowledge={handleConvertToKnowledge}
                  onReply={handleReply}
                />
              ))
            )}
            <Button variant="outline" className="w-full" data-testid="button-view-all-messages">
              View All Messages
            </Button>
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
            {isLoading ? (
              <div>Loading tasks...</div>
            ) : (
              upcomingTasks.map((task) => (
                <TaskCard key={task.id} {...task} />
              ))
            )}
            <Button variant="outline" className="w-full" data-testid="button-view-all-tasks">
              View All Tasks
            </Button>
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
            {isLoading ? (
              <div>Loading knowledge...</div>
            ) : (
              recentKnowledge.map((article) => (
                <KnowledgeCard key={article.id} {...article} />
              ))
            )}
            <Button variant="outline" className="w-full" data-testid="button-view-all-knowledge">
              View All Knowledge
            </Button>
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
            {isLoading ? (
              <div>Loading meetings...</div>
            ) : (
              upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} {...meeting} />
              ))
            )}
            <Button variant="outline" className="w-full" data-testid="button-view-all-meetings">
              View All Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}