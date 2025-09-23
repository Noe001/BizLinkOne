import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Plus, Video, Clock, Users, CalendarDays, TrendingUp, Filter } from "lucide-react";
import { MeetingCard, type MeetingStatus } from "@/components/MeetingCard";
import { CreateMeetingModal, CreateMeetingData } from "@/components/CreateMeetingModal";
import { MeetingDetailsModal, MeetingDetails, TaskFromMeeting, KnowledgeFromMeeting } from "@/components/MeetingDetailsModal";
import { StatCardSkeleton, MeetingSkeleton, EmptyState } from "@/components/ui/skeleton-components";
import { format, addDays, startOfDay } from "date-fns";

// todo: remove mock functionality
const mockMeetings = [
  {
    id: "meeting-1",
    title: "Daily Standup",
    description: "Quick sync on current progress and blockers",
    startTime: new Date(Date.now() + 1000 * 60 * 30),
    endTime: new Date(Date.now() + 1000 * 60 * 60),
    status: "scheduled" as MeetingStatus,
    participants: [
      { id: "john-doe", name: "John Doe" },
      { id: "sarah-wilson", name: "Sarah Wilson" },
      { id: "mike-johnson", name: "Mike Johnson" },
    ],
    platform: "zoom" as const,
    relatedChatId: "development",
  },
  {
    id: "meeting-2",
    title: "Sprint Planning",
    description: "Planning session for the upcoming sprint, including story estimation and capacity planning",
    startTime: new Date(),
    endTime: new Date(Date.now() + 1000 * 60 * 90),
    status: "ongoing" as MeetingStatus,
    participants: [
      { id: "john-doe", name: "John Doe" },
      { id: "sarah-wilson", name: "Sarah Wilson" },
      { id: "mike-johnson", name: "Mike Johnson" },
      { id: "alice-cooper", name: "Alice Cooper" },
      { id: "bob-smith", name: "Bob Smith" },
    ],
    platform: "meet" as const,
    hasNotes: true,
    relatedChatId: "general",
  },
  {
    id: "meeting-3",
    title: "Product Demo",
    description: "Demonstration of new features for stakeholders",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    endTime: new Date(Date.now() - 1000 * 60 * 60),
    status: "completed" as MeetingStatus,
    participants: [
      { id: "alice-cooper", name: "Alice Cooper" },
      { id: "bob-smith", name: "Bob Smith" },
      { id: "stakeholder", name: "Product Stakeholder" },
    ],
    platform: "teams" as const,
    hasRecording: true,
    hasNotes: true,
    relatedChatId: "product",
  },
  {
    id: "meeting-4",
    title: "Client Review",
    description: "Weekly client check-in and progress review",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60),
    status: "cancelled" as MeetingStatus,
    participants: [
      { id: "sarah-wilson", name: "Sarah Wilson" },
      { id: "client-rep", name: "Client Representative" },
    ],
    platform: "teams" as const,
  },
];

const mockStats = {
  totalMeetings: mockMeetings.length,
  upcomingMeetings: mockMeetings.filter(m => m.status === "scheduled").length,
  ongoingMeetings: mockMeetings.filter(m => m.status === "ongoing").length,
  completedToday: mockMeetings.filter(m => 
    m.status === "completed" && 
    startOfDay(m.endTime).getTime() === startOfDay(new Date()).getTime()
  ).length,
};

export default function Meetings() {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("date");

  // Filtered meetings based on search and filters
  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          meeting.title.toLowerCase().includes(searchLower) ||
          meeting.description.toLowerCase().includes(searchLower) ||
          meeting.participants.some(p => p.name.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filterStatus !== "all" && meeting.status !== filterStatus) {
        return false;
      }

      // Date filter
      if (filterDate !== "all") {
        const today = startOfDay(new Date());
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
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        case "date":
        default:
          return a.startTime.getTime() - b.startTime.getTime();
      }
    });
  }, [meetings, searchQuery, filterStatus, filterDate, sortBy]);

  const handleJoin = (meetingId: string) => {
    console.log(`Joining meeting ${meetingId}`);
  };

  const handleMeetingClick = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (meeting) {
      setSelectedMeeting({
        ...meeting,
        decisions: ["Implement new authentication system", "Update API documentation"],
        actionItems: [
          {
            id: "action-1",
            description: "Set up development environment",
            assignee: "john-doe",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            completed: false,
          },
          {
            id: "action-2", 
            description: "Review security requirements",
            assignee: "sarah-wilson",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            completed: true,
          },
        ],
        notes: "Meeting went well. Team is aligned on the new authentication approach. Need to finalize timeline for implementation.",
      } as MeetingDetails);
      setShowDetailsModal(true);
    }
  };

  const handleCreateMeeting = (meetingData: any) => {
    console.log("Creating meeting:", meetingData);
    setShowCreateModal(false);
  };

  const handleCreateTaskFromMeeting = (task: TaskFromMeeting) => {
    console.log("Creating task from meeting:", task);
    // Here you would typically call an API to create the task
  };

  const handleCreateKnowledgeFromMeeting = (knowledge: KnowledgeFromMeeting) => {
    console.log("Creating knowledge from meeting:", knowledge);
    // Here you would typically call an API to create the knowledge article
  };

  const handleShareToChat = (content: string) => {
    console.log("Sharing to chat:", content);
    // Here you would typically share the content to the related chat channel
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-meetings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Manage your meetings and track session recordings and notes.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} data-testid="button-new-meeting">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Stats Overview */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="stat-total-meetings">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalMeetings}</div>
              <p className="text-xs text-muted-foreground">
                All scheduled meetings
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-upcoming-meetings">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.upcomingMeetings}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled meetings
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-ongoing-meetings">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.ongoingMeetings}</div>
              <p className="text-xs text-muted-foreground">
                Active meetings
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-completed-today">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                Meetings finished today
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings, descriptions, or participants..."
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
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32" data-testid="filter-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">📅 Date</SelectItem>
                <SelectItem value="title">🔤 Title</SelectItem>
                <SelectItem value="status">🏷️ Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger data-testid="filter-status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🗂️ All statuses</SelectItem>
                    <SelectItem value="scheduled">⏰ Scheduled</SelectItem>
                    <SelectItem value="ongoing">🔴 Ongoing</SelectItem>
                    <SelectItem value="completed">✅ Completed</SelectItem>
                    <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger data-testid="filter-date">
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">📅 All dates</SelectItem>
                    <SelectItem value="today">🔹 Today</SelectItem>
                    <SelectItem value="tomorrow">🔸 Tomorrow</SelectItem>
                    <SelectItem value="week">📝 This week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {filterStatus}
                  </Badge>
                )}
                {filterDate !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {filterDate}
                  </Badge>
                )}
              </div>
              
              {(filterStatus !== "all" || filterDate !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterDate("all");
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMeetings.length} of {meetings.length} meetings
        </p>
        {searchQuery && (
          <Badge variant="outline" className="gap-1">
            <Search className="h-3 w-3" />
            "{searchQuery}"
          </Badge>
        )}
      </div>

      {/* Meetings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="meetings-grid">
          {[...Array(6)].map((_, i) => (
            <MeetingSkeleton key={i} />
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={searchQuery ? "No meetings found" : "No meetings scheduled"}
          description={
            searchQuery 
              ? `No meetings match "${searchQuery}". Try adjusting your search or filters.`
              : "Schedule your first meeting to get started with team collaboration."
          }
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {searchQuery ? "Clear search" : "Schedule first meeting"}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="meetings-grid">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              {...meeting}
              onJoin={handleJoin}
              onClick={handleMeetingClick}
            />
          ))}
        </div>
      )}

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <CreateMeetingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateMeeting={handleCreateMeeting}
        />
      )}

      {/* Meeting Details Modal */}
      {showDetailsModal && selectedMeeting && (
        <MeetingDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          meeting={selectedMeeting}
          onCreateTask={handleCreateTaskFromMeeting}
          onCreateKnowledge={handleCreateKnowledgeFromMeeting}
          onShareToChat={handleShareToChat}
        />
      )}
    </div>
  );
}
