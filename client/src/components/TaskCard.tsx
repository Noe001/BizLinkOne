import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskCardProps {
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
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onClick?: (taskId: string) => void;
}

const statusColors = {
  todo: "bg-muted",
  "in-progress": "bg-cohere-blue-500 text-white",
  review: "bg-cohere-purple-700 text-white",
  done: "bg-cohere-green-700 text-white",
};

const priorityColors = {
  low: "bg-muted",
  medium: "bg-cohere-blue-500 text-white",
  high: "bg-cohere-red-500 text-white",
  urgent: "bg-cohere-red-600 text-white animate-pulse",
};

export function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  dueDate,
  relatedChatId,
  relatedMeetingId,
  onStatusChange,
  onClick,
}: TaskCardProps) {
  const handleCardClick = () => {
    console.log(`Task ${id} clicked`);
    onClick?.(id);
  };

  const handleStatusChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusFlow: TaskStatus[] = ["todo", "in-progress", "review", "done"];
    const currentIndex = statusFlow.indexOf(status);
    const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length];
    console.log(`Changing task ${id} status from ${status} to ${nextStatus}`);
    onStatusChange?.(id, nextStatus);
  };

  return (
    <Card 
      className="hover-elevate cursor-pointer group" 
      onClick={handleCardClick}
      data-testid={`task-card-${id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight truncate" data-testid={`task-title-${id}`}>
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Badge 
              className={`h-5 text-xs ${priorityColors[priority]}`}
              data-testid={`task-priority-${id}`}
            >
              {priority}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              data-testid={`task-more-${id}`}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2" data-testid={`task-description-${id}`}>
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              className={`h-5 text-xs cursor-pointer ${statusColors[status]}`}
              onClick={handleStatusChange}
              data-testid={`task-status-${id}`}
            >
              {status.replace('-', ' ')}
            </Badge>
            
            {dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span data-testid={`task-due-${id}`}>
                  {formatDistanceToNow(dueDate, { addSuffix: true })}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {relatedChatId && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                data-testid={`task-chat-${id}`}
              >
                <MessageSquare className="h-3 w-3" />
              </Button>
            )}
            
            {assignee && (
              <Avatar className="w-6 h-6" data-testid={`task-assignee-${id}`}>
                <AvatarImage src={assignee.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${assignee.name}`} />
                <AvatarFallback className="text-xs">
                  {assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}