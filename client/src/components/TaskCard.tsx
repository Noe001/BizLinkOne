import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTagColor } from "@/utils/tagColors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Calendar, MoreHorizontal, Info, Edit, Trash2, Copy, Archive, Share2, Star } from "lucide-react";
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
  projectName?: string;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onClick?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onDuplicate?: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
  onShare?: (taskId: string) => void;
  onToggleFavorite?: (taskId: string) => void;
  tags?: string[];
  estimatedHours?: number;
  isFavorite?: boolean;
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
  projectName,
  onStatusChange,
  onClick,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onShare,
  onToggleFavorite,
  tags,
  estimatedHours,
  isFavorite = false,
}: TaskCardProps) {
  const { t, language } = useTranslation();

  const locale = language === "ja" ? jaLocale : undefined;

  const priorityConfig = {
    low: { label: t("tasks.card.priority.low"), className: getTagColor("low") },
    medium: { label: t("tasks.card.priority.medium"), className: getTagColor("medium") },
    high: { label: t("tasks.card.priority.high"), className: getTagColor("high") },
    urgent: { label: t("tasks.card.priority.urgent"), className: `${getTagColor("urgent")} blink-urgent` },
  } satisfies Record<TaskPriority, { label: string; className: string }>;

  const statusConfig = {
    todo: { label: t("tasks.card.status.todo"), className: getTagColor("todo") },
    "in-progress": { label: t("tasks.card.status.inProgress"), className: getTagColor("in-progress") },
    review: { label: t("tasks.card.status.review"), className: getTagColor("review") },
    done: { label: t("tasks.card.status.done"), className: getTagColor("done") },
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
    const formattedDate = language === "ja" 
      ? format(date, "yyyy年M月d日", { locale }) 
      : format(date, "MMM d, yyyy", { locale });
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

  const daysUntilDue = dueDate ? differenceInCalendarDays(dueDate, new Date()) : null;
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && status !== "done";
  const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 2 && status !== "done";

  return (
    <TooltipProvider>
      <Card 
        className={`hover-elevate cursor-pointer group transition-all duration-200 hover:shadow-lg ${
          isOverdue ? 'border-2 border-red-500 dark:border-red-600' : 
          isDueSoon ? 'border-2 border-amber-500 dark:border-amber-600' : ''
        }`}
        onClick={handleCardClick} 
        data-testid={`task-card-${id}`}
        aria-label={`${title} - ${statusConfig[status].label} - ${priorityConfig[priority].label}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className={`h-5 text-xs ${getTagColor(tag)}`} data-testid={`task-tag-${id}-${tag}`}>
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge variant="outline" className="h-5 text-xs bg-card text-card-foreground border-card-border dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800">
                      +{tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {typeof estimatedHours === "number" && (
                  <Badge variant="outline" className="text-[10px]" data-testid={`task-estimate-${id}`}>
                    {t("tasks.card.estimate", { hours: estimatedHours })}
                  </Badge>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-base sm:text-lg leading-tight" data-testid={`task-title-${id}`}>
                  {title}
                </h3>
                {projectName && (
                  <Badge variant="outline" className="text-[10px] font-medium" data-testid={`task-project-${id}`}>
                    {projectName}
                  </Badge>
                )}
              </div>

              {dueDate && (
                <div 
                  className={`flex flex-wrap items-center gap-2 mb-2 text-xs ${
                    isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 
                    isDueSoon ? 'text-amber-600 dark:text-amber-400 font-semibold' : 
                    'text-muted-foreground'
                  }`} 
                  data-testid={`task-due-${id}`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-medium">{resolveDueDate(dueDate)}</span>
                  {relativeDue && <span className="opacity-80">({relativeDue})</span>}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 opacity-50 group-hover:opacity-100 hover:bg-accent transition-all duration-150 sm:opacity-40" 
                  data-testid={`task-more-${id}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={t("tasks.card.actions.menu")}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(id); }}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>{t("tasks.card.actions.edit")}</span>
                  </DropdownMenuItem>
                )}
                {onToggleFavorite && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}>
                    <Star className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? t("tasks.card.actions.unfavorite") : t("tasks.card.actions.favorite")}</span>
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(id); }}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>{t("tasks.card.actions.duplicate")}</span>
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(id); }}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>{t("tasks.card.actions.share")}</span>
                  </DropdownMenuItem>
                )}
                {onArchive && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(id); }}>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>{t("tasks.card.actions.archive")}</span>
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("tasks.card.actions.delete")}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`h-7 text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${statusConfig[status].className}`}
              onClick={handleStatusChange}
              data-testid={`task-status-${id}`}
              role="button"
              aria-label={t("tasks.card.actions.changeStatus", { status: statusConfig[status].label })}
            >
              {statusConfig[status].label}
            </Badge>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-xs font-medium transition-opacity duration-150 ${priorityConfig[priority].className}`} 
                data-testid={`task-priority-${id}`}
              >
                {priorityConfig[priority].label}
              </Badge>

              {relatedChatId && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 transition-all duration-150 hover:bg-accent hover:scale-110"
                  onClick={(event) => {
                    event.stopPropagation();
                    window.location.href = `/chat/channel/${relatedChatId}`;
                  }}
                  title={t("tasks.card.related.chat")}
                  aria-label={t("tasks.card.related.chat")}
                  data-testid={`task-chat-${id}`}
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              )}

              {relatedMeetingId && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 transition-all duration-150 hover:bg-accent hover:scale-110"
                  onClick={(event) => {
                    event.stopPropagation();
                    window.location.href = `/meetings/${relatedMeetingId}`;
                  }}
                  title={t("tasks.card.related.meeting")}
                  aria-label={t("tasks.card.related.meeting")}
                  data-testid={`task-meeting-${id}`}
                >
                  <Calendar className="h-3 w-3" />
                </Button>
              )}

              {assignee && (
                <Avatar 
                  className="w-6 h-6 ring-2 ring-background transition-all duration-150 hover:ring-primary/20" 
                  data-testid={`task-assignee-${id}`}
                  title={assignee.name}
                >
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
