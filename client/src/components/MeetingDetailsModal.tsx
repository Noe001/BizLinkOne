import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Calendar, Clock, Users, MessageSquare, CheckSquare, BookOpen, Copy, Share } from "lucide-react";
import { format } from "date-fns";
import type { Locale } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";

interface MeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingDetails;
  onCreateTask: (task: TaskFromMeeting) => void;
  onCreateKnowledge: (knowledge: KnowledgeFromMeeting) => void;
  onShareToChat: (content: string) => void;
  locale?: Locale;
}

export interface MeetingDetails {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  participants: Array<{
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  }>;
  platform: "zoom" | "meet" | "teams" | "other";
  platformUrl?: string;
  relatedChatId?: string;
  notes?: string;
  decisions?: string[];
  actionItems?: Array<{
    id: string;
    description: string;
    assignee?: string;
    dueDate?: Date;
    completed: boolean;
  }>;
  recordings?: Array<{
    id: string;
    name: string;
    url: string;
    duration?: number;
  }>;
}

export interface TaskFromMeeting {
  title: string;
  description: string;
  assigneeId?: string;
  dueDate?: Date;
  relatedMeetingId: string;
  relatedChatId?: string;
}

export interface KnowledgeFromMeeting {
  title: string;
  content: string;
  category: string;
  tags: string[];
  relatedMeetingId: string;
  relatedChatId?: string;
}

export function MeetingDetailsModal({
  isOpen,
  onClose,
  meeting,
  onCreateTask,
  onCreateKnowledge,
  onShareToChat,
  locale,
}: MeetingDetailsModalProps) {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [newActionItem, setNewActionItem] = useState("");
  const [newDecision, setNewDecision] = useState("");
  const [meetingNotes, setMeetingNotes] = useState(meeting.notes || "");
  const derivedLocale = locale ?? (language === "ja" ? jaLocale : undefined);

  const handleAddActionItem = () => {
    if (newActionItem.trim()) {
      onCreateTask({
        title: newActionItem.trim(),
        description: t("meetings.details.actionItemTaskDescription", { title: meeting.title }),
        relatedMeetingId: meeting.id,
        relatedChatId: meeting.relatedChatId,
      });
      setNewActionItem("");
    }
  };

  const handleShareSummary = () => {
    const summary = generateMeetingSummary();
    onShareToChat(summary);
  };

  const formatDate = (date: Date, patternEn: string, patternJa: string) => {
    const pattern = language === "ja" ? patternJa : patternEn;
    return format(date, pattern, { locale: derivedLocale });
  };

  const generateMeetingSummary = () => {
    const formattedDate = formatDate(meeting.startTime, "PPP p", "yyyy年M月d日 HH:mm");
    const duration = Math.round((meeting.endTime.getTime() - meeting.startTime.getTime()) / (1000 * 60));
    const participantNames = meeting.participants.map((participant) => participant.name).join(language === "ja" ? "、" : ", ");

    const lines: string[] = [];
    lines.push(t("meetings.details.summary.heading", { title: meeting.title }));
    lines.push("");
    lines.push(t("meetings.details.summary.date", { value: formattedDate }));
    lines.push(t("meetings.details.summary.duration", { minutes: duration }));
    lines.push(t("meetings.details.summary.participants", { names: participantNames }));
    lines.push("");

    if (meeting.decisions && meeting.decisions.length > 0) {
      lines.push(t("meetings.details.summary.decisionsHeading"));
      meeting.decisions.forEach((decision, index) => {
        lines.push(t("meetings.details.summary.decisionItem", { index: index + 1, text: decision }));
      });
      lines.push("");
    }

    if (meeting.actionItems && meeting.actionItems.length > 0) {
      lines.push(t("meetings.details.summary.actionItemsHeading"));
      meeting.actionItems.forEach((item, index) => {
        const assigneeSuffix = item.assignee ? t("meetings.details.summary.actionAssignee", { assignee: item.assignee }) : "";
        const dueSuffix = item.dueDate
          ? t("meetings.details.summary.actionDue", { due: formatDate(item.dueDate, "MMM d", "M月d日") })
          : "";
        lines.push(t("meetings.details.summary.actionItem", {
          index: index + 1,
          text: item.description,
          assignee: assigneeSuffix,
          due: dueSuffix,
        }));
      });
      lines.push("");
    }

    return lines.join("\n");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">{meeting.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("meetings.details.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">{t("meetings.details.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="notes">{t("meetings.details.tabs.notes")}</TabsTrigger>
            <TabsTrigger value="actions">{t("meetings.details.tabs.actions")}</TabsTrigger>
            <TabsTrigger value="recordings">{t("meetings.details.tabs.recordings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">{t("meetings.details.overview.schedule")}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Calendar className="inline-block h-3 w-3 mr-1" />
                    {formatDate(meeting.startTime, "PPP p", "yyyy年M月d日 HH:mm")} — {formatDate(meeting.endTime, "p", "HH:mm")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t("meetings.details.overview.platform")}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Video className="inline-block h-3 w-3 mr-1" />
                    {t(`meetings.details.platform.${meeting.platform}`)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t("meetings.details.overview.duration")}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Clock className="inline-block h-3 w-3 mr-1" />
                    {t("meetings.details.summary.duration", {
                      minutes: Math.round((meeting.endTime.getTime() - meeting.startTime.getTime()) / (1000 * 60)),
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {meeting.description && (
                  <div>
                    <Label className="text-sm font-medium">{t("meetings.details.overview.description")}</Label>
                    <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    {t("meetings.details.overview.participants", { count: meeting.participants.length })}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {meeting.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={participant.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}`} />
                          <AvatarFallback className="text-xs">
                            {participant.name.split(" ").map((segment) => segment[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {meeting.platformUrl && (
                  <div>
                    <Label className="text-sm font-medium">{t("meetings.details.overview.link")}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input value={meeting.platformUrl} readOnly className="text-sm" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(meeting.platformUrl!)}
                        aria-label={t("meetings.details.overview.copyLink")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="meeting-notes" className="text-sm font-medium">{t("meetings.details.notes.title")}</Label>
              <Textarea
                id="meeting-notes"
                placeholder={t("meetings.details.notes.placeholder")}
                value={meetingNotes}
                onChange={(event) => setMeetingNotes(event.target.value)}
                rows={8}
                className="mt-2"
                data-testid="meeting-notes-textarea"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">{t("meetings.details.decisions.title")}</Label>
              <div className="space-y-2 mt-2">
                {meeting.decisions?.map((decision, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-secondary rounded">
                    <Badge variant="outline" className="mt-0.5">#{index + 1}</Badge>
                    <span className="text-sm">{decision}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder={t("meetings.details.decisions.placeholder")}
                    value={newDecision}
                    onChange={(event) => setNewDecision(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && newDecision.trim()) {
                        setNewDecision("");
                      }
                    }}
                  />
                  <Button size="sm" variant="outline">
                    {t("meetings.details.decisions.add")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() =>
                  onCreateKnowledge({
                    title: t("meetings.details.notes.knowledgeTitle", { title: meeting.title }),
                    content: meetingNotes,
                    category: t("meetings.details.notes.category"),
                    tags: ["meeting", "notes"],
                    relatedMeetingId: meeting.id,
                    relatedChatId: meeting.relatedChatId,
                  })
                }
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t("meetings.details.notes.saveKnowledge")}
              </Button>
              <Button variant="outline" onClick={handleShareSummary}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {t("meetings.details.notes.shareSummary")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium">{t("meetings.details.actions.title")}</Label>
              <div className="space-y-2 mt-2">
                {meeting.actionItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="rounded"
                      onChange={() => {}}
                    />
                    <div className="flex-1">
                      <div className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                        {item.description}
                      </div>
                      {item.assignee && (
                        <div className="text-xs text-muted-foreground">
                          {t("meetings.details.actions.assignedTo", { assignee: item.assignee })}
                        </div>
                      )}
                      {item.dueDate && (
                        <div className="text-xs text-muted-foreground">
                          {t("meetings.details.actions.due", {
                            date: formatDate(item.dueDate, "MMM d, yyyy", "yyyy年M月d日"),
                          })}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onCreateTask({
                          title: item.description,
                          description: t("meetings.details.actionItemTaskDescription", { title: meeting.title }),
                          assigneeId: item.assignee,
                          dueDate: item.dueDate,
                          relatedMeetingId: meeting.id,
                          relatedChatId: meeting.relatedChatId,
                        })
                      }
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder={t("meetings.details.actions.placeholder")}
                    value={newActionItem}
                    onChange={(event) => setNewActionItem(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleAddActionItem();
                      }
                    }}
                    data-testid="new-action-item-input"
                  />
                  <Button onClick={handleAddActionItem} size="sm">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    {t("meetings.details.actions.createTask")}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium">{t("meetings.details.recordings.title")}</Label>
              <div className="space-y-2 mt-2">
                {meeting.recordings && meeting.recordings.length > 0 ? (
                  meeting.recordings.map((recording) => (
                    <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{recording.name}</div>
                        {recording.duration && (
                          <div className="text-xs text-muted-foreground">
                            {t("meetings.details.recordings.duration", {
                              minutes: Math.round(recording.duration / 60),
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={recording.url} target="_blank" rel="noopener noreferrer">
                            {t("meetings.details.recordings.view")}
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">{t("meetings.details.recordings.empty")}</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("meetings.details.footer.close")}
          </Button>
          {meeting.status === "ongoing" && (
            <Button>
              {t("meetings.details.footer.endMeeting")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
