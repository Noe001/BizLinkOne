import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, BookOpen, TrendingUp, Eye } from "lucide-react";
import { KnowledgeCard } from "@/components/KnowledgeCard";

// todo: remove mock functionality
const mockKnowledgeArticles = [
  {
    id: "kb-1",
    title: "Authentication Implementation Guide",
    excerpt: "A comprehensive guide to implementing JWT-based authentication in our application, including best practices for security, session management, and user flows.",
    tags: ["authentication", "security", "jwt", "backend", "api"],
    author: { id: "john-doe", name: "John Doe" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    views: 142,
    relatedChatId: "development",
  },
  {
    id: "kb-2",
    title: "API Documentation Standards",
    excerpt: "Guidelines for writing clear and comprehensive API documentation that helps both internal developers and external partners understand our services.",
    tags: ["documentation", "api", "standards", "guidelines"],
    author: { id: "sarah-wilson", name: "Sarah Wilson" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    views: 89,
    relatedChatId: "development",
  },
  {
    id: "kb-3",
    title: "Deployment Process",
    excerpt: "Step-by-step instructions for deploying applications to production, including environment setup, testing procedures, and rollback strategies for safe releases.",
    tags: ["deployment", "devops", "production", "ci/cd", "testing"],
    author: { id: "mike-johnson", name: "Mike Johnson" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    views: 234,
    relatedChatId: "devops",
  },
  {
    id: "kb-4",
    title: "Database Schema Design",
    excerpt: "Best practices for designing scalable database schemas, including normalization principles, indexing strategies, and performance considerations.",
    tags: ["database", "schema", "design", "performance", "sql"],
    author: { id: "alice-cooper", name: "Alice Cooper" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    views: 67,
  },
  {
    id: "kb-5",
    title: "Frontend Component Library",
    excerpt: "Documentation for our shared component library, including usage examples, props API, and styling guidelines for consistent UI development.",
    tags: ["frontend", "components", "ui", "react", "design-system"],
    author: { id: "bob-smith", name: "Bob Smith" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    views: 156,
    relatedChatId: "frontend",
  },
  {
    id: "kb-6",
    title: "Security Best Practices",
    excerpt: "Essential security practices for web applications, covering authentication, data protection, vulnerability prevention, and compliance requirements.",
    tags: ["security", "best-practices", "compliance", "vulnerabilities"],
    author: { id: "john-doe", name: "John Doe" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    views: 203,
  },
];

const mockStats = {
  totalArticles: mockKnowledgeArticles.length,
  totalViews: mockKnowledgeArticles.reduce((sum, article) => sum + (article.views || 0), 0),
  thisWeekArticles: 2,
  popularTags: ["authentication", "api", "security", "deployment", "frontend"],
};

export default function Knowledge() {
  const [articles, setArticles] = useState(mockKnowledgeArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  const handleArticleClick = (knowledgeId: string) => {
    console.log(`Viewing knowledge article ${knowledgeId}`);
  };

  const handleShare = (knowledgeId: string) => {
    console.log(`Sharing knowledge article ${knowledgeId}`);
  };

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag === "all" || article.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return (b.views || 0) - (a.views || 0);
        case "title":
          return a.title.localeCompare(b.title);
        case "recent":
        default:
          return (b.updatedAt || b.createdAt).getTime() - (a.updatedAt || a.createdAt).getTime();
      }
    });

  return (
    <div className="p-6 space-y-6" data-testid="page-knowledge">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Centralized documentation and knowledge sharing for your team.
          </p>
        </div>
        <Button data-testid="button-new-article">
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="stat-total-articles">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +{mockStats.thisWeekArticles} this week
            </p>
          </CardContent>
        </Card>

        <Card data-testid="stat-total-views">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Across all articles
            </p>
          </CardContent>
        </Card>

        <Card data-testid="stat-popular-tags">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {mockStats.popularTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles, tags, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-knowledge"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-40" data-testid="filter-tag">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {mockStats.popularTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32" data-testid="sort-by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Knowledge Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="knowledge-grid">
        {filteredArticles.map((article) => (
          <KnowledgeCard
            key={article.id}
            {...article}
            onClick={handleArticleClick}
            onShare={handleShare}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedTag !== "all" 
                ? "Try adjusting your search or filters." 
                : "Start building your knowledge base by creating your first article."}
            </p>
            <Button data-testid="button-create-first-article">
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}