import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Tag color mapping for visual distinction
const tagColors: Record<string, string> = {
  "authentication": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  "security": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  "api": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  "deployment": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  "frontend": "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800",
  "backend": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  "database": "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
  "devops": "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800",
  "testing": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
  "documentation": "bg-card text-card-foreground border-card-border dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
  "design-system": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
  "performance": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  "best-practices": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
  "compliance": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
  "vulnerabilities": "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
};

interface KnowledgeCardProps {
  id: string;
  title: string;
  excerpt?: string | null;
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
              <Badge 
                key={tag} 
                variant="outline" 
                className={`h-5 text-xs ${tagColors[tag] || "bg-card text-card-foreground border-card-border dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"}`}
              >
                {tag}
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
