import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  CheckSquare, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  Timer,
  Tag,
  AlertCircle,
  X
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { TaskStatus, TaskPriority } from "./TaskCard";
import { useWorkspaceData } from "@/contexts/WorkspaceDataContext";
import { useLocation } from "wouter";

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskDetailData | null;
  onTaskUpdate: (taskId: string, updates: Partial<TaskDetailData>) => void;
  onTaskDelete: (taskId: string) => void;
}

export interface TaskDetailData {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  relatedChatId?: string;
  relatedMeetingId?: string;
  projectId?: string;
  projectName?: string;
  subtasks: SubTask[];
  comments: TaskComment[];
  timeEntries: TimeEntry[];
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}

interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
}

interface TimeEntry {
  id: string;
  description: string;
  hours: number;
  date: Date;
  userId: string;
  userName: string;
}

const priorityConfig = {
  low: { label: "🟢 Low", color: "bg-green-100 text-green-800" },
  medium: { label: "🟡 Medium", color: "bg-yellow-100 text-yellow-800" },
  high: { label: "🟠 High", color: "bg-orange-100 text-orange-800" },
  urgent: { label: "🔴 Urgent", color: "bg-red-100 text-red-800" },
};

const statusConfig = {
  todo: { label: "📋 To Do", color: "bg-gray-100 text-gray-800" },
  "in-progress": { label: "🔄 In Progress", color: "bg-blue-100 text-blue-800" },
  review: { label: "👀 Review", color: "bg-purple-100 text-purple-800" },
  done: { label: "✅ Done", color: "bg-green-100 text-green-800" },
};

export function TaskDetailModal({ open, onOpenChange, task, onTaskUpdate, onTaskDelete }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<TaskDetailData>>({});
  const [newComment, setNewComment] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [newTimeEntry, setNewTimeEntry] = useState({ description: "", hours: "" });
  const { getChannelById, getMeetingById } = useWorkspaceData();
  const [, setLocation] = useLocation();

  if (!task) return null;

  const channel = task.relatedChatId ? getChannelById(task.relatedChatId) : undefined;
  const meeting = task.relatedMeetingId ? getMeetingById(task.relatedMeetingId) : undefined;

  const handleOpenChatContext = () => {
    if (!task.relatedChatId) return;
    setLocation(`/chat/channel/${task.relatedChatId}`);
    onOpenChange(false);
  };

  const handleOpenMeetingContext = () => {
    if (!task.relatedMeetingId) return;
    setLocation("/meetings");
    onOpenChange(false);
  };

  const handleSaveEdit = () => {
    if (!isEditing || !editData) return;
    onTaskUpdate(task.id, editData);
    // Don't reset local state immediately - wait for parent to re-render with updated props
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: TaskComment = {
      id: `comment-${Date.now()}`,
      content: newComment.trim(),
      authorId: "current-user",
      authorName: "You",
      authorAvatar: "",
      createdAt: new Date(),
    };

    onTaskUpdate(task.id, {
      comments: [...task.comments, comment]
    });
    setNewComment("");
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const subtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubtask.trim(),
      completed: false,
    };

    onTaskUpdate(task.id, {
      subtasks: [...task.subtasks, subtask]
    });
    setNewSubtask("");
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    
    onTaskUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const handleAddTimeEntry = () => {
    if (!newTimeEntry.description.trim() || !newTimeEntry.hours) return;
    
    const timeEntry: TimeEntry = {
      id: `time-${Date.now()}`,
      description: newTimeEntry.description.trim(),
      hours: parseFloat(newTimeEntry.hours),
      date: new Date(),
      userId: "current-user",
      userName: "You",
    };

    onTaskUpdate(task.id, {
      timeEntries: [...task.timeEntries, timeEntry],
      actualHours: (task.actualHours || 0) + timeEntry.hours
    });
    setNewTimeEntry({ description: "", hours: "" });
  };

  const totalTimeLogged = task.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editData.title || task.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold"
              />
            ) : (
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveEdit} size="sm">Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button onClick={() => onTaskDelete(task.id)} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="subtasks">
                Subtasks ({completedSubtasks}/{task.subtasks.length})
              </TabsTrigger>
              <TabsTrigger value="comments">Comments ({task.comments.length})</TabsTrigger>
              <TabsTrigger value="time">Time ({totalTimeLogged.toFixed(1)}h)</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="details" className="space-y-6 m-0">
                {/* Task Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Status & Priority
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {isEditing ? (
                        <>
                          <Select
                            value={editData.status || task.status}
                            onValueChange={(value: TaskStatus) => setEditData(prev => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  {config.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={editData.priority || task.priority}
                            onValueChange={(value: TaskPriority) => setEditData(prev => ({ ...prev, priority: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(priorityConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  {config.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      ) : (
                        <>
                          <Badge className={statusConfig[task.status].color}>
                            {statusConfig[task.status].label}
                          </Badge>
                          <Badge className={priorityConfig[task.priority].color}>
                            {priorityConfig[task.priority].label}
                          </Badge>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assignment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>
                              {task.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Unassigned</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Timing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      {task.dueDate && (
                        <div>
                          <span className="text-muted-foreground">Due: </span>
                          <span>{format(task.dueDate, "MMM dd, yyyy")}</span>
                        </div>
                      )}
                      {task.estimatedHours && (
                        <div>
                          <span className="text-muted-foreground">Estimate: </span>
                          <span>{task.estimatedHours}h</span>
                        </div>
                      )}
                      {totalTimeLogged > 0 && (
                        <div>
                          <span className="text-muted-foreground">Logged: </span>
                          <span>{totalTimeLogged.toFixed(1)}h</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editData.description || task.description || ""}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        placeholder="Add a description..."
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {task.description || "No description provided."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                {task.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(task.relatedChatId || task.relatedMeetingId) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Related Context
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {task.relatedChatId && (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">#{channel?.name ?? task.relatedChatId}</p>
                              <p className="text-xs text-muted-foreground">Chat channel</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={handleOpenChatContext}>
                            Open chat
                          </Button>
                        </div>
                      )}
                      {task.relatedMeetingId && (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{meeting?.title ?? task.relatedMeetingId}</p>
                              <p className="text-xs text-muted-foreground">Meeting record</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={handleOpenMeetingContext}>
                            View meeting
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="subtasks" className="space-y-4 m-0">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                  />
                  <Button onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                        className="rounded"
                      />
                      <span className={`flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                  {task.subtasks.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No subtasks yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 m-0">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.authorAvatar} />
                        <AvatarFallback>
                          {comment.authorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {task.comments.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No comments yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="time" className="space-y-4 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Log Time</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="What did you work on?"
                      value={newTimeEntry.description}
                      onChange={(e) => setNewTimeEntry(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.25"
                        placeholder="Hours"
                        value={newTimeEntry.hours}
                        onChange={(e) => setNewTimeEntry(prev => ({ ...prev, hours: e.target.value }))}
                        className="w-24"
                      />
                      <Button 
                        onClick={handleAddTimeEntry} 
                        disabled={!newTimeEntry.description.trim() || !newTimeEntry.hours}
                      >
                        <Timer className="h-4 w-4 mr-2" />
                        Log Time
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-2">
                  {task.timeEntries.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.userName} • {format(entry.date, "MMM dd, yyyy")}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{entry.hours}h</span>
                    </div>
                  ))}
                  {task.timeEntries.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No time logged yet.</p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
