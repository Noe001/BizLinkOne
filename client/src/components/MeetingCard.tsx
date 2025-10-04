import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Video, Calendar, Users, FileText, MoreHorizontal, Clock, Play, CheckCircle, XCircle, Edit, Trash2, Copy, Share2, Star } from "lucide-react";
import { format, formatDistanceToNow, isSameDay } from "date-fns";
import type { Locale } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";
import { getTagColor } from "@/utils/tagColors";

export type MeetingStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

import type { MouseEvent } from "react";

interface MeetingCardProps {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: MeetingStatus;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }> | null;
  platform?: "zoom" | "meet" | "teams";
  hasRecording?: boolean;
  hasNotes?: boolean;
  relatedChatId?: string;
  onJoin?: (meetingId: string) => void;
  onClick?: (meetingId: string) => void;
  onEdit?: (meetingId: string) => void;
  onDelete?: (meetingId: string) => void;
  onDuplicate?: (meetingId: string) => void;
  onShare?: (meetingId: string) => void;
  onToggleFavorite?: (meetingId: string) => void;
  onCancel?: (meetingId: string) => void;
  isFavorite?: boolean;
  locale?: Locale;
}

const platformIcons = {
  zoom: Video,
  meet: Video,
  teams: Video,
};

export function MeetingCard({
  id,
  title,
  description,
  startTime,
  endTime,
  status,
  participants,
  platform = "zoom",
  hasRecording = false,
  hasNotes = false,
  relatedChatId,
  onJoin,
  onClick,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onToggleFavorite,
  onCancel,
  isFavorite = false,
  locale,
}: MeetingCardProps) {
  const { t, language } = useTranslation();
  const PlatformIcon = platformIcons[platform];
  const derivedLocale = locale ?? (language === "ja" ? jaLocale : undefined);
  const statusConfig = {
    scheduled: {
      color: getTagColor("scheduled"),
      icon: Clock,
      label: t("meetings.card.status.upcoming"),
    },
    ongoing: {
      color: `${getTagColor("ongoing")} animate-live-slow`,
      icon: Play,
      label: t("meetings.card.status.live"),
    },
    completed: {
      color: getTagColor("completed"),
      icon: CheckCircle,
      label: t("meetings.card.status.ended"),
    },
    cancelled: {
      color: getTagColor("cancelled"),
      icon: XCircle,
      label: t("meetings.card.status.cancelled"),
    },
  } satisfies Record<MeetingStatus, { color: string; icon: typeof Clock; label: string }>;

  const StatusIcon = statusConfig[status].icon;
  const isNow = status === "ongoing";
  const isUpcoming = status === "scheduled" && startTime > new Date();

  const formatRange = (start: Date, end: Date) => {
    const today = new Date();
    const isToday = isSameDay(start, today);

    if (language === "ja") {
      const startLabel = format(start, "HH:mm", { locale: derivedLocale });
      const endLabel = format(end, "HH:mm", { locale: derivedLocale });
      if (isToday) {
        return `${startLabel} 〜 ${endLabel}`;
      }
      const dateStr = format(start, "M月d日(E)", { locale: derivedLocale });
      return `${dateStr} ${startLabel} 〜 ${endLabel}`;
    }

    if (isToday) {
      return `${format(start, "HH:mm", { locale: derivedLocale })} - ${format(end, "HH:mm", { locale: derivedLocale })}`;
    }
    const dateStr = format(start, "MMMM d (EEE)", { locale: derivedLocale });
    return `${dateStr} ${format(start, "HH:mm", { locale: derivedLocale })} - ${format(end, "HH:mm", { locale: derivedLocale })}`;
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleJoin = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onJoin?.(id);
  };

  return (
    <Card
      className="hover-elevate cursor-pointer group transition-all duration-200 hover:shadow-lg active:scale-[0.98] touch-manipulation"
      onClick={handleCardClick}
      data-testid={`meeting-card-${id}`}
      aria-label={`${title} - ${statusConfig[status].label}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <PlatformIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-semibold text-sm sm:text-base leading-tight truncate" data-testid={`meeting-title-${id}`}>
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={`h-6 text-xs px-2 gap-1 transition-opacity duration-150 ${statusConfig[status].color}`}
              data-testid={`meeting-status-${id}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig[status].label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-50 group-hover:opacity-100 hover:bg-accent transition-all duration-150 sm:opacity-40"
                  data-testid={`meeting-more-${id}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={t("meetings.card.actions.menu")}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onEdit && status !== "cancelled" && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(id); }}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>{t("meetings.card.actions.edit")}</span>
                  </DropdownMenuItem>
                )}
                {onToggleFavorite && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}>
                    <Star className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? t("meetings.card.actions.unfavorite") : t("meetings.card.actions.favorite")}</span>
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(id); }}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>{t("meetings.card.actions.duplicate")}</span>
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(id); }}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>{t("meetings.card.actions.share")}</span>
                  </DropdownMenuItem>
                )}
                {onCancel && status === "scheduled" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCancel(id); }}>
                      <XCircle className="mr-2 h-4 w-4" />
                      <span>{t("meetings.card.actions.cancel")}</span>
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (status === "completed" || status === "cancelled") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("meetings.card.actions.delete")}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2" data-testid={`meeting-description-${id}`}>
            {description}
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3 h-3" />
            <span data-testid={`meeting-time-${id}`} className="font-medium">
              {formatRange(startTime, endTime)}
            </span>
            {isUpcoming && (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                ({formatDistanceToNow(startTime, { addSuffix: true, locale: derivedLocale })})
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-muted-foreground" />
              <div className="flex -space-x-1" data-testid={`meeting-participants-${id}`}>
                {(participants || []).slice(0, 3).map((participant) => (
                  <Avatar key={participant.id} className="w-5 h-5 border border-background">
                    <AvatarImage src={participant.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}`} />
                    <AvatarFallback className="text-xs">
                      {participant.name.split(" ").map((segment) => segment[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {(participants && participants.length > 3) && (
                  <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center">
                    <span className="text-xs">+{participants.length - 3}</span>
                  </div>
                )}
              </div>
              {hasNotes && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 ml-2"
                  data-testid={`meeting-notes-${id}`}
                  aria-label={t("meetings.card.accessNotes")}
                >
                  <FileText className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {(isNow || isUpcoming) && (
            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                variant={isNow ? "default" : "outline"}
                onClick={handleJoin}
                data-testid={`meeting-join-${id}`}
                className={`px-4 text-sm font-medium ${isNow ? "bg-green-800 hover:bg-green-900" : ""}`}
              >
                {isNow ? t("meetings.card.joinNow") : t("meetings.card.join")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
