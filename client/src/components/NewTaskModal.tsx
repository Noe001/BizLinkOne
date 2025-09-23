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

interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreate: (task: NewTaskData) => void;
  messageContent?: string;
  relatedChatId?: string;
}

export interface NewTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
  tags: string[];
  relatedChatId?: string;
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

export function NewTaskModal({ open, onOpenChange, onTaskCreate, messageContent = "", relatedChatId }: NewTaskModalProps) {
  const [formData, setFormData] = useState<NewTaskData>({
    title: "",
    description: messageContent,
    status: "todo",
    priority: "medium",
    assigneeId: undefined,
    dueDate: undefined,
    tags: [],
    relatedChatId: relatedChatId,
    estimatedHours: undefined,
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof NewTaskData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof NewTaskData, string>> = {};
    
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
      onTaskCreate(formData);
      handleReset();
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-1">
              Task Title *
              {errors.title && <AlertCircle className="h-4 w-4 text-destructive" />}
            </Label>
            <Input
              id="title"
              placeholder="Enter a clear, actionable task title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details, requirements, or context..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Priority and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: TaskPriority) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Initial Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: TaskStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee and Due Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select 
                value={formData.assigneeId || ""} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeId: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member">
                    {selectedAssignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedAssignee.avatar} />
                          <AvatarFallback className="text-xs">
                            {selectedAssignee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedAssignee.name}</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Unassigned
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Unassigned
                    </div>
                  </SelectItem>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{member.name}</span>
                          <span className="text-xs text-muted-foreground">{member.role}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Estimated Hours and Related Chat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0.5"
                max="999"
                step="0.5"
                placeholder="e.g., 4.5"
                value={formData.estimatedHours || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className={errors.estimatedHours ? "border-destructive" : ""}
              />
              {errors.estimatedHours && (
                <p className="text-sm text-destructive">{errors.estimatedHours}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Related Chat Channel</Label>
              <Select 
                value={formData.relatedChatId || ""} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, relatedChatId: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No channel</SelectItem>
                  {mockChatChannels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      #{channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={formData.tags.length >= 5}
              />
              <Button 
                variant="outline" 
                onClick={handleAddTag}
                disabled={!newTag.trim() || formData.tags.includes(newTag.trim()) || formData.tags.length >= 5}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.tags.length}/5 tags
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleReset} variant="ghost" disabled={isSubmitting}>
            Reset
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim() || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
