import { useState } from "react";
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
import { format, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";

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

// Mock participants - in real app, this would come from API
const mockParticipants = [
  { id: "john-doe", name: "John Doe", email: "john@company.com" },
  { id: "sarah-wilson", name: "Sarah Wilson", email: "sarah@company.com" },
  { id: "mike-johnson", name: "Mike Johnson", email: "mike@company.com" },
  { id: "alice-cooper", name: "Alice Cooper", email: "alice@company.com" },
  { id: "bob-smith", name: "Bob Smith", email: "bob@company.com" },
];

// Mock channels for related chat
const mockChannels = [
  { id: "general", name: "general" },
  { id: "development", name: "development" },
  { id: "design", name: "design" },
  { id: "product", name: "product" },
];

export function CreateMeetingModal({ isOpen, onClose, onCreateMeeting }: CreateMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [platform, setPlatform] = useState<"zoom" | "meet" | "teams" | "other">("zoom");
  const [platformUrl, setPlatformUrl] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [relatedChatId, setRelatedChatId] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [sendReminders, setSendReminders] = useState(true);
  const [generateNotes, setGenerateNotes] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !startDate) return;

    onCreateMeeting({
      title: title.trim(),
      description: description.trim(),
      startDate,
      startTime,
      duration,
      platform,
      platformUrl: platformUrl.trim() || undefined,
      participants,
      relatedChatId: relatedChatId || undefined,
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      sendReminders,
      generateNotes,
    });

    // Reset form
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
    setRelatedChatId("");
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
      setParticipants([...participants, participantId]);
    }
  };

  const removeParticipant = (participantId: string) => {
    setParticipants(participants.filter(id => id !== participantId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" data-testid="create-meeting-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Schedule New Meeting
          </DialogTitle>
          <DialogDescription>
            Create a new meeting and automatically notify participants.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="meeting-title">Title *</Label>
            <Input
              id="meeting-title"
              placeholder="Enter meeting title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="meeting-title-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meeting-description">Description</Label>
            <Textarea
              id="meeting-description"
              placeholder="Meeting agenda and details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="meeting-description-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date *</Label>
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
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meeting-time">Start Time *</Label>
              <Input
                id="meeting-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                data-testid="meeting-time-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="meeting-duration">Duration (minutes)</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger data-testid="meeting-duration-select">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meeting-platform">Platform</Label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as any)}>
                <SelectTrigger data-testid="meeting-platform-select">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">🔵 Zoom</SelectItem>
                  <SelectItem value="meet">🟢 Google Meet</SelectItem>
                  <SelectItem value="teams">🟣 Microsoft Teams</SelectItem>
                  <SelectItem value="other">🔗 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {platform === "other" && (
            <div className="grid gap-2">
              <Label htmlFor="platform-url">Meeting URL</Label>
              <Input
                id="platform-url"
                placeholder="https://..."
                value={platformUrl}
                onChange={(e) => setPlatformUrl(e.target.value)}
                data-testid="platform-url-input"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label>Participants</Label>
            
            {/* Selected participants */}
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {participants.map((participantId) => {
                  const participant = mockParticipants.find(p => p.id === participantId);
                  return (
                    <Badge 
                      key={participantId} 
                      variant="secondary" 
                      className="text-xs"
                      data-testid={`participant-${participantId}`}
                    >
                      {participant?.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeParticipant(participantId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Available participants */}
            <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="grid gap-2">
                {mockParticipants.filter(p => !participants.includes(p.id)).map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-muted-foreground text-xs">{participant.email}</div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addParticipant(participant.id)}
                      data-testid={`add-participant-${participant.id}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="related-chat">Related Chat Channel</Label>
            <Select value={relatedChatId} onValueChange={setRelatedChatId}>
              <SelectTrigger data-testid="related-chat-select">
                <SelectValue placeholder="Select channel (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No channel</SelectItem>
                {mockChannels.map((channel) => (
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
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                data-testid="recurring-checkbox"
              />
              <Label htmlFor="recurring">Recurring meeting</Label>
            </div>

            {isRecurring && (
              <div className="ml-6 grid gap-2">
                <Label htmlFor="recurring-pattern">Repeat pattern</Label>
                <Select value={recurringPattern} onValueChange={(value) => setRecurringPattern(value as any)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminders"
                checked={sendReminders}
                onCheckedChange={(checked) => setSendReminders(checked as boolean)}
                data-testid="reminders-checkbox"
              />
              <Label htmlFor="reminders">Send reminder notifications</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-notes"
                checked={generateNotes}
                onCheckedChange={(checked) => setGenerateNotes(checked as boolean)}
                data-testid="generate-notes-checkbox"
              />
              <Label htmlFor="generate-notes">Auto-generate meeting notes template</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !startDate} data-testid="create-meeting-button">
              Schedule Meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
