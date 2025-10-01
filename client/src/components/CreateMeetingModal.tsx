import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Video, Clock, Users, X, Plus } from "lucide-react";
import { format } from "date-fns";
import type { Locale } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";
import { sampleParticipants, sampleChannels } from "@/data/sampleWorkspace";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMeeting: (meeting: CreateMeetingData) => void;
}

export interface CreateMeetingData {
  title: string;
  description: string;
  startDate: Date;
  startTime: string;
  duration: number;
  platform: "zoom" | "meet" | "teams" | "other";
  platformUrl?: string;
  participants: string[];
  relatedChatId?: string;
  isRecurring: boolean;
  recurringPattern?: "daily" | "weekly" | "monthly";
  sendReminders: boolean;
  generateNotes: boolean;
}

const durationOptions = [15, 30, 60, 90, 120] as const;
const platformOptions = ["zoom", "meet", "teams", "other"] as const;
const recurringOptions = ["daily", "weekly", "monthly"] as const;
const NO_CHANNEL_VALUE = "__no_channel__";

export function CreateMeetingModal({ isOpen, onClose, onCreateMeeting }: CreateMeetingModalProps) {
  const { t, language } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState<number>(60);
  const [platform, setPlatform] = useState<CreateMeetingData["platform"]>("zoom");
  const [platformUrl, setPlatformUrl] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [relatedChatId, setRelatedChatId] = useState<string | undefined>(undefined);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<CreateMeetingData["recurringPattern"]>("weekly");
  const [sendReminders, setSendReminders] = useState(true);
  const [generateNotes, setGenerateNotes] = useState(true);

  const derivedLocale: Locale | undefined = language === "ja" ? jaLocale : undefined;

  const availableParticipants = useMemo(
    () => sampleParticipants.filter((participant) => !participants.includes(participant.id)),
    [participants]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !startDate) {
      return;
    }

    onCreateMeeting({
      title: title.trim(),
      description: description.trim(),
      startDate,
      startTime,
      duration,
      platform,
      platformUrl: platformUrl.trim() || undefined,
      participants,
  relatedChatId,
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      sendReminders,
      generateNotes,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(undefined);
    setStartTime("09:00");
    setDuration(60);
    setPlatform("zoom");
    setPlatformUrl("");
    setParticipants([]);
  setRelatedChatId(undefined);
    setIsRecurring(false);
    setRecurringPattern("weekly");
    setSendReminders(true);
    setGenerateNotes(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addParticipant = (participantId: string) => {
    if (!participants.includes(participantId)) {
      setParticipants((prev) => [...prev, participantId]);
    }
  };

  const removeParticipant = (participantId: string) => {
    setParticipants((prev) => prev.filter((id) => id !== participantId));
  };

  const formatDateLabel = (date: Date) => {
    return format(date, language === "ja" ? "yyyy年M月d日" : "PPP", { locale: derivedLocale });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="create-meeting-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {t("meetings.create.title")}
          </DialogTitle>
          <DialogDescription>
            {t("meetings.create.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="meeting-title">{t("meetings.create.form.titleLabel")}</Label>
            <Input
              id="meeting-title"
              placeholder={t("meetings.create.form.titlePlaceholder")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              data-testid="meeting-title-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meeting-description">{t("meetings.create.form.descriptionLabel")}</Label>
            <Textarea
              id="meeting-description"
              placeholder={t("meetings.create.form.descriptionPlaceholder")}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              data-testid="meeting-description-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t("meetings.create.form.dateLabel")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                    data-testid="meeting-date-button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDateLabel(startDate) : t("meetings.create.form.datePlaceholder")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={derivedLocale}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meeting-time">{t("meetings.create.form.timeLabel")}</Label>
              <Input
                id="meeting-time"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                required
                data-testid="meeting-time-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="meeting-duration">{t("meetings.create.form.durationLabel")}</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value, 10))}>
                <SelectTrigger data-testid="meeting-duration-select">
                  <SelectValue placeholder={t("meetings.create.form.durationPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {t(`meetings.create.form.durationOptions.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meeting-platform">{t("meetings.create.form.platformLabel")}</Label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as CreateMeetingData["platform"]) }>
                <SelectTrigger data-testid="meeting-platform-select">
                  <SelectValue placeholder={t("meetings.create.form.platformPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`meetings.details.platform.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {platform === "other" && (
            <div className="grid gap-2">
              <Label htmlFor="platform-url">{t("meetings.create.form.platformUrlLabel")}</Label>
              <Input
                id="platform-url"
                placeholder={t("meetings.create.form.platformUrlPlaceholder")}
                value={platformUrl}
                onChange={(event) => setPlatformUrl(event.target.value)}
                data-testid="platform-url-input"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label>{t("meetings.create.form.participantsLabel")}</Label>

            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {participants.map((participantId) => {
                  const participant = sampleParticipants.find((item) => item.id === participantId);
                  return (
                    <Badge
                      key={participantId}
                      variant="secondary"
                      className="text-xs"
                      data-testid={`participant-${participantId}`}
                    >
                      {participant?.name ?? participantId}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeParticipant(participantId)}
                        aria-label={t("meetings.create.form.removeParticipant", { name: participant?.name ?? participantId })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="grid gap-2">
                {availableParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{participant.name}</div>
                      {participant.email && (
                        <div className="text-muted-foreground text-xs">{participant.email}</div>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addParticipant(participant.id)}
                      data-testid={`add-participant-${participant.id}`}
                      aria-label={t("meetings.create.form.addParticipant", { name: participant.name })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {availableParticipants.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t("meetings.create.form.participantsAllAdded")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="related-chat">{t("meetings.create.form.channelLabel")}</Label>
            <Select
              value={relatedChatId ?? NO_CHANNEL_VALUE}
              onValueChange={(value) => setRelatedChatId(value === NO_CHANNEL_VALUE ? undefined : value)}
            >
              <SelectTrigger data-testid="related-chat-select">
                <SelectValue placeholder={t("meetings.create.form.channelPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CHANNEL_VALUE}>{t("meetings.create.form.channelNone")}</SelectItem>
                {sampleChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    #{channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(Boolean(checked))}
                data-testid="recurring-checkbox"
              />
              <Label htmlFor="recurring">{t("meetings.create.form.recurringLabel")}</Label>
            </div>

            {isRecurring && (
              <div className="ml-6 grid gap-2">
                <Label htmlFor="recurring-pattern">{t("meetings.create.form.recurringPatternLabel")}</Label>
                <Select value={recurringPattern ?? "weekly"} onValueChange={(value) => setRecurringPattern(value as CreateMeetingData["recurringPattern"])}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`meetings.create.form.recurringOptions.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminders"
                checked={sendReminders}
                onCheckedChange={(checked) => setSendReminders(Boolean(checked))}
                data-testid="reminders-checkbox"
              />
              <Label htmlFor="reminders">{t("meetings.create.form.remindersLabel")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-notes"
                checked={generateNotes}
                onCheckedChange={(checked) => setGenerateNotes(Boolean(checked))}
                data-testid="generate-notes-checkbox"
              />
              <Label htmlFor="generate-notes">{t("meetings.create.form.notesLabel")}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("meetings.create.actions.cancel")}
            </Button>
            <Button type="submit" disabled={!title.trim() || !startDate} data-testid="create-meeting-button">
              {t("meetings.create.actions.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
