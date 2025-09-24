import { useMemo, useState } from "react";
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
import { ja as jaLocale } from "date-fns/locale";
import { TaskStatus, TaskPriority } from "./TaskCard";
import { useTranslation } from "@/contexts/LanguageContext";
import { sampleParticipants, sampleChannels } from "@/data/sampleWorkspace";

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

interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreate: (task: NewTaskData) => void;
  messageContent?: string;
  relatedChatId?: string;
}

const statusOptions: TaskStatus[] = ["todo", "in-progress", "review", "done"];
const priorityOptions: TaskPriority[] = ["low", "medium", "high", "urgent"];

export function NewTaskModal({ open, onOpenChange, onTaskCreate, messageContent = "", relatedChatId }: NewTaskModalProps) {
  const { t, language } = useTranslation();
  const locale = language === "ja" ? jaLocale : undefined;

  const [formData, setFormData] = useState<NewTaskData>({
    title: "",
    description: messageContent,
    status: "todo",
    priority: "medium",
    assigneeId: undefined,
    dueDate: undefined,
    tags: [],
    relatedChatId,
    estimatedHours: undefined,
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof NewTaskData | "tags", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableParticipants = useMemo(
    () => sampleParticipants.filter((participant) => participant.id !== formData.assigneeId),
    [formData.assigneeId]
  );

  const validateForm = () => {
    const nextErrors: typeof errors = {};

    if (!formData.title.trim()) {
      nextErrors.title = t("tasks.create.validation.titleRequired");
    } else if (formData.title.trim().length < 3) {
      nextErrors.title = t("tasks.create.validation.titleTooShort");
    }

    if (formData.description.trim().length > 2000) {
      nextErrors.description = t("tasks.create.validation.descriptionTooLong");
    }

    if (formData.estimatedHours !== undefined) {
      if (formData.estimatedHours <= 0 || formData.estimatedHours > 999) {
        nextErrors.estimatedHours = t("tasks.create.validation.estimateRange");
      }
    }

    if (formData.tags.length > 5) {
      nextErrors.tags = t("tasks.create.validation.tagLimit");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: messageContent,
      status: "todo",
      priority: "medium",
      assigneeId: undefined,
      dueDate: undefined,
      tags: [],
      relatedChatId,
      estimatedHours: undefined,
    });
    setNewTag("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      onTaskCreate(formData);
      resetForm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const value = newTag.trim();
    if (!value || formData.tags.includes(value) || formData.tags.length >= 5) {
      return;
    }

    setFormData((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    setNewTag("");
  };

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) {
        resetForm();
      }
      onOpenChange(next);
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("tasks.create.title")}</DialogTitle>
          <DialogDescription>{t("tasks.create.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">{t("tasks.create.fields.title.label")}</Label>
            <Input
              id="task-title"
              placeholder={t("tasks.create.fields.title.placeholder")}
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              maxLength={120}
              className={errors.title ? "border-destructive" : undefined}
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">{t("tasks.create.fields.description.label")}</Label>
            <Textarea
              id="task-description"
              placeholder={t("tasks.create.fields.description.placeholder")}
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className={errors.description ? "border-destructive" : undefined}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>{t("tasks.create.fields.status.label")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as TaskStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`tasks.create.fields.status.options.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>{t("tasks.create.fields.priority.label")}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value as TaskPriority }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`tasks.create.fields.priority.options.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{t("tasks.create.fields.assignee.label")}</Label>
            <Select
              value={formData.assigneeId ?? ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, assigneeId: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("tasks.create.fields.assignee.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("tasks.create.fields.assignee.unassigned")}
                  </div>
                </SelectItem>
                {sampleParticipants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{participant.name}</p>
                        {participant.roleKey && (
                          <p className="text-xs text-muted-foreground">{t(participant.roleKey)}</p>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>{t("tasks.create.fields.dueDate.label")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate
                      ? format(formData.dueDate, language === "ja" ? "yyyy年M月d日" : "PPP", { locale })
                      : t("tasks.create.fields.dueDate.placeholder")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, dueDate: date ?? undefined }))}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-estimate">{t("tasks.create.fields.estimate.label")}</Label>
              <Input
                id="task-estimate"
                type="number"
                min="0"
                max="999"
                step="0.5"
                placeholder={t("tasks.create.fields.estimate.placeholder")}
                value={formData.estimatedHours ?? ""}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedHours: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
                className={errors.estimatedHours ? "border-destructive" : undefined}
              />
              {errors.estimatedHours && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.estimatedHours}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{t("tasks.create.fields.relatedChat.label")}</Label>
            <Select
              value={formData.relatedChatId ?? ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, relatedChatId: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("tasks.create.fields.relatedChat.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("tasks.create.fields.relatedChat.none")}
                </SelectItem>
                {sampleChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    #{channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{t("tasks.create.fields.tags.label")}</Label>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, tags: prev.tags.filter((existing) => existing !== tag) }))
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t("tasks.create.fields.tags.placeholder")}
                value={newTag}
                onChange={(event) => setNewTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={formData.tags.length >= 5}
              />
              <Button variant="outline" onClick={handleAddTag} disabled={!newTag.trim() || formData.tags.length >= 5}>
                {t("tasks.create.fields.tags.add")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("tasks.create.fields.tags.help", { count: formData.tags.length, limit: 5 })}
            </p>
            {errors.tags && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.tags}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {t("tasks.create.actions.cancel")}
          </Button>
          <Button variant="ghost" onClick={resetForm} disabled={isSubmitting}>
            {t("tasks.create.actions.reset")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !formData.title.trim()}>
            {isSubmitting ? t("tasks.create.actions.submitting") : t("tasks.create.actions.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
