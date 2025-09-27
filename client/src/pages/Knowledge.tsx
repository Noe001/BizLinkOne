import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Plus, BookOpen, TrendingUp, Eye, Clock, Filter, FileText, Users, Calendar } from "lucide-react";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { KnowledgeSkeleton, EmptyState } from "@/components/ui/skeleton-components";
import { knowledgeArticleSeeds, knowledgePopularTagKeys, type KnowledgeArticleSeed } from "@/data/knowledge/seeds";
import { sampleParticipants } from "@/data/sampleWorkspace";
import { useTranslation } from "@/contexts/LanguageContext";
import { subDays } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";

const referenceDate = new Date();

const tagColors: Record<string, string> = {
  authentication: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  security: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  jwt: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  backend: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  api: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  documentation: "bg-card text-card-foreground border-card-border dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
  standards: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
  guidelines: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
  deployment: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  devops: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800",
  production: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  ciCd: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  testing: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
  database: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
  schema: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
  design: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800",
  performance: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  sql: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
  frontend: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800",
  components: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
  ui: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
  react: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  designSystem: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
  bestPractices: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
  compliance: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
  vulnerabilities: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
};

type KnowledgeTagSlug = keyof typeof tagColors;

interface LocalisedArticle {
  id: string;
  title: string;
  excerpt: string;
  tags: { id: KnowledgeTagSlug; label: string }[];
  author: { id: string; name: string; avatar?: string } | null;
  createdAt: Date;
  updatedAt?: Date;
  views?: number;
  relatedChatId?: string;
}

export default function Knowledge() {
  const { t, language } = useTranslation();
  const locale = language === "ja" ? jaLocale : undefined;

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [dateFilter, setDateFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [isLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const participantMap = useMemo(() => new Map(sampleParticipants.map((member) => [member.id, member])), []);

  const articles = useMemo<LocalisedArticle[]>(() => {
    return knowledgeArticleSeeds.map((seed: KnowledgeArticleSeed) => {
      const author = seed.authorId ? participantMap.get(seed.authorId) ?? null : null;
      return {
        id: seed.id,
        title: seed.title,
        excerpt: seed.excerpt,
        tags: seed.tags.map((tag) => ({
          id: tag as KnowledgeTagSlug,
          label: t(`knowledge.tags.${tag}`),
        })),
        author,
        createdAt: subDays(referenceDate, seed.createdDaysAgo),
        updatedAt: seed.updatedDaysAgo !== undefined ? subDays(referenceDate, seed.updatedDaysAgo) : undefined,
        views: seed.views,
        relatedChatId: seed.relatedChatId,
      };
    });
  }, [t, participantMap]);

  const tagOptions = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => {
        if (!map.has(tag.id)) {
          map.set(tag.id, { id: tag.id, label: tag.label });
        }
      });
    });
    return Array.from(map.values());
  }, [articles]);

  const authorOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    articles.forEach((article) => {
      if (article.author) {
        map.set(article.author.id, { id: article.author.id, name: article.author.name });
      }
    });
    return Array.from(map.values());
  }, [articles]);

  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, article) => sum + (article.views ?? 0), 0);
  const articlesThisWeek = articles.filter((article) => article.createdAt >= subDays(referenceDate, 7)).length;

  const popularTags = knowledgePopularTagKeys.map((key: string) => ({
    id: key,
    label: t(`knowledge.tags.${key}`),
  }));

  const filteredArticles = useMemo(() => {
    const normalisedQuery = searchQuery.trim().toLowerCase();

    return articles
      .filter((article) => {
        const matchesSearch =
          normalisedQuery.length === 0 ||
          article.title.toLowerCase().includes(normalisedQuery) ||
          article.excerpt.toLowerCase().includes(normalisedQuery) ||
          article.tags.some((tag) => tag.label.toLowerCase().includes(normalisedQuery));

        const matchesTag = selectedTag === "all" || article.tags.some((tag) => tag.id === selectedTag);

        const matchesAuthor =
          authorFilter === "all" || (article.author && article.author.id === authorFilter);

        const matchesDate = (() => {
          if (dateFilter === "all") {
            return true;
          }
          const createdAt = article.createdAt;
          if (dateFilter === "week") {
            return createdAt >= subDays(referenceDate, 7);
          }
          if (dateFilter === "month") {
            return createdAt >= subDays(referenceDate, 30);
          }
          if (dateFilter === "quarter") {
            return createdAt >= subDays(referenceDate, 90);
          }
          return true;
        })();

        return matchesSearch && matchesTag && matchesAuthor && matchesDate;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return (b.views ?? 0) - (a.views ?? 0);
          case "alphabetical":
            return a.title.localeCompare(b.title, language === "ja" ? "ja" : "en");
          case "oldest":
            return a.createdAt.getTime() - b.createdAt.getTime();
          default:
            return b.createdAt.getTime() - a.createdAt.getTime();
        }
      });
  }, [articles, searchQuery, selectedTag, sortBy, dateFilter, authorFilter, language]);

  const popularArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 3);
  }, [articles]);

  const recentArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);
  }, [articles]);

  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();

    articles.forEach((article) => {
      suggestions.add(article.title);
      article.tags.forEach((tag) => suggestions.add(tag.label));
      if (article.author) {
        suggestions.add(article.author.name);
      }
    });

    return Array.from(suggestions);
  }, [articles]);

  const handleArticleClick = (articleId: string) => {
    console.log(t("knowledge.log.open"), articleId);
  };

  const handleShare = (articleId: string) => {
    console.log(t("knowledge.log.share"), articleId);
  };

  const clearFilters = () => {
    setSelectedTag("all");
    setDateFilter("all");
    setAuthorFilter("all");
  };

  const selectedTagLabel = selectedTag === "all" ? undefined : tagOptions.find((tag) => tag.id === selectedTag)?.label;
  const selectedAuthorLabel = authorFilter === "all" ? undefined : authorOptions.find((author) => author.id === authorFilter)?.name;

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{t("knowledge.header.description")}</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("knowledge.actions.new")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("knowledge.stats.totalArticles.title")}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticles}</div>
              <p className="text-xs text-muted-foreground">{t("knowledge.stats.totalArticles.hint")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("knowledge.stats.views.title")}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">{t("knowledge.stats.views.hint")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("knowledge.stats.thisWeek.title")}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articlesThisWeek}</div>
              <p className="text-xs text-muted-foreground">{t("knowledge.stats.thisWeek.hint")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("knowledge.stats.popularTags.title")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              {popularTags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.label}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("knowledge.filters.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-10 w-72"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40" data-testid="filter-sort">
                  <SelectValue placeholder={t("knowledge.filters.sort.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">📅 {t("knowledge.filters.sort.options.recent")}</SelectItem>
                  <SelectItem value="popular">👑 {t("knowledge.filters.sort.options.popular")}</SelectItem>
                  <SelectItem value="alphabetical">🔤 {t("knowledge.filters.sort.options.alphabetical")}</SelectItem>
                  <SelectItem value="oldest">📜 {t("knowledge.filters.sort.options.oldest")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? t("knowledge.filters.hideAdvanced") : t("knowledge.filters.showAdvanced")}
            </Button>
          </div>

          {showAdvancedFilters && (
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("knowledge.filters.tag.label")}</label>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger data-testid="filter-tag">
                      <SelectValue placeholder={t("knowledge.filters.tag.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🏷️ {t("knowledge.filters.tag.options.all")}</SelectItem>
                      {tagOptions.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t("knowledge.filters.date.label")}</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger data-testid="filter-date">
                      <SelectValue placeholder={t("knowledge.filters.date.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🕐 {t("knowledge.filters.date.options.all")}</SelectItem>
                      <SelectItem value="week">📅 {t("knowledge.filters.date.options.week")}</SelectItem>
                      <SelectItem value="month">📅 {t("knowledge.filters.date.options.month")}</SelectItem>
                      <SelectItem value="quarter">📅 {t("knowledge.filters.date.options.quarter")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t("knowledge.filters.author.label")}</label>
                  <Select value={authorFilter} onValueChange={setAuthorFilter}>
                    <SelectTrigger data-testid="filter-author">
                      <SelectValue placeholder={t("knowledge.filters.author.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">👥 {t("knowledge.filters.author.options.all")}</SelectItem>
                      {authorOptions.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {selectedTagLabel && (
                    <Badge variant="secondary" className="gap-1">
                      {t("knowledge.filters.summary.tag", { value: selectedTagLabel })}
                    </Badge>
                  )}
                  {dateFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      {t("knowledge.filters.summary.date", { value: t(`knowledge.filters.date.options.${dateFilter}`) })}
                    </Badge>
                  )}
                  {selectedAuthorLabel && (
                    <Badge variant="secondary" className="gap-1">
                      {t("knowledge.filters.summary.author", { value: selectedAuthorLabel })}
                    </Badge>
                  )}
                </div>

                {(selectedTag !== "all" || dateFilter !== "all" || authorFilter !== "all") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    {t("knowledge.filters.clear")}
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {t("knowledge.results.summary", { count: filteredArticles.length, total: articles.length })}
          </p>
          {searchQuery && (
            <Badge variant="outline" className="gap-1">
              <Search className="h-3 w-3" />
              {t("knowledge.results.searchTag", { query: searchQuery })}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="knowledge-grid">
            {[...Array(6)].map((_, index) => (
              <KnowledgeSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={searchQuery ? t("knowledge.empty.searchTitle") : t("knowledge.empty.defaultTitle")}
            description={
              searchQuery
                ? t("knowledge.empty.searchDescription", { query: searchQuery })
                : t("knowledge.empty.defaultDescription")
            }
            action={
              <Button onClick={() => (searchQuery ? setSearchQuery("") : undefined)}>
                <Plus className="h-4 w-4 mr-2" />
                {searchQuery ? t("knowledge.empty.clearSearch") : t("knowledge.empty.createFirst")}
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="knowledge-grid">
            {filteredArticles.map((article) => (
              <KnowledgeCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                tags={article.tags}
                author={article.author}
                createdAt={article.createdAt}
                updatedAt={article.updatedAt}
                views={article.views}
                relatedChatId={article.relatedChatId}
                onClick={() => handleArticleClick(article.id)}
                onShare={() => handleShare(article.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-80 border-l border-border p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("knowledge.sidebar.popular.title")}</h3>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div
                key={`popular-${article.id}`}
                className="p-3 bg-card rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center min-h-[1.4rem] min-w-[1.5rem] rounded-md bg-green-800 text-white text-sm font-semibold">#{index + 1}</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.views ?? 0}
                  </span>
                </div>
                <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                {article.author && <p className="text-xs text-muted-foreground mt-1">{article.author.name}</p>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t("knowledge.sidebar.recent.title")}</h3>
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div
                key={`recent-${article.id}`}
                className="p-3 bg-card rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {article.createdAt.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US")}
                  </span>
                </div>
                <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                {article.author && <p className="text-xs text-muted-foreground mt-1">{article.author.name}</p>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t("knowledge.sidebar.authors.title")}</h3>
          <div className="space-y-3">
            {authorOptions.map((author) => (
              <div key={`author-${author.id}`} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{author.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("knowledge.sidebar.authors.count", {
                    count: articles.filter((article) => article.author?.id === author.id).length,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t("knowledge.sidebar.suggestions.title")}</h3>
          <div className="space-y-2">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {t("knowledge.sidebar.suggestions.command")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("knowledge.sidebar.suggestions.placeholder") ?? ""} />
                  <CommandList>
                    <CommandEmpty>{t("knowledge.sidebar.suggestions.empty")}</CommandEmpty>
                    <CommandGroup>
                      {searchSuggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion}
                          onSelect={(value) => {
                            setSearchQuery(value);
                            setSearchOpen(false);
                          }}
                        >
                          {suggestion}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
