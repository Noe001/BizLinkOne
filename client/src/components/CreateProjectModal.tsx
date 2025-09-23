import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, Target, X, Plus } from "lucide-react";
import { format } from "date-fns";

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

// Mock team members data
const mockTeamMembers = [
  { id: "1", name: "John Doe", role: "Developer" },
  { id: "2", name: "Sarah Wilson", role: "Designer" },
  { id: "3", name: "Mike Johnson", role: "Manager" },
  { id: "4", name: "Emily Chen", role: "QA Engineer" },
  { id: "5", name: "David Kim", role: "DevOps" },
];

const projectTemplates = [
  { id: "software", name: "Software Development", description: "Standard software development project" },
  { id: "marketing", name: "Marketing Campaign", description: "Marketing and promotional campaign" },
  { id: "research", name: "Research Project", description: "Research and analysis project" },
  { id: "custom", name: "Custom Project", description: "Start from scratch" },
];

export function CreateProjectModal({ isOpen, onClose, onProjectCreate }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.managerId) {
      return;
    }

    onProjectCreate?.(formData);
    onClose();
    
    // Reset form
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
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }));
      setNewMilestone({ title: "", dueDate: new Date() });
      setMilestoneDialogOpen(false);
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const toggleTeamMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter(id => id !== memberId)
        : [...prev.teamMembers, memberId]
    }));
  };

  const applyTemplate = (templateId: string) => {
    const template = projectTemplates.find(t => t.id === templateId);
    if (!template) return;

    let templateMilestones: { title: string; dueDate: Date; }[] = [];
    
    if (templateId === "software") {
      templateMilestones = [
        { title: "Requirements Analysis", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { title: "Design Phase", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
        { title: "Development", dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) },
        { title: "Testing", dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) },
        { title: "Deployment", dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      ];
    } else if (templateId === "marketing") {
      templateMilestones = [
        { title: "Strategy Planning", dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
        { title: "Content Creation", dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
        { title: "Campaign Launch", dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) },
        { title: "Performance Analysis", dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      ];
    }

    setFormData(prev => ({
      ...prev,
      template: templateId,
      milestones: templateMilestones,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Set up a new project with team members, milestones, and timeline
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the project goals and scope"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: "low" | "medium" | "high" | "urgent") => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select 
                  value={formData.template} 
                  onValueChange={applyTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose template" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Timeline
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData(prev => ({ ...prev, startDate: date }));
                          setStartDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData(prev => ({ ...prev, endDate: date }));
                          setEndDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Assignment
            </h4>

            <div className="space-y-2">
              <Label htmlFor="manager">Project Manager *</Label>
              <Select 
                value={formData.managerId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project manager" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="grid grid-cols-2 gap-2">
                {mockTeamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                      formData.teamMembers.includes(member.id)
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleTeamMember(member.id)}
                  >
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Milestones
              </h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setMilestoneDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{milestone.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Due: {format(milestone.dueDate, "PPP")}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Milestone Dialog */}
            <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Milestone</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="milestone-title">Title</Label>
                    <Input
                      id="milestone-title"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Milestone title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(newMilestone.dueDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newMilestone.dueDate}
                          onSelect={(date) => {
                            if (date) {
                              setNewMilestone(prev => ({ ...prev, dueDate: date }));
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
                    Cancel
                  </Button>
                  <Button type="button" onClick={addMilestone}>
                    Add Milestone
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim() || !formData.managerId}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
