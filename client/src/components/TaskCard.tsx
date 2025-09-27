import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Calendar, MoreHorizontal, Info } from "lucide-react";
import { differenceInCalendarDays, format, formatDistanceToNow } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";

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
  tags?: string[];
  estimatedHours?: number;
}

const statusFlow: TaskStatus[] = ["todo", "in-progress", "review", "done"];

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
  tags,
  estimatedHours,
}: TaskCardProps) {
  const { t, language } = useTranslation();

  const locale = language === "ja" ? jaLocale : undefined;

  const priorityConfig = {
    low: { label: t("tasks.card.priority.low"), className: "bg-muted" },
    medium: { label: t("tasks.card.priority.medium"), className: "bg-cohere-green-800 text-white" },
    high: { label: t("tasks.card.priority.high"), className: "bg-cohere-red-500 text-white" },
    urgent: { label: t("tasks.card.priority.urgent"), className: "bg-cohere-red-600 text-white animate-pulse" },
  } satisfies Record<TaskPriority, { label: string; className: string }>;

  const statusConfig = {
    todo: { label: t("tasks.card.status.todo"), className: "bg-muted" },
    "in-progress": { label: t("tasks.card.status.inProgress"), className: "bg-cohere-green-800 text-white" },
    review: { label: t("tasks.card.status.review"), className: "bg-cohere-purple-700 text-white" },
    done: { label: t("tasks.card.status.done"), className: "bg-cohere-green-800 text-white" },
  } satisfies Record<TaskStatus, { label: string; className: string }>;

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleStatusChange = (event: React.MouseEvent) => {
    event.stopPropagation();
    const currentIndex = statusFlow.indexOf(status);
    const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length];
    onStatusChange?.(id, nextStatus);
  };

  const resolveDueDate = (date: Date) => {
    const formattedDate = language === "ja" ? format(date, "yyyy年M月d日", { locale }) : format(date, "MMM d, yyyy", { locale });
    const days = differenceInCalendarDays(date, new Date());

    if (days === 0) {
      return t("tasks.card.due.today", { date: formattedDate });
    }

    if (days > 0) {
      return t("tasks.card.due.future", { date: formattedDate, days });
    }

    return t("tasks.card.due.past", { date: formattedDate, days: Math.abs(days) });
  };

  const relativeDue = dueDate
    ? formatDistanceToNow(dueDate, { addSuffix: true, locale })
    : undefined;

  return (
    <TooltipProvider>
      <Card className="hover-elevate cursor-pointer group" onClick={handleCardClick} data-testid={`task-card-${id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]" data-testid={`task-tag-${id}-${tag}`}>
                    {tag}
                  </Badge>
                ))}
                {typeof estimatedHours === "number" && (
                  <Badge variant="outline" className="text-[10px]" data-testid={`task-estimate-${id}`}>
                    {t("tasks.card.estimate", { hours: estimatedHours })}
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-base leading-tight mb-2" data-testid={`task-title-${id}`}>
                {title}
              </h3>

              {dueDate && (
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted-foreground" data-testid={`task-due-${id}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{resolveDueDate(dueDate)}</span>
                  {relativeDue && <span>({relativeDue})</span>}
                </div>
              )}

              {description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm whitespace-pre-line">{description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" data-testid={`task-more-${id}`}>
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge
              className={`h-6 text-xs cursor-pointer ${statusConfig[status].className}`}
              onClick={handleStatusChange}
              data-testid={`task-status-${id}`}
            >
              {statusConfig[status].label}
            </Badge>

            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${priorityConfig[priority].className}`} data-testid={`task-priority-${id}`}>
                {priorityConfig[priority].label}
              </Badge>

              {relatedChatId && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    window.location.href = `/chat/channel/${relatedChatId}`;
                  }}
                  title={t("tasks.card.related.chat")}
                  data-testid={`task-chat-${id}`}
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              )}

              {relatedMeetingId && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    window.location.href = `/meetings/${relatedMeetingId}`;
                  }}
                  title={t("tasks.card.related.meeting")}
                  data-testid={`task-meeting-${id}`}
                >
                  <Calendar className="h-3 w-3" />
                </Button>
              )}

              {assignee && (
                <Avatar className="w-6 h-6" data-testid={`task-assignee-${id}`}>
                  <AvatarImage src={assignee.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${assignee.name}`} />
                  <AvatarFallback className="text-xs">
                    {assignee.name.split(" ").map((segment) => segment[0]).join("")}
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
