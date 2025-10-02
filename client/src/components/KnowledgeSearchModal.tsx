import { useState, useRef, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, Share, ExternalLink, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useWorkspaceData } from "@/contexts/WorkspaceDataContext";

interface KnowledgeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKnowledge: (knowledge: KnowledgeSearchArticle) => void;
}

export interface KnowledgeSearchArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  relatedChatId?: string;
  relatedMeetingId?: string;
}

export function KnowledgeSearchModal({ isOpen, onClose, onSelectKnowledge }: KnowledgeSearchModalProps) {
  const { knowledgeArticles, getParticipantById } = useWorkspaceData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<KnowledgeSearchArticle[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const articles = useMemo<KnowledgeSearchArticle[]>(() => knowledgeArticles.map((article) => {
    const participant = article.authorId ? getParticipantById(article.authorId) : undefined;
    const authorName = article.authorName ?? participant?.name ?? 'Unknown author';
    const authorId = article.authorId ?? participant?.id ?? 'unknown-author';

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      summary: article.summary,
      category: article.category ?? 'General',
      tags: article.tags,
      authorId,
      authorName,
      views: article.views,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt ?? article.createdAt,
      relatedChatId: article.relatedChatId,
      relatedMeetingId: article.relatedMeetingId,
    } satisfies KnowledgeSearchArticle;
  }), [knowledgeArticles, getParticipantById]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    articles.forEach((article) => {
      if (article.category) {
        unique.add(article.category);
      }
    });
    return Array.from(unique).sort();
  }, [articles]);
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let filtered = articles;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      const aScore = a.views + (Date.now() - a.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      const bScore = b.views + (Date.now() - b.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      return bScore - aScore;
    });

    setSearchResults(sorted);
  }, [articles, searchQuery, selectedCategory]);


  const handleSelectArticle = (article: KnowledgeSearchArticle) => {
    onSelectKnowledge(article);
    onClose();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Development": "bg-blue-100 text-blue-800",
      "Documentation": "bg-green-100 text-green-800", 
      "Design": "bg-purple-100 text-purple-800",
      "Troubleshooting": "bg-orange-100 text-orange-800",
      "Process": "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]" data-testid="knowledge-search-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Knowledge Base
          </DialogTitle>
          <DialogDescription>
            Find and share knowledge articles in your chat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search articles, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="knowledge-search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              data-testid="category-all"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Search Results */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery.trim() 
                    ? "No articles found matching your search."
                    : "No articles in this category."}
                </p>
              </div>
            ) : (
              searchResults.map((article) => (
                <Card 
                  key={article.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleSelectArticle(article)}
                  data-testid={`knowledge-article-${article.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-1">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {article.summary}
                        </CardDescription>
                      </div>
                      <Badge className={`ml-2 ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{article.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(article.updatedAt, { addSuffix: true })}</span>
                        </div>
                        <div>
                          {article.views} views
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs">+{article.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{searchResults.length} articles found</span>
            <Button variant="ghost" size="sm" asChild>
              <a href="/knowledge" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Knowledge Base
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
