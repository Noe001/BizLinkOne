import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Calendar, Users, FileText, MoreHorizontal, Clock, Play, CheckCircle, XCircle } from "lucide-react";
import { format, formatDistanceToNow, isSameDay } from "date-fns";
import type { Locale } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";

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
  locale,
}: MeetingCardProps) {
  const { t, language } = useTranslation();
  const PlatformIcon = platformIcons[platform];
  const derivedLocale = locale ?? (language === "ja" ? jaLocale : undefined);
  const statusConfig = {
    scheduled: {
      color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      icon: Clock,
      label: t("meetings.card.status.upcoming"),
    },
    ongoing: {
      color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 animate-pulse",
      icon: Play,
      label: t("meetings.card.status.live"),
    },
    completed: {
      color: "bg-card text-card-foreground border-card-border dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
      icon: CheckCircle,
      label: t("meetings.card.status.ended"),
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
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
      className="hover-elevate cursor-pointer group"
      onClick={handleCardClick}
      data-testid={`meeting-card-${id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <PlatformIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-medium text-sm leading-tight truncate" data-testid={`meeting-title-${id}`}>
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              className={`h-6 text-xs px-2 gap-1 ${statusConfig[status].color}`}
              data-testid={`meeting-status-${id}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig[status].label}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              data-testid={`meeting-more-${id}`}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
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
