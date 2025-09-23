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

interface MeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingDetails;
  onCreateTask: (task: TaskFromMeeting) => void;
  onCreateKnowledge: (knowledge: KnowledgeFromMeeting) => void;
  onShareToChat: (content: string) => void;
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
  onShareToChat 
}: MeetingDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newActionItem, setNewActionItem] = useState("");
  const [newDecision, setNewDecision] = useState("");
  const [meetingNotes, setMeetingNotes] = useState(meeting.notes || "");

  const handleAddActionItem = () => {
    if (newActionItem.trim()) {
      // Convert action item to task
      onCreateTask({
        title: newActionItem.trim(),
        description: `Action item from meeting: ${meeting.title}`,
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

  const generateMeetingSummary = () => {
    const formattedDate = format(meeting.startTime, "PPP 'at' p");
    const duration = Math.round((meeting.endTime.getTime() - meeting.startTime.getTime()) / (1000 * 60));
    
    let summary = `## Meeting Summary: ${meeting.title}\n\n`;
    summary += `📅 **Date:** ${formattedDate}\n`;
    summary += `⏱️ **Duration:** ${duration} minutes\n`;
    summary += `👥 **Participants:** ${meeting.participants.map(p => p.name).join(", ")}\n\n`;
    
    if (meeting.decisions && meeting.decisions.length > 0) {
      summary += `## 🎯 Key Decisions\n`;
      meeting.decisions.forEach((decision, index) => {
        summary += `${index + 1}. ${decision}\n`;
      });
      summary += `\n`;
    }
    
    if (meeting.actionItems && meeting.actionItems.length > 0) {
      summary += `## ✅ Action Items\n`;
      meeting.actionItems.forEach((item, index) => {
        const assignee = item.assignee ? ` (@${item.assignee})` : "";
        const dueDate = item.dueDate ? ` - Due: ${format(item.dueDate, "MMM d")}` : "";
        summary += `${index + 1}. ${item.description}${assignee}${dueDate}\n`;
      });
      summary += `\n`;
    }
    
    if (meetingNotes) {
      summary += `## 📝 Notes\n${meetingNotes}\n\n`;
    }
    
    return summary;
  };

  const getPlatformIcon = () => {
    switch (meeting.platform) {
      case "zoom": return "🔵";
      case "meet": return "🟢";
      case "teams": return "🟣";
      default: return "🔗";
    }
  };

  const getStatusColor = () => {
    switch (meeting.status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto" data-testid="meeting-details-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {meeting.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </Badge>
            <span>{format(meeting.startTime, "PPP 'at' p")}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="recordings">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(meeting.startTime, "PPP")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(meeting.startTime, "p")} - {format(meeting.endTime, "p")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{getPlatformIcon()}</span>
                  <span className="capitalize">{meeting.platform}</span>
                </div>
              </div>

              {meeting.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">Participants ({meeting.participants.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {meeting.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={participant.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}`} />
                        <AvatarFallback className="text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {meeting.platformUrl && (
                <div>
                  <Label className="text-sm font-medium">Meeting Link</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={meeting.platformUrl} readOnly className="text-sm" />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(meeting.platformUrl!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div>
              <Label htmlFor="meeting-notes" className="text-sm font-medium">Meeting Notes</Label>
              <Textarea
                id="meeting-notes"
                placeholder="Add your meeting notes here..."
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                rows={8}
                className="mt-2"
                data-testid="meeting-notes-textarea"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Key Decisions</Label>
              <div className="space-y-2 mt-2">
                {meeting.decisions?.map((decision, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-secondary rounded">
                    <Badge variant="outline" className="mt-0.5">#{index + 1}</Badge>
                    <span className="text-sm">{decision}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a decision..."
                    value={newDecision}
                    onChange={(e) => setNewDecision(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newDecision.trim()) {
                        // Add decision logic here
                        setNewDecision("");
                      }
                    }}
                  />
                  <Button size="sm" variant="outline">Add</Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => onCreateKnowledge({
                title: `Meeting Notes: ${meeting.title}`,
                content: meetingNotes,
                category: "Meeting Notes",
                tags: ["meeting", "notes"],
                relatedMeetingId: meeting.id,
                relatedChatId: meeting.relatedChatId,
              })}>
                <BookOpen className="h-4 w-4 mr-2" />
                Save as Knowledge
              </Button>
              <Button variant="outline" onClick={handleShareSummary}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Share Summary to Chat
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Action Items</Label>
              <div className="space-y-2 mt-2">
                {meeting.actionItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input 
                      type="checkbox" 
                      checked={item.completed}
                      className="rounded"
                      onChange={() => {/* Handle toggle completion */}}
                    />
                    <div className="flex-1">
                      <div className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.description}
                      </div>
                      {item.assignee && (
                        <div className="text-xs text-muted-foreground">
                          Assigned to: {item.assignee}
                        </div>
                      )}
                      {item.dueDate && (
                        <div className="text-xs text-muted-foreground">
                          Due: {format(item.dueDate, "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCreateTask({
                        title: item.description,
                        description: `Action item from meeting: ${meeting.title}`,
                        assigneeId: item.assignee,
                        dueDate: item.dueDate,
                        relatedMeetingId: meeting.id,
                        relatedChatId: meeting.relatedChatId,
                      })}
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new action item..."
                    value={newActionItem}
                    onChange={(e) => setNewActionItem(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddActionItem();
                      }
                    }}
                    data-testid="new-action-item-input"
                  />
                  <Button onClick={handleAddActionItem} size="sm">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Recordings & Files</Label>
              <div className="space-y-2 mt-2">
                {meeting.recordings && meeting.recordings.length > 0 ? (
                  meeting.recordings.map((recording) => (
                    <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{recording.name}</div>
                        {recording.duration && (
                          <div className="text-xs text-muted-foreground">
                            Duration: {Math.round(recording.duration / 60)} minutes
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={recording.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recordings available</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {meeting.status === "ongoing" && (
            <Button>
              End Meeting
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
