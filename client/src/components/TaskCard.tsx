import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Calendar, MoreHorizontal, Info } from "lucide-react";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";

export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string | null;
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
  "in-progress": "bg-cohere-green-800 text-white",
  review: "bg-cohere-purple-700 text-white",
  done: "bg-cohere-green-800 text-white",
};

const priorityColors = {
  low: "bg-muted",
  medium: "bg-cohere-green-800 text-white",
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

  // Format date with absolute + relative format: "2025/09/17 (in 3 days)"
  const formatDueDate = (date: Date) => {
    const absoluteDate = format(date, "yyyy/MM/dd");
    const daysFromNow = differenceInDays(date, new Date());
    
    let relativeText = "";
    if (daysFromNow > 0) {
      relativeText = `in ${daysFromNow} day${daysFromNow > 1 ? 's' : ''}`;
    } else if (daysFromNow === 0) {
      relativeText = "today";
    } else {
      relativeText = `${Math.abs(daysFromNow)} day${Math.abs(daysFromNow) > 1 ? 's' : ''} ago`;
    }
    
    return `${absoluteDate} (${relativeText})`;
  };

  return (
    <TooltipProvider>
      <Card 
        className="hover-elevate cursor-pointer group" 
        onClick={handleCardClick}
        data-testid={`task-card-${id}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight mb-2" data-testid={`task-title-${id}`}>
                {title}
              </h3>
              
              {/* Due Date - Prominently displayed */}
              {dueDate && (
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span 
                    className="text-sm font-medium text-foreground"
                    data-testid={`task-due-${id}`}
                  >
                    {formatDueDate(dueDate)}
                  </span>
                </div>
              )}
              
              {/* Priority Badge - Prominently displayed */}
              <div className="flex items-center gap-2">
                <Badge 
                  className={`text-sm font-medium ${priorityColors[priority]}`}
                  data-testid={`task-priority-${id}`}
                >
                  {priority.toUpperCase()}
                </Badge>
                
                {/* Description - Available on hover */}
                {description && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">{description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              data-testid={`task-more-${id}`}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <Badge 
              className={`h-6 text-xs cursor-pointer ${statusColors[status]}`}
              onClick={handleStatusChange}
              data-testid={`task-status-${id}`}
            >
              {status.replace('-', ' ')}
            </Badge>

            <div className="flex items-center gap-2">
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
    </TooltipProvider>
  );
}
