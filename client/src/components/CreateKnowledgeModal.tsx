import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, X, Plus } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

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
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(messageContent);
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Development");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isOpen) {
      setContent(messageContent);
    }
  }, [isOpen, messageContent]);

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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="create-knowledge-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t("knowledge.create.title")}
          </DialogTitle>
          <DialogDescription>
            {messageAuthor ? (
              t("knowledge.create.descriptionWithAuthor", { author: messageAuthor })
            ) : (
              t("knowledge.create.description")
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="knowledge-title">{t("knowledge.create.fields.title")} *</Label>
            <Input
              id="knowledge-title"
              placeholder={t("knowledge.create.fields.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="knowledge-title-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="knowledge-summary">{t("knowledge.create.fields.summary")}</Label>
            <Input
              id="knowledge-summary"
              placeholder={t("knowledge.create.fields.summaryPlaceholder")}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              data-testid="knowledge-summary-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="knowledge-content">{t("knowledge.create.fields.content")} *</Label>
            <Textarea
              id="knowledge-content"
              placeholder={t("knowledge.create.fields.contentPlaceholder")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
              data-testid="knowledge-content-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="knowledge-category">{t("knowledge.create.fields.category")}</Label>
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
            <Label>{t("knowledge.create.fields.tags")}</Label>
            
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
                placeholder={t("knowledge.create.fields.tagPlaceholder")}
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
              <span className="text-sm text-muted-foreground mr-2">{t("knowledge.create.fields.quickAdd")}:</span>
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
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()} data-testid="create-knowledge-button">
              {t("knowledge.create.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
