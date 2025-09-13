import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Calendar, Users, FileText, MoreHorizontal } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

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
  }>;
  platform?: "zoom" | "meet" | "teams";
  hasRecording?: boolean;
  hasNotes?: boolean;
  relatedChatId?: string;
  onJoin?: (meetingId: string) => void;
  onClick?: (meetingId: string) => void;
}

const statusColors = {
  scheduled: "bg-chart-1",
  ongoing: "bg-chart-2 animate-pulse",
  completed: "bg-muted",
  cancelled: "bg-destructive",
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
  const isNow = status === "ongoing";
  const isUpcoming = status === "scheduled" && startTime > new Date();

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
              className={`h-5 text-xs ${statusColors[status]}`}
              data-testid={`meeting-status-${id}`}
            >
              {status}
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span data-testid={`meeting-time-${id}`}>
              {format(startTime, "MMM d, h:mm a")} - {format(endTime, "h:mm a")}
            </span>
            {isUpcoming && (
              <span className="text-chart-1 font-medium">
                ({formatDistanceToNow(startTime, { addSuffix: true })})
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-muted-foreground" />
              <div className="flex -space-x-1" data-testid={`meeting-participants-${id}`}>
                {participants.slice(0, 3).map((participant) => (
                  <Avatar key={participant.id} className="w-5 h-5 border border-background">
                    <AvatarImage src={participant.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}`} />
                    <AvatarFallback className="text-xs">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {participants.length > 3 && (
                  <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center">
                    <span className="text-xs">+{participants.length - 3}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {hasNotes && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  data-testid={`meeting-notes-${id}`}
                >
                  <FileText className="h-3 w-3" />
                </Button>
              )}
              
              {(isNow || isUpcoming) && (
                <Button
                  size="sm"
                  variant={isNow ? "default" : "outline"}
                  onClick={handleJoin}
                  data-testid={`meeting-join-${id}`}
                  className="h-6 px-2 text-xs"
                >
                  {isNow ? "Join Now" : "Join"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}