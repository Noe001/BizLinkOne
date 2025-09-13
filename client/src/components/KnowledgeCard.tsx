import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeCardProps {
  id: string;
  title: string;
  excerpt?: string;
  tags: string[] | null;
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
}: KnowledgeCardProps) {
  const handleCardClick = () => {
    console.log(`Knowledge article ${id} clicked`);
    onClick?.(id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Sharing knowledge article ${id}`);
    onShare?.(id);
  };

  return (
    <Card 
      className="hover-elevate cursor-pointer group h-full" 
      onClick={handleCardClick}
      data-testid={`knowledge-card-${id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-medium text-sm leading-tight truncate" data-testid={`knowledge-title-${id}`}>
              {title}
            </h3>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            data-testid={`knowledge-more-${id}`}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {excerpt && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-3" data-testid={`knowledge-excerpt-${id}`}>
            {excerpt}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3" data-testid={`knowledge-tags-${id}`}>
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="h-5 text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="h-5 text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5" data-testid={`knowledge-author-${id}`}>
              <AvatarImage src={author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.name || 'Anonymous'}`} />
              <AvatarFallback className="text-xs">
                {author?.name ? author.name.split(' ').map(n => n[0]).join('') : 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{author?.name || 'Anonymous'}</span>
              <span className="ml-1">
                {formatDistanceToNow(updatedAt || createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {views > 0 && (
              <span className="text-xs text-muted-foreground" data-testid={`knowledge-views-${id}`}>
                {views} views
              </span>
            )}
            
            {relatedChatId && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
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