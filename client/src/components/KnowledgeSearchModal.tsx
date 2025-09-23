import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, Share, ExternalLink, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKnowledge: (knowledge: KnowledgeArticle) => void;
}

interface KnowledgeArticle {
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

// Mock knowledge articles
const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: "kb-1",
    title: "Authentication Setup Guide",
    content: "Complete guide on setting up JWT-based authentication...",
    summary: "Step-by-step guide for implementing JWT authentication in our application",
    category: "Development",
    tags: ["authentication", "jwt", "security", "backend"],
    authorId: "john-doe",
    authorName: "John Doe",
    views: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "kb-2",
    title: "API Documentation Standards",
    content: "Our standards for documenting REST APIs...",
    summary: "Guidelines and best practices for API documentation",
    category: "Documentation",
    tags: ["api", "documentation", "standards", "best-practices"],
    authorId: "sarah-wilson",
    authorName: "Sarah Wilson",
    views: 32,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  },
  {
    id: "kb-3",
    title: "Database Optimization Techniques",
    content: "Performance optimization strategies for our database...",
    summary: "Collection of database optimization techniques and query improvements",
    category: "Development",
    tags: ["database", "performance", "optimization", "sql"],
    authorId: "mike-johnson",
    authorName: "Mike Johnson",
    views: 28,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  },
  {
    id: "kb-4",
    title: "Troubleshooting Common Deploy Issues",
    content: "Solutions for common deployment problems...",
    summary: "Quick fixes for the most common deployment issues",
    category: "Troubleshooting",
    tags: ["deployment", "troubleshooting", "devops", "fixes"],
    authorId: "alice-cooper",
    authorName: "Alice Cooper",
    views: 67,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: "kb-5",
    title: "UI Component Library Guidelines",
    content: "Guidelines for using our shared UI components...",
    summary: "Best practices for using and contributing to our UI component library",
    category: "Design",
    tags: ["ui", "components", "design-system", "frontend"],
    authorId: "bob-smith",
    authorName: "Bob Smith",
    views: 41,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

export function KnowledgeSearchModal({ isOpen, onClose, onSelectKnowledge }: KnowledgeSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<KnowledgeArticle[]>(mockKnowledgeArticles);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Filter articles based on search query and category
    let filtered = mockKnowledgeArticles;

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

    // Sort by relevance (views and recency)
    filtered.sort((a, b) => {
      const aScore = a.views + (Date.now() - a.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      const bScore = b.views + (Date.now() - b.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      return bScore - aScore;
    });

    setSearchResults(filtered);
  }, [searchQuery, selectedCategory]);

  const categories = Array.from(new Set(mockKnowledgeArticles.map(article => article.category)));

  const handleSelectArticle = (article: KnowledgeArticle) => {
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
