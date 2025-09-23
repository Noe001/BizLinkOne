import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User, Plus, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { TaskStatus, TaskPriority } from "./TaskCard";
import { setPriority } from "os";
import { title } from "process";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: CreateTaskData) => void;
  messageContent?: string;
  messageAuthor?: string;
  relatedChatId?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
  tags: string[];
  relatedChatId?: string;
  relatedMessageId?: string;
  estimatedHours?: number;
}

// Mock team members - in real app, this would come from user context
const mockTeamMembers = [
  { id: "john-doe", name: "John Doe", avatar: "", role: "Developer" },
  { id: "sarah-wilson", name: "Sarah Wilson", avatar: "", role: "Designer" },
  { id: "mike-johnson", name: "Mike Johnson", avatar: "", role: "Product Manager" },
  { id: "alice-cooper", name: "Alice Cooper", avatar: "", role: "DevOps Engineer" },
  { id: "bob-smith", name: "Bob Smith", avatar: "", role: "QA Engineer" },
];

const mockChatChannels = [
  { id: "general", name: "general" },
  { id: "development", name: "development" },
  { id: "design", name: "design" },
  { id: "product", name: "product" },
  { id: "support", name: "support" },
];

const priorityOptions = [
  { value: "low", label: "🟢 Low", description: "Nice to have" },
  { value: "medium", label: "🟡 Medium", description: "Should be done" },
  { value: "high", label: "🟠 High", description: "Important" },
  { value: "urgent", label: "🔴 Urgent", description: "Critical priority" },
];

const statusOptions = [
  { value: "todo", label: "📋 To Do", description: "Not started yet" },
  { value: "in-progress", label: "🔄 In Progress", description: "Currently working" },
  { value: "review", label: "👀 Review", description: "Pending review" },
  { value: "done", label: "✅ Done", description: "Completed" },
];

export function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onCreateTask, 
  messageContent = "",
  messageAuthor = "",
  relatedChatId
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: messageContent,
    status: "todo",
    priority: "medium",
    assigneeId: undefined,
    dueDate: undefined,
    tags: [],
    relatedChatId: relatedChatId,
    relatedMessageId: undefined,
    estimatedHours: undefined,
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateTaskData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    if (formData.estimatedHours && (formData.estimatedHours <= 0 || formData.estimatedHours > 999)) {
      newErrors.estimatedHours = "Estimated hours must be between 1 and 999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onCreateTask(formData);
      handleReset();
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: messageContent,
      status: "todo",
      priority: "medium",
      assigneeId: undefined,
      dueDate: undefined,
      tags: [],
      relatedChatId: relatedChatId,
      relatedMessageId: undefined,
      estimatedHours: undefined,
    });
    setNewTag("");
    setErrors({});
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const selectedAssignee = mockTeamMembers.find(member => member.id === formData.assigneeId);
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setAssigneeId("unassigned");
    setDueDate(undefined);
    
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle("");
    setDescription(messageContent);
    setPriority("medium");
    setStatus("todo");
    setAssigneeId("unassigned");
    setDueDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]" data-testid="create-task-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Create Task from Message
          </DialogTitle>
          <DialogDescription>
            {messageAuthor && (
              <>Convert message from <span className="font-medium">{messageAuthor}</span> into a task.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="task-title-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              data-testid="task-description-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger data-testid="task-priority-select">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger data-testid="task-status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">📋 To Do</SelectItem>
                  <SelectItem value="in-progress">🔄 In Progress</SelectItem>
                  <SelectItem value="review">👀 Review</SelectItem>
                  <SelectItem value="done">✅ Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-assignee">Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger data-testid="task-assignee-select">
                <SelectValue placeholder="Select assignee (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {mockAssignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                  data-testid="task-due-date-button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()} data-testid="create-task-button">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function setDescription(arg0: string) {
  throw new Error("Function not implemented.");
}

function setAssigneeId(arg0: string) {
  throw new Error("Function not implemented.");
}

