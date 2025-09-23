import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, X, Plus } from "lucide-react";

interface CreateKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateKnowledge: (knowledge: CreateKnowledgeData) => void;
  messageContent?: string;
  messageAuthor?: string;
  relatedChatId?: string;
}

export interface CreateKnowledgeData {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  relatedChatId?: string;
  relatedMessageId?: string;
}

// Knowledge categories
const knowledgeCategories = [
  "Development",
  "Process",
  "Documentation",
  "Best Practices",
  "FAQ",
  "Troubleshooting",
  "Tutorial",
  "Guidelines",
  "Other"
];

// Predefined tags
const commonTags = [
  "frontend", "backend", "api", "database", "security", "testing",
  "deployment", "bug-fix", "feature", "improvement", "urgent",
  "authentication", "performance", "ui", "ux", "mobile"
];

export function CreateKnowledgeModal({ 
  isOpen, 
  onClose, 
  onCreateKnowledge, 
  messageContent = "",
  messageAuthor = "",
  relatedChatId
}: CreateKnowledgeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(messageContent);
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Development");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;

    onCreateKnowledge({
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim() || content.trim().substring(0, 150) + "...",
      category,
      tags,
      relatedChatId,
    });

    // Reset form
    setTitle("");
    setContent("");
    setSummary("");
    setCategory("Development");
    setTags([]);
    setNewTag("");
    
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle("");
    setContent(messageContent);
    setSummary("");
    setCategory("Development");
    setTags([]);
    setNewTag("");
    onClose();
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" data-testid="create-knowledge-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create Knowledge Article from Message
          </DialogTitle>
          <DialogDescription>
            {messageAuthor && (
              <>Convert message from <span className="font-medium">{messageAuthor}</span> into a knowledge article.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="knowledge-title">Title *</Label>
            <Input
              id="knowledge-title"
              placeholder="Enter article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="knowledge-title-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="knowledge-summary">Summary</Label>
            <Input
              id="knowledge-summary"
              placeholder="Brief summary (optional - will be auto-generated if empty)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              data-testid="knowledge-summary-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="knowledge-content">Content *</Label>
            <Textarea
              id="knowledge-content"
              placeholder="Article content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
              data-testid="knowledge-content-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="knowledge-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="knowledge-category-select">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {knowledgeCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            
            {/* Selected tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs"
                    data-testid={`tag-${tag}`}
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add new tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                data-testid="new-tag-input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddNewTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Common tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-sm text-muted-foreground mr-2">Quick add:</span>
              {commonTags.filter(tag => !tags.includes(tag)).slice(0, 10).map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => addTag(tag)}
                  data-testid={`quick-tag-${tag}`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()} data-testid="create-knowledge-button">
              Create Article
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
