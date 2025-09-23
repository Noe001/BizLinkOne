import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Plus, BookOpen, TrendingUp, Eye, Clock, Star, Filter, FileText, Users, Calendar } from "lucide-react";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { StatCardSkeleton, KnowledgeSkeleton, EmptyState } from "@/components/ui/skeleton-components";

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

// Tag color mapping for visual distinction (keep consistent with KnowledgeCard)
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

export default function Knowledge() {
  const [articles, setArticles] = useState(mockKnowledgeArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");

  // Generate search suggestions based on articles and tags
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    
    // Add article titles
    articles.forEach(article => {
      suggestions.add(article.title);
      // Add tags
      article.tags.forEach(tag => suggestions.add(tag));
    });
    
    // Filter suggestions based on current search query
    if (searchQuery) {
      return Array.from(suggestions).filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
    }
    
    return [];
  }, [articles, searchQuery]);

  // Get popular articles (most viewed)
  const popularArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  }, [articles]);

  // Get recently added articles
  const recentArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => (b.createdAt || new Date()).getTime() - (a.createdAt || new Date()).getTime())
      .slice(0, 3);
  }, [articles]);

  const handleArticleClick = (knowledgeId: string) => {
    console.log(`Viewing knowledge article ${knowledgeId}`);
  };

  const handleShare = (knowledgeId: string) => {
    console.log(`Sharing knowledge article ${knowledgeId}`);
  };

  // Filter articles based on search, tag, date, and author
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          article.author.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Tag filter
      if (selectedTag !== "all" && !article.tags.includes(selectedTag)) {
        return false;
      }

      // Author filter
      if (authorFilter !== "all" && article.author.id !== authorFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const now = new Date();
        const articleDate = article.createdAt || new Date();
        
        switch (dateFilter) {
          case "week":
            if (now.getTime() - articleDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
            break;
          case "month":
            if (now.getTime() - articleDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
            break;
          case "quarter":
            if (now.getTime() - articleDate.getTime() > 90 * 24 * 60 * 60 * 1000) return false;
            break;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "oldest":
          return (a.createdAt || new Date()).getTime() - (b.createdAt || new Date()).getTime();
        case "recent":
        default:
          return (b.createdAt || new Date()).getTime() - (a.createdAt || new Date()).getTime();
      }
    });
  }, [articles, searchQuery, selectedTag, sortBy, dateFilter, authorFilter]);

  return (
    <div className="flex h-full bg-background">
      {/* Main Content */}
      <div className="flex-1 p-6 pr-4" data-testid="page-knowledge">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

            <Card data-testid="stat-authors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Authors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Array.from(new Set(articles.map(a => a.author.id))).length}</div>
                <p className="text-xs text-muted-foreground">
                  Contributing to knowledge base
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-popular-tags">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {mockStats.popularTags.slice(0, 3).map((tag) => {
                    const base = tagColors[tag] || "bg-gray-100 text-gray-800 border-gray-200";
                    const safe = base.includes('dark:') ? base : `${base} dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700`;
                    return (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`text-xs ${safe}`}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search with Suggestions and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles, tags, or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                      className="pl-9"
                      data-testid="input-search-knowledge"
                    />
                  </div>
                </PopoverTrigger>
                {searchSuggestions.length > 0 && (
                  <PopoverContent className="p-0 w-[400px]" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search suggestions..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandEmpty>No suggestions found.</CommandEmpty>
                      <CommandGroup>
                        {searchSuggestions.map((suggestion, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => {
                              setSearchQuery(suggestion);
                              setSearchOpen(false);
                            }}
                          >
                            {suggestion}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showAdvancedFilters ? "default" : "outline"}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32" data-testid="filter-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">📅 Recent</SelectItem>
                  <SelectItem value="popular">👑 Popular</SelectItem>
                  <SelectItem value="alphabetical">🔤 A-Z</SelectItem>
                  <SelectItem value="oldest">📜 Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tag</label>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger data-testid="filter-tag">
                      <SelectValue placeholder="All tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🏷️ All tags</SelectItem>
                      {Array.from(new Set(articles.flatMap(article => article.tags))).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger data-testid="filter-date">
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🕐 All time</SelectItem>
                      <SelectItem value="week">📅 This week</SelectItem>
                      <SelectItem value="month">📅 This month</SelectItem>
                      <SelectItem value="quarter">📅 This quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Select value={authorFilter} onValueChange={setAuthorFilter}>
                    <SelectTrigger data-testid="filter-author">
                      <SelectValue placeholder="All authors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">👥 All authors</SelectItem>
                      {Array.from(new Set(articles.map(a => a.author.id))).map((authorId) => {
                        const author = articles.find(a => a.author.id === authorId)?.author;
                        return (
                          <SelectItem key={authorId} value={authorId}>
                            {author?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {selectedTag !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Tag: {selectedTag}
                    </Badge>
                  )}
                  {dateFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Date: {dateFilter}
                    </Badge>
                  )}
                  {authorFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Author: {articles.find(a => a.author.id === authorFilter)?.author.name}
                    </Badge>
                  )}
                </div>
                
                {(selectedTag !== "all" || dateFilter !== "all" || authorFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTag("all");
                      setDateFilter("all");
                      setAuthorFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
          {searchQuery && (
            <Badge variant="outline" className="gap-1">
              <Search className="h-3 w-3" />
              "{searchQuery}"
            </Badge>
          )}
        </div>

        {/* Knowledge Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="knowledge-grid">
            {[...Array(6)].map((_, i) => (
              <KnowledgeSkeleton key={i} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={searchQuery ? "No articles found" : "No knowledge articles yet"}
            description={
              searchQuery 
                ? `No articles match "${searchQuery}". Try adjusting your search or filters.`
                : "Start building your knowledge base by creating the first article."
            }
            action={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {searchQuery ? "Clear search" : "Create first article"}
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="knowledge-grid">
            {filteredArticles.map((article) => (
              <KnowledgeCard
                key={article.id}
                {...article}
                onClick={() => handleArticleClick(article.id)}
                onShare={() => handleShare(article.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-border p-6 bg-muted/20">
        {/* Popular Articles */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div 
                key={article.id}
                className="p-3 bg-card rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="text-xs font-medium">#{index + 1}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.views}
                  </span>
                </div>
                <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{article.author.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Recently Added</h3>
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div 
                key={article.id}
                className="p-3 bg-card rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {article.createdAt?.toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{article.author.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
