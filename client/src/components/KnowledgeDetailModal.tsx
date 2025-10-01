import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Share2,
  Clock,
  User,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";

interface KnowledgeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: KnowledgeArticleDetail | null;
  onUpdate?: (id: string, updates: Partial<KnowledgeArticleDetail>) => void;
  onDelete?: (id: string) => void;
  onShareToChat?: (articleId: string) => void;
}

export interface KnowledgeArticleDetail {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: Array<{ id: string; label: string }>;
  category: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  views: number;
  relatedChatId?: string;
  relatedMeetingId?: string;
}

const tagColors: Record<string, string> = {
  authentication: "bg-blue-100 text-blue-800",
  security: "bg-red-100 text-red-800",
  backend: "bg-orange-100 text-orange-800",
  api: "bg-green-100 text-green-800",
  documentation: "bg-gray-100 text-gray-800",
  deployment: "bg-purple-100 text-purple-800",
  testing: "bg-yellow-100 text-yellow-800",
  database: "bg-cyan-100 text-cyan-800",
  design: "bg-pink-100 text-pink-800",
  frontend: "bg-pink-100 text-pink-800",
};

export function KnowledgeDetailModal({
  open,
  onOpenChange,
  article,
  onUpdate,
  onDelete,
  onShareToChat,
}: KnowledgeDetailModalProps) {
  const { t, language } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<KnowledgeArticleDetail>>({});
  const dateLocale = language === "ja" ? jaLocale : undefined;

  useEffect(() => {
    if (!article) {
      setIsEditing(false);
      setEditData({});
    }
  }, [article]);

  if (!article) return null;

  const handleSaveEdit = () => {
    if (!isEditing || !onUpdate) return;
    onUpdate(article.id, editData);
    setIsEditing(false);
    setEditData({});
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (confirm(t("knowledge.detail.deleteConfirm"))) {
      onDelete(article.id);
      onOpenChange(false);
    }
  };

  const handleShare = () => {
    if (!onShareToChat) return;
    onShareToChat(article.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editData.title || article.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold"
              />
            ) : (
              <DialogTitle className="text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {article.title}
              </DialogTitle>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveEdit} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {t("knowledge.detail.save")}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  {t("knowledge.detail.cancel")}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button onClick={handleDelete} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <div>
                <div className="text-xs">{t("knowledge.detail.author")}</div>
                <div className="font-medium text-foreground">
                  {article.author?.name || t("knowledge.card.anonymous")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <div>
                <div className="text-xs">{t("knowledge.detail.created")}</div>
                <div className="font-medium text-foreground">
                  {format(article.createdAt, "yyyy/MM/dd", { locale: dateLocale })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <div>
                <div className="text-xs">{t("knowledge.detail.updated")}</div>
                <div className="font-medium text-foreground">
                  {article.updatedAt 
                    ? format(article.updatedAt, "yyyy/MM/dd", { locale: dateLocale })
                    : "-"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <div>
                <div className="text-xs">{t("knowledge.detail.views")}</div>
                <div className="font-medium text-foreground">{article.views}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("knowledge.detail.tags")}</span>
            </div>
            {isEditing ? (
              <Input
                placeholder={t("knowledge.detail.tagsPlaceholder")}
                value={editData.tags?.map(t => t.label).join(", ") || article.tags.map(t => t.label).join(", ")}
                onChange={(e) => {
                  const tagLabels = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                  setEditData(prev => ({
                    ...prev,
                    tags: tagLabels.map((label, i) => ({
                      id: label.toLowerCase().replace(/\s+/g, "-"),
                      label
                    }))
                  }));
                }}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="outline" 
                    className={tagColors[tag.id] || "bg-gray-100 text-gray-800"}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Content */}
          <div>
            <div className="text-sm font-medium mb-3">{t("knowledge.detail.content")}</div>
            {isEditing ? (
              <Textarea
                value={editData.content || article.content}
                onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="font-mono text-sm"
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {article.content}
                </div>
              </div>
            )}
          </div>

          {/* Related Context */}
          {(article.relatedChatId || article.relatedMeetingId) && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-3">{t("knowledge.detail.relatedContext")}</div>
                <div className="space-y-2">
                  {article.relatedChatId && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {t("knowledge.detail.fromChat")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          #{article.relatedChatId}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = `/chat/channel/${article.relatedChatId}`}
                      >
                        {t("knowledge.detail.openChat")}
                      </Button>
                    </div>
                  )}
                  {article.relatedMeetingId && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {t("knowledge.detail.fromMeeting")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {article.relatedMeetingId}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = "/meetings"}
                      >
                        {t("knowledge.detail.openMeeting")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("knowledge.detail.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
