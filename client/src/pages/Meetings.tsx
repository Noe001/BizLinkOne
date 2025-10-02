import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Plus, Video, Clock, Users, CalendarDays, TrendingUp, Filter } from "lucide-react";
import { MeetingCard, type MeetingStatus } from "@/components/MeetingCard";
import { CreateMeetingModal, type CreateMeetingData } from "@/components/CreateMeetingModal";
import { MeetingDetailsModal, type MeetingDetails, type TaskFromMeeting, type KnowledgeFromMeeting } from "@/components/MeetingDetailsModal";
import { StatCardSkeleton, MeetingSkeleton, EmptyState } from "@/components/ui/skeleton-components";
import { addDays, differenceInMinutes, format, startOfDay } from "date-fns";
import { useTranslation } from "@/contexts/LanguageContext";
import { ja as jaLocale } from "date-fns/locale";
import { createSampleMeetingData, hydrateMeetingDetails, type MeetingSeed } from "@/data/meetings";
import { useWorkspaceData } from "@/contexts/WorkspaceDataContext";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/components/NotificationPanel";
import { apiRequest } from "@/lib/queryClient";

const { meetings: initialMeetingSeeds, extras: sampleMeetingExtras } = createSampleMeetingData();
const statusOrder: MeetingStatus[] = ["scheduled", "ongoing", "completed", "cancelled"];

const DEFAULT_INTEGRATIONS = {
  googleCalendar: true,
  outlookCalendar: false,
  zoom: true,
  teams: false,
} as const;

type IntegrationKey = keyof typeof DEFAULT_INTEGRATIONS;

export default function Meetings() {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const currentUserId = user?.id ?? "user-1";
  const currentUserName = user?.name ?? "You";
  const [meetingSeeds] = useState<MeetingSeed[]>(initialMeetingSeeds);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetails | null>(null);
  const [isLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("date");
  const {
    tasks,
    knowledgeArticles,
    createTask: createWorkspaceTask,
    createKnowledge: createWorkspaceKnowledge,
    getMeetingById,
  } = useWorkspaceData();

  const [integrationState, setIntegrationState] = useState<Record<IntegrationKey, boolean>>(() => ({ ...DEFAULT_INTEGRATIONS }));
  const { addNotification } = useNotifications();
  const autoActionTaskIdsRef = useRef(new Set<string>());
  const autoSharedMeetingIdsRef = useRef(new Set<string>());
  const autoKnowledgeMeetingIdsRef = useRef(new Set<string>());
  const meetingReminderRef = useRef(new Set<string>());
  const dateLocale = language === "ja" ? jaLocale : undefined;

  const buildMeetingSummary = useCallback((meeting: MeetingDetails) => {
    const formattedStart = format(meeting.startTime, language === "ja" ? "yyyy/MM/dd HH:mm" : "PPpp", { locale: dateLocale });
    const sections: string[] = [
      `Meeting: ${meeting.title}`,
      `When: ${formattedStart}`,
    ];

    if (meeting.notes) {
      sections.push(`Notes:\n${meeting.notes}`);
    }

    if (meeting.decisions && meeting.decisions.length > 0) {
      const decisionLines = meeting.decisions.map((decision) => `- ${decision}`).join('\n');
      sections.push(`Decisions:\n${decisionLines}`);
    }

    const openItems = meeting.actionItems?.filter((item) => !item.completed) ?? [];
    if (openItems.length > 0) {
      const actionLines = openItems
        .map((item) => {
          const assignee = item.assignee ? ` (${item.assignee})` : '';
          return `- ${item.description}${assignee}`;
        })
        .join('\n');
      sections.push(`Action Items:\n${actionLines}`);
    }

    return sections.join('\n\n');
  }, [dateLocale, language]);

  const shareMeetingSummaryToChat = useCallback(async (meeting: MeetingDetails) => {
    const summary = buildMeetingSummary(meeting);
    const targetChannelId = meeting.relatedChatId ?? "general";
    try {
      await apiRequest("POST", "/api/messages", {
        content: summary,
        userId: "biz-assistant",
        userName: "Biz Assistant",
        channelId: targetChannelId,
        channelType: "channel",
      });
      toast({
        title: t("meetings.notifications.summaryPosted.title"),
        description: meeting.title,
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Failed to post summary",
        description,
        variant: "destructive",
      });
    }
  }, [buildMeetingSummary, toast]);


  const localizedMeetings = useMemo(() => {
    return meetingSeeds.map((seed) => ({
      ...seed,
      title: seed.title,
      description: seed.description,
    }));
  }, [meetingSeeds]);


  const integrationItems = useMemo<Array<{ key: IntegrationKey; label: string }>>(() => ([
    { key: "googleCalendar", label: t("meetings.integrations.providers.googleCalendar") },
    { key: "outlookCalendar", label: t("meetings.integrations.providers.outlookCalendar") },
    { key: "zoom", label: t("meetings.integrations.providers.zoom") },
    { key: "teams", label: t("meetings.integrations.providers.teams") },
  ]), [t]);

  useEffect(() => {
    const now = new Date();
    meetingSeeds.forEach((seed) => {
      const minutesUntilStart = differenceInMinutes(seed.startTime, now);
      if (minutesUntilStart <= 30 && minutesUntilStart >= 0 && !meetingReminderRef.current.has(seed.id)) {
        addNotification({
          type: "meeting",
          title: t("meetings.notifications.reminder.title", { title: seed.title }),
          message: t("meetings.notifications.reminder.message", { minutes: Math.max(1, Math.round(minutesUntilStart)) }),
          actionUrl: "/meetings",
          sourceId: seed.id,
        });
        meetingReminderRef.current.add(seed.id);
      }
      if (minutesUntilStart < 0 && meetingReminderRef.current.has(seed.id)) {
        meetingReminderRef.current.delete(seed.id);
      }
    });
  }, [meetingSeeds, addNotification, t]);

  const stats = useMemo(() => {
    const total = meetingSeeds.length;
    const upcoming = meetingSeeds.filter((m) => m.status === "scheduled").length;
    const ongoing = meetingSeeds.filter((m) => m.status === "ongoing").length;
    const completedToday = meetingSeeds.filter((m) => {
      return (
        m.status === "completed" &&
        startOfDay(m.endTime).getTime() === startOfDay(new Date()).getTime()
      );
    }).length;

    return { total, upcoming, ongoing, completedToday };
  }, [meetingSeeds]);

  const statusOptionLabels = useMemo(() => ({
    all: t("meetings.filters.status.options.all"),
    scheduled: t("meetings.statusLabels.scheduled"),
    ongoing: t("meetings.statusLabels.ongoing"),
    completed: t("meetings.statusLabels.completed"),
    cancelled: t("meetings.statusLabels.cancelled"),
  }), [language, t]);

  const dateOptionLabels = useMemo(() => ({
    all: t("meetings.filters.date.options.all"),
    today: t("meetings.filters.date.options.today"),
    tomorrow: t("meetings.filters.date.options.tomorrow"),
    week: t("meetings.filters.date.options.week"),
  }), [language, t]);

  const filteredMeetings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const today = startOfDay(new Date());

    return localizedMeetings
      .filter((meeting) => {
        if (query) {
          const matchesSearch = [
            meeting.title,
            meeting.description ?? "",
            ...meeting.participants.map((participant) => participant.name),
          ].some((value) => value.toLowerCase().includes(query));

          if (!matchesSearch) {
            return false;
          }
        }

        if (filterStatus !== "all" && meeting.status !== filterStatus) {
          return false;
        }

        if (filterDate !== "all") {
          const meetingDate = startOfDay(meeting.startTime);

          switch (filterDate) {
            case "today":
              if (meetingDate.getTime() !== today.getTime()) return false;
              break;
            case "tomorrow":
              if (meetingDate.getTime() !== addDays(today, 1).getTime()) return false;
              break;
            case "week":
              const weekFromNow = addDays(today, 7);
              if (!(meetingDate >= today && meetingDate <= weekFromNow)) return false;
              break;
            default:
              break;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title, language === "ja" ? "ja" : "en");
          case "status":
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          case "date":
          default:
            return a.startTime.getTime() - b.startTime.getTime();
        }
      });
  }, [localizedMeetings, searchQuery, filterStatus, filterDate, sortBy, language]);

  const handleJoin = (meetingId: string) => {
    console.log(t("meetings.log.join"), meetingId);
  };

  const handleMeetingClick = (meetingId: string) => {
    const seed = meetingSeeds.find((meeting) => meeting.id === meetingId);
    if (seed) {
      const extras = sampleMeetingExtras[meetingId];
      const details = hydrateMeetingDetails(seed, extras, t);
      setSelectedMeeting(details);
      setShowDetailsModal(true);
    }
  };

  const handleCreateMeeting = (meetingData: CreateMeetingData) => {
    console.log(t("meetings.log.create"), meetingData);
    setShowCreateModal(false);
  };

  const handleCreateTaskFromMeeting = (task: TaskFromMeeting) => {
    const meeting = getMeetingById(task.relatedMeetingId);

    createWorkspaceTask({
      title: task.title,
      description: task.description,
      status: "todo",
      priority: "medium",
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      tags: ["meeting"],
      relatedChatId: task.relatedChatId,
      relatedMeetingId: task.relatedMeetingId,
      origin: {
        source: "meeting",
        referenceId: task.relatedMeetingId,
        referenceLabel: meeting?.title ?? task.relatedMeetingId,
      },
    });

    toast({
        title: "Meeting task created",
      description: `Added "${task.title}" to the task board`,
    });
  };

  const handleCreateKnowledgeFromMeeting = (knowledge: KnowledgeFromMeeting) => {
    const summarySource = knowledge.content.trim();
    const summary = summarySource.length > 160 ? `${summarySource.slice(0, 157)}...` : summarySource;

    createWorkspaceKnowledge({
      title: knowledge.title,
      content: knowledge.content,
      summary: summary || knowledge.title,
      category: knowledge.category,
      tags: knowledge.tags,
      relatedChatId: knowledge.relatedChatId,
      relatedMeetingId: knowledge.relatedMeetingId,
      authorId: currentUserId,
      authorName: currentUserName,
      source: "meeting",
    });

    toast({
        title: "Meeting notes saved",
      description: `Published "${knowledge.title}" to the knowledge hub`,
    });
  };

  
  useEffect(() => {
    if (!showDetailsModal || !selectedMeeting) {
      return;
    }

    if (selectedMeeting.status !== "completed") {
      return;
    }

    const runAutomation = async () => {
      selectedMeeting.actionItems?.forEach((item) => {
        if (!item || item.completed) {
          return;
        }
        const actionKey = `${selectedMeeting.id}:${item.id}`;
        if (autoActionTaskIdsRef.current.has(actionKey)) {
          return;
        }
        const alreadyExists = tasks.some((task) => task.origin?.referenceId === actionKey);
        if (alreadyExists) {
          autoActionTaskIdsRef.current.add(actionKey);
          return;
        }

        createWorkspaceTask({
          title: item.description,
          description: t("meetings.details.actionItemTaskDescription", { title: selectedMeeting.title }),
          status: "todo",
          priority: "medium",
          assigneeId: item.assignee,
          dueDate: item.dueDate,
          tags: ["meeting"],
          relatedMeetingId: selectedMeeting.id,
          relatedChatId: selectedMeeting.relatedChatId,
          origin: {
            source: "meeting",
            referenceId: actionKey,
            referenceLabel: selectedMeeting.title,
          },
        });

        autoActionTaskIdsRef.current.add(actionKey);
        addNotification({
          type: "task",
          title: t("meetings.notifications.actionCaptured.title", { title: selectedMeeting.title }),
          message: item.description,
          actionUrl: "/tasks",
          sourceId: actionKey,
        });
      });

      if (!autoSharedMeetingIdsRef.current.has(selectedMeeting.id)) {
        await shareMeetingSummaryToChat(selectedMeeting);
        addNotification({
          type: "meeting",
          title: t("meetings.notifications.summaryPosted.title"),
          message: selectedMeeting.title,
          actionUrl: "/meetings",
          sourceId: selectedMeeting.id,
        });
        autoSharedMeetingIdsRef.current.add(selectedMeeting.id);
      }

      const hasKnowledge = knowledgeArticles.some((article) => article.relatedMeetingId === selectedMeeting.id);
      if (selectedMeeting.notes && !autoKnowledgeMeetingIdsRef.current.has(selectedMeeting.id) && !hasKnowledge) {
        const summarySource = selectedMeeting.notes;
        const summary = summarySource.length > 160 ? `${summarySource.slice(0, 157)}...` : summarySource;

        createWorkspaceKnowledge({
          title: `${selectedMeeting.title} Notes`,
          content: selectedMeeting.notes,
          summary: summary || selectedMeeting.title,
          category: "Meeting",
          tags: ["meeting", "notes"],
          relatedChatId: selectedMeeting.relatedChatId,
          relatedMeetingId: selectedMeeting.id,
          authorId: currentUserId,
          authorName: currentUserName,
          source: "meeting",
        });

        addNotification({
          type: "knowledge",
          title: t("meetings.notifications.notesSaved.title"),
          message: selectedMeeting.title,
          actionUrl: "/knowledge",
          sourceId: selectedMeeting.id,
        });

        autoKnowledgeMeetingIdsRef.current.add(selectedMeeting.id);
      }
    };

    runAutomation().catch((error) => {
      console.error("Failed to run meeting automation", error);
    });
  }, [
    showDetailsModal,
    selectedMeeting,
    tasks,
    knowledgeArticles,
    createWorkspaceTask,
    createWorkspaceKnowledge,
    addNotification,
    shareMeetingSummaryToChat,
    currentUserId,
    currentUserName,
    t,
  ]);

  const handleShareToChat = async (content: string) => {
    try {
      const targetChannelId = selectedMeeting?.relatedChatId ?? "general";
      await apiRequest("POST", "/api/messages", {
        content,
        userId: currentUserId,
        userName: currentUserName,
        channelId: targetChannelId,
        channelType: "channel",
      });
      toast({
        title: t("meetings.notifications.summaryPosted.title"),
        description: selectedMeeting?.title ?? content.slice(0, 40),
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Failed to share summary",
        description,
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterDate("all");
  };

  return (
    <div className="page-container" data-testid="page-meetings">
      <div className="page-header">
        <p className="text-muted-foreground max-w-3xl">
          {t("meetings.header.description")}
        </p>
        <Button onClick={() => setShowCreateModal(true)} data-testid="button-new-meeting">
          <Plus className="h-4 w-4 mr-2" />
          {t("meetings.actions.schedule")}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
            <Card data-testid="stat-total-meetings" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("meetings.stats.total.label")}</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {t("meetings.stats.total.hint")}
                </p>
              </CardContent>
            </Card>
  
            <Card data-testid="stat-upcoming-meetings" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("meetings.stats.upcoming.label")}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcoming}</div>
                <p className="text-xs text-muted-foreground">
                  {t("meetings.stats.upcoming.hint")}
                </p>
              </CardContent>
            </Card>
  
            <Card data-testid="stat-ongoing-meetings" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("meetings.stats.ongoing.label")}</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.ongoing}</div>
                <p className="text-xs text-muted-foreground">
                  {t("meetings.stats.ongoing.hint")}
                </p>
              </CardContent>
            </Card>
  
            <Card data-testid="stat-completed-today" className="transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{t("meetings.stats.completedToday.label")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground transition-colors duration-150" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedToday}</div>
                <p className="text-xs text-muted-foreground">
                  {t("meetings.stats.completedToday.hint")}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/30 border-dashed" data-testid="integrations-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {t("meetings.integrations.title")}
              </CardTitle>
              <CardDescription>{t("meetings.integrations.description")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {integrationItems.map((integration) => {
                const active = integrationState[integration.key as IntegrationKey];
                return (
                  <div
                    key={integration.key}
                    className="flex items-center justify-between rounded-md border bg-card p-3 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-medium">{integration.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {active
                          ? t("meetings.integrations.status.connected")
                          : t("meetings.integrations.status.disconnected")}
                      </p>
                    </div>
                    <Button
                      variant={active ? "outline" : "default"}
                      size="sm"
                      onClick={() =>
                        setIntegrationState((prev) => ({
                          ...prev,
                          [integration.key]: !prev[integration.key as IntegrationKey],
                        }))
                      }
                      data-testid={`integration-toggle-${integration.key}`}
                    >
                      {active
                        ? t("meetings.integrations.actions.disconnect")
                        : t("meetings.integrations.actions.connect")}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("meetings.filters.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-meetings"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t("meetings.filters.toggle")}
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32" data-testid="filter-sort">
                <SelectValue placeholder={t("meetings.filters.sort.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">?? {t("meetings.filters.sort.options.date")}</SelectItem>
                <SelectItem value="title">?? {t("meetings.filters.sort.options.title")}</SelectItem>
                <SelectItem value="status">??? {t("meetings.filters.sort.options.status")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showAdvancedFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t("meetings.filters.status.label")}</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger data-testid="filter-status">
                    <SelectValue placeholder={t("meetings.filters.status.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">??? {statusOptionLabels.all}</SelectItem>
                    <SelectItem value="scheduled">? {statusOptionLabels.scheduled}</SelectItem>
                    <SelectItem value="ongoing">?? {statusOptionLabels.ongoing}</SelectItem>
                    <SelectItem value="completed">? {statusOptionLabels.completed}</SelectItem>
                    <SelectItem value="cancelled">? {statusOptionLabels.cancelled}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("meetings.filters.date.label")}</label>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger data-testid="filter-date">
                    <SelectValue placeholder={t("meetings.filters.date.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">?? {dateOptionLabels.all}</SelectItem>
                    <SelectItem value="today">?? {dateOptionLabels.today}</SelectItem>
                    <SelectItem value="tomorrow">?? {dateOptionLabels.tomorrow}</SelectItem>
                    <SelectItem value="week">?? {dateOptionLabels.week}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {t("meetings.filters.summary.status", { value: statusOptionLabels[filterStatus as keyof typeof statusOptionLabels] })}
                  </Badge>
                )}
                {filterDate !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {t("meetings.filters.summary.date", { value: dateOptionLabels[filterDate as keyof typeof dateOptionLabels] })}
                  </Badge>
                )}
              </div>

              {(filterStatus !== "all" || filterDate !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  {t("meetings.filters.summary.clear")}
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("meetings.results.summary", { count: filteredMeetings.length, total: localizedMeetings.length })}
        </p>
        {searchQuery && (
          <Badge variant="outline" className="gap-1">
            <Search className="h-3 w-3" />
            {t("meetings.results.searchTag", { query: searchQuery })}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6" data-testid="meetings-grid">
          {[...Array(6)].map((_, index) => (
            <MeetingSkeleton key={index} />
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={searchQuery ? t("meetings.results.empty.searchTitle") : t("meetings.results.empty.defaultTitle")}
          description={
            searchQuery
              ? t("meetings.results.empty.searchDescription", { query: searchQuery })
              : t("meetings.results.empty.defaultDescription")
          }
          action={
            <Button onClick={() => (searchQuery ? setSearchQuery("") : setShowCreateModal(true))}>
              <Plus className="h-4 w-4 mr-2" />
              {searchQuery ? t("meetings.actions.clearSearch") : t("meetings.actions.scheduleFirst")}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6" data-testid="meetings-grid">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              {...meeting}
              onJoin={handleJoin}
              onClick={handleMeetingClick}
              locale={dateLocale}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateMeetingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateMeeting={handleCreateMeeting}
        />
      )}

      {showDetailsModal && selectedMeeting && (
        <MeetingDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          meeting={selectedMeeting}
          onCreateTask={handleCreateTaskFromMeeting}
          onCreateKnowledge={handleCreateKnowledgeFromMeeting}
          onShareToChat={handleShareToChat}
          locale={dateLocale}
        />
      )}
    </div>
  );
}










