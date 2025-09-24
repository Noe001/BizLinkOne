import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Calendar, Users, FileText, MoreHorizontal, Clock, Play, CheckCircle, XCircle } from "lucide-react";
import { format, formatDistanceToNow, isSameDay } from "date-fns";

export type MeetingStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

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
}

const statusConfig = {
  scheduled: {
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    icon: Clock,
    label: "Upcoming"
  },
  ongoing: {
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 animate-pulse",
    icon: Play,
    label: "Live"
  },
  completed: {
  color: "bg-card text-card-foreground border-card-border dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
    icon: CheckCircle,
    label: "Ended"
  },
  cancelled: {
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
    label: "Cancelled"
  },
};

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
}: MeetingCardProps) {
  const PlatformIcon = platformIcons[platform];
  const StatusIcon = statusConfig[status].icon;
  const isNow = status === "ongoing";
  const isUpcoming = status === "scheduled" && startTime > new Date();

  // ASCII-safe time range formatter (avoids problematic unicode separators)
  const formatMeetingRange = (start: Date, end: Date) => {
    const today = new Date();
    const isToday = isSameDay(start, today);
    if (isToday) {
      return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
    }
    const dateStr = format(start, "MMMM d (EEE)");
    return `${dateStr} ${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
  };

  // Enhanced date formatting function
  const formatMeetingTime = (start: Date, end: Date) => {
    const today = new Date();
    const isToday = isSameDay(start, today);
    
    if (isToday) {
      // Today: "17:17 – 18:17"
      return `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
    } else {
      // Other days: "September 14 (Thu) 17:17 – 18:17"
      const dateStr = format(start, "MMMM d (EEE)");
      const timeStr = `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
      return `${dateStr} ${timeStr}`;
    }
  };

  const handleCardClick = () => {
    console.log(`Meeting ${id} clicked`);
    onClick?.(id);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Joining meeting ${id}`);
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
              {formatMeetingRange(startTime, endTime)}
            </span>
            {isUpcoming && (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                ({formatDistanceToNow(startTime, { addSuffix: true })})
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
                      {participant.name.split(' ').map(n => n[0]).join('')}
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
                >
                  <FileText className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Join button positioned at bottom-right */}
          {(isNow || isUpcoming) && (
            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                variant={isNow ? "default" : "outline"}
                onClick={handleJoin}
                data-testid={`meeting-join-${id}`}
                className={`px-4 text-sm font-medium ${isNow ? 'bg-green-800 hover:bg-green-900' : ''}`}
              >
                {isNow ? "Join Now" : "Join"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
