import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Target, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";
import { sampleParticipants } from "@/data/sampleWorkspace";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreate?: (projectData: ProjectFormData) => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  managerId: string;
  teamMembers: string[];
  priority: "low" | "medium" | "high" | "urgent";
  template?: string;
  milestones: {
    title: string;
    dueDate: Date;
  }[];
}

const projectTemplates = [
  { id: "software", nameKey: "projects.create.templates.software.name", descriptionKey: "projects.create.templates.software.description" },
  { id: "marketing", nameKey: "projects.create.templates.marketing.name", descriptionKey: "projects.create.templates.marketing.description" },
  { id: "research", nameKey: "projects.create.templates.research.name", descriptionKey: "projects.create.templates.research.description" },
  { id: "custom", nameKey: "projects.create.templates.custom.name", descriptionKey: "projects.create.templates.custom.description" },
] as const;

export function CreateProjectModal({ isOpen, onClose, onProjectCreate }: CreateProjectModalProps) {
  const { t, language } = useTranslation();
  const locale = language === "ja" ? jaLocale : undefined;

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    managerId: "",
    teamMembers: [],
    priority: "medium",
    template: "",
    milestones: [],
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: new Date() });
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);

  const formatDate = (date: Date) => format(date, language === "ja" ? "yyyy年M月d日" : "PPP", { locale });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.managerId) {
      return;
    }

    onProjectCreate?.(formData);
    onClose();

    setFormData({
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      managerId: "",
      teamMembers: [],
      priority: "medium",
      template: "",
      milestones: [],
    });
  };

  const addMilestone = () => {
    if (newMilestone.title.trim()) {
      setFormData((prev) => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone],
      }));
      setNewMilestone({ title: "", dueDate: new Date() });
      setMilestoneDialogOpen(false);
    }
  };

  const removeMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const toggleTeamMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter((id) => id !== memberId)
        : [...prev.teamMembers, memberId],
    }));
  };

  const applyTemplate = (templateId: string) => {
    const template = projectTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }

    let templateMilestones: { title: string; dueDate: Date }[] = [];

    if (templateId === "software") {
      templateMilestones = [
        { title: t("projects.create.templates.software.milestones.requirements"), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { title: t("projects.create.templates.software.milestones.alpha"), dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) },
        { title: t("projects.create.templates.software.milestones.release"), dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000) },
      ];
    } else if (templateId === "marketing") {
      templateMilestones = [
        { title: t("projects.create.templates.marketing.milestones.brief"), dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
        { title: t("projects.create.templates.marketing.milestones.assets"), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
        { title: t("projects.create.templates.marketing.milestones.launch"), dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      ];
    } else if (templateId === "research") {
      templateMilestones = [
        { title: t("projects.create.templates.research.milestones.plan"), dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) },
        { title: t("projects.create.templates.research.milestones.study"), dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000) },
        { title: t("projects.create.templates.research.milestones.report"), dueDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000) },
      ];
    }

    setFormData((prev) => ({
      ...prev,
      template: templateId,
      milestones: templateMilestones,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("projects.create.title")}</DialogTitle>
          <DialogDescription>{t("projects.create.description")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-name">{t("projects.create.fields.name.label")}</Label>
              <Input
                id="project-name"
                placeholder={t("projects.create.fields.name.placeholder")}
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("projects.create.fields.manager.label")}</Label>
              <Select
                value={formData.managerId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, managerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("projects.create.fields.manager.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {sampleParticipants.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{member.name}</span>
                        {member.roleKey && (
                          <span className="text-xs text-muted-foreground">{t(member.roleKey)}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project-description">{t("projects.create.fields.description.label")}</Label>
              <Textarea
                id="project-description"
                placeholder={t("projects.create.fields.description.placeholder")}
                rows={4}
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("projects.create.fields.startDate.label")}</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(formData.startDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData((prev) => ({ ...prev, startDate: date }));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t("projects.create.fields.endDate.label")}</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(formData.endDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData((prev) => ({ ...prev, endDate: date }));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("projects.create.fields.priority.label")}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value as ProjectFormData["priority"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("projects.create.fields.priority.options.low")}</SelectItem>
                  <SelectItem value="medium">{t("projects.create.fields.priority.options.medium")}</SelectItem>
                  <SelectItem value="high">{t("projects.create.fields.priority.options.high")}</SelectItem>
                  <SelectItem value="urgent">{t("projects.create.fields.priority.options.urgent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("projects.create.fields.template.label")}</Label>
              <Select
                value={formData.template ?? ""}
                onValueChange={(value) => applyTemplate(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("projects.create.fields.template.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {projectTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium text-sm">{t(template.nameKey)}</div>
                        <div className="text-xs text-muted-foreground">{t(template.descriptionKey)}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("projects.create.fields.team.label")}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sampleParticipants.map((member) => (
                <div
                  key={member.id}
                  className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                    formData.teamMembers.includes(member.id)
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => toggleTeamMember(member.id)}
                >
                  <div className="font-medium text-sm">{member.name}</div>
                  {member.roleKey && (
                    <div className="text-xs text-muted-foreground">{t(member.roleKey)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t("projects.create.fields.milestones.label")}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMilestoneDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("projects.create.fields.milestones.add")}
              </Button>
            </div>

            <div className="space-y-2">
              {formData.milestones.map((milestone, index) => (
                <div key={`milestone-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{milestone.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("projects.create.fields.milestones.due", { date: formatDate(milestone.dueDate) })}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                    aria-label={t("projects.create.fields.milestones.remove")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.milestones.length === 0 && (
                <div className="flex items-center justify-center rounded-lg border border-dashed py-6 text-sm text-muted-foreground">
                  {t("projects.create.fields.milestones.empty")}
                </div>
              )}
            </div>

            <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("projects.create.milestoneDialog.title")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="milestone-title">{t("projects.create.milestoneDialog.fields.title.label")}</Label>
                    <Input
                      id="milestone-title"
                      value={newMilestone.title}
                      onChange={(event) => setNewMilestone((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder={t("projects.create.milestoneDialog.fields.title.placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("projects.create.milestoneDialog.fields.dueDate.label")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(newMilestone.dueDate)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newMilestone.dueDate}
                          onSelect={(date) => {
                            if (date) {
                              setNewMilestone((prev) => ({ ...prev, dueDate: date }));
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setMilestoneDialogOpen(false)}>
                    {t("projects.create.milestoneDialog.actions.cancel")}
                  </Button>
                  <Button type="button" onClick={addMilestone}>
                    {t("projects.create.milestoneDialog.actions.add")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={!formData.name.trim() || !formData.managerId}>
              {t("projects.create.actions.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
