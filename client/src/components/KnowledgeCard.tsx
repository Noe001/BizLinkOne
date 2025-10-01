import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BookOpen, MessageSquare, Share2, MoreHorizontal, Edit, Trash2, Copy, Archive, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";
import { getTagColor } from "@/utils/tagColors";

interface KnowledgeTagDisplay {
  id: string;
  label: string;
}

interface KnowledgeCardProps {
  id: string;
  title: string;
  excerpt?: string | null;
  tags: KnowledgeTagDisplay[];
  author?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  createdAt: Date;
  updatedAt?: Date;
  views?: number;
  relatedChatId?: string;
  onClick?: (knowledgeId: string) => void;
  onShare?: (knowledgeId: string) => void;
  onEdit?: (knowledgeId: string) => void;
  onDelete?: (knowledgeId: string) => void;
  onDuplicate?: (knowledgeId: string) => void;
  onArchive?: (knowledgeId: string) => void;
  onToggleFavorite?: (knowledgeId: string) => void;
  isFavorite?: boolean;
}

export function KnowledgeCard({
  id,
  title,
  excerpt,
  tags,
  author,
  createdAt,
  updatedAt,
  views = 0,
  relatedChatId,
  onClick,
  onShare,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onToggleFavorite,
  isFavorite = false,
}: KnowledgeCardProps) {
  const { t, language } = useTranslation();
  const locale = language === "ja" ? jaLocale : undefined;

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    onShare?.(id);
  };

  const authorName = author?.name ?? t("knowledge.card.anonymous");
  const relativeTime = formatDistanceToNow(updatedAt || createdAt, { addSuffix: true, locale });

  return (
    <Card
      className="hover-elevate cursor-pointer group h-full transition-all duration-200 hover:shadow-lg"
      onClick={handleCardClick}
      data-testid={`knowledge-card-${id}`}
      aria-label={`${title} - ${authorName}`}
    >
      <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <h3 className="font-semibold text-sm sm:text-base leading-tight truncate" data-testid={`knowledge-title-${id}`}>
                {title}
              </h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-50 group-hover:opacity-100 hover:bg-accent transition-all duration-150 sm:opacity-40"
                  data-testid={`knowledge-more-${id}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={t("knowledge.card.actions.menu")}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(id); }}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>{t("knowledge.card.actions.edit")}</span>
                  </DropdownMenuItem>
                )}
                {onToggleFavorite && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}>
                    <Star className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? t("knowledge.card.actions.unfavorite") : t("knowledge.card.actions.favorite")}</span>
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(id); }}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>{t("knowledge.card.actions.duplicate")}</span>
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(id); }}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>{t("knowledge.card.actions.share")}</span>
                  </DropdownMenuItem>
                )}
                {onArchive && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(id); }}>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>{t("knowledge.card.actions.archive")}</span>
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("knowledge.card.actions.delete")}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>      <CardContent className="pt-0">
        {excerpt && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-3" data-testid={`knowledge-excerpt-${id}`}>
            {excerpt}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3" data-testid={`knowledge-tags-${id}`}>
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className={`h-5 text-xs ${getTagColor(tag.id)}`}
              >
                {tag.label}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="h-5 text-xs bg-card text-card-foreground border-card-border dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5" data-testid={`knowledge-author-${id}`}>
              <AvatarImage src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`} />
              <AvatarFallback className="text-xs">
                {authorName.split(" ").map((segment) => segment[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{authorName}</span>
              <span className="ml-1">{relativeTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {views > 0 && (
              <span className="text-xs text-muted-foreground" data-testid={`knowledge-views-${id}`}>
                {t("knowledge.card.views", { count: views })}
              </span>
            )}

            {relatedChatId && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                title={t("knowledge.card.openChat")}
                data-testid={`knowledge-chat-${id}`}
              >
                <MessageSquare className="h-3 w-3" />
              </Button>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={handleShare}
              aria-label={t("knowledge.card.share")}
              title={t("knowledge.card.share")}
              data-testid={`knowledge-share-${id}`}
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
