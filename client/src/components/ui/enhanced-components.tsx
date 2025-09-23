import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Users, 
  Clock, 
  MessageCircle, 
  ChevronRight, 
  MoreHorizontal,
  Pin,
  Star,
  Calendar,
  FileText,
  Link2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChannelHeaderProps {
  channelName: string;
  description: string;
  memberCount: number;
  isChannel: boolean;
  unreadCount?: number;
  onInviteMembers?: () => void;
  onChannelSettings?: () => void;
}

export function ChannelHeader({ 
  channelName, 
  description, 
  memberCount, 
  isChannel, 
  unreadCount = 0,
  onInviteMembers,
  onChannelSettings 
}: ChannelHeaderProps) {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
              isChannel ? 'bg-green-100' : 'bg-primary/10'
            }`}>
              <Users className={`h-4 w-4 ${
                isChannel ? 'text-green-700' : 'text-primary'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{channelName}</h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {memberCount} {isChannel ? 'members' : 'participants'} • {description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Pin className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pin channel</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Star className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Star channel</TooltipContent>
          </Tooltip>
          
          {isChannel && (
            <Button variant="outline" size="sm" onClick={onInviteMembers}>
              <Users className="h-4 w-4 mr-1" />
              Invite
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onChannelSettings}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ActivityFeedProps {
  activities: {
    id: string;
    type: 'message' | 'task' | 'meeting' | 'file' | 'mention';
    user: {
      name: string;
      avatar?: string;
    };
    content: string;
    timestamp: Date;
    channel?: string;
  }[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'file': return <Link2 className="h-4 w-4 text-purple-500" />;
      case 'mention': return <MessageCircle className="h-4 w-4 text-red-500" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.slice(0, 5).map((activity, index) => (
          <div key={activity.id}>
            <div className="flex items-start gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="text-xs">
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getActivityIcon(activity.type)}
                  <span className="text-sm font-medium">{activity.user.name}</span>
                  {activity.channel && (
                    <span className="text-xs text-muted-foreground">
                      in #{activity.channel}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {activity.content}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            {index < activities.length - 1 && index < 4 && (
              <Separator className="my-3" />
            )}
          </div>
        ))}
        {activities.length > 5 && (
          <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
            View all activity
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickActionsProps {
  onCreateTask?: () => void;
  onScheduleMeeting?: () => void;
  onShareFile?: () => void;
  onCreatePoll?: () => void;
}

export function QuickActions({ 
  onCreateTask, 
  onScheduleMeeting, 
  onShareFile, 
  onCreatePoll 
}: QuickActionsProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={onCreateTask} className="h-auto p-3 flex-col gap-1">
          <FileText className="h-4 w-4" />
          <span className="text-xs">Create Task</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onScheduleMeeting} className="h-auto p-3 flex-col gap-1">
          <Calendar className="h-4 w-4" />
          <span className="text-xs">Schedule</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onShareFile} className="h-auto p-3 flex-col gap-1">
          <Link2 className="h-4 w-4" />
          <span className="text-xs">Share File</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onCreatePoll} className="h-auto p-3 flex-col gap-1">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">Poll</span>
        </Button>
      </CardContent>
    </Card>
  );
}
