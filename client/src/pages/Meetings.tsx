import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Plus, Video, Clock, Users } from "lucide-react";
import { MeetingCard, type MeetingStatus } from "@/components/MeetingCard";
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
      { id: "sarah-wilson", name: "Sarah Wilson" },
      { id: "product-manager", name: "Product Manager" },
      { id: "stakeholder-1", name: "Stakeholder One" },
      { id: "stakeholder-2", name: "Stakeholder Two" },
    ],
    platform: "teams" as const,
    hasRecording: true,
    hasNotes: true,
    relatedChatId: "product",
  },
  {
    id: "meeting-4",
    title: "1:1 with Manager",
    description: "Weekly one-on-one meeting to discuss progress and goals",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 30),
    status: "scheduled" as MeetingStatus,
    participants: [
      { id: "current-user", name: "You" },
      { id: "manager", name: "Your Manager" },
    ],
    platform: "zoom" as const,
  },
  {
    id: "meeting-5",
    title: "Architecture Review",
    description: "Review of the new microservices architecture proposal",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60),
    status: "scheduled" as MeetingStatus,
    participants: [
      { id: "john-doe", name: "John Doe" },
      { id: "mike-johnson", name: "Mike Johnson" },
      { id: "architect", name: "Senior Architect" },
    ],
    platform: "meet" as const,
    relatedChatId: "development",
  },
  {
    id: "meeting-6",
    title: "Client Presentation",
    description: "Final presentation of the project deliverables to the client",
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

  const handleJoin = (meetingId: string) => {
    console.log(`Joining meeting ${meetingId}`);
  };

  const handleMeetingClick = (meetingId: string) => {
    console.log(`Viewing meeting details for ${meetingId}`);
  };

  const filteredMeetings = meetings
    .filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           meeting.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || meeting.status === filterStatus;
      
      let matchesDate = true;
      if (filterDate !== "all") {
        const today = startOfDay(new Date());
        const meetingDate = startOfDay(meeting.startTime);
        
        switch (filterDate) {
          case "today":
            matchesDate = meetingDate.getTime() === today.getTime();
            break;
          case "tomorrow":
            matchesDate = meetingDate.getTime() === addDays(today, 1).getTime();
            break;
          case "week":
            const weekFromNow = addDays(today, 7);
            matchesDate = meetingDate >= today && meetingDate <= weekFromNow;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="p-6 space-y-6" data-testid="page-meetings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Manage your meetings and track session recordings and notes.
          </p>
        </div>
        <Button data-testid="button-new-meeting">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="stat-upcoming">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground">
              Next in 30 minutes
            </p>
          </CardContent>
        </Card>

        <Card data-testid="stat-ongoing">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.ongoingMeetings}</div>
            <p className="text-xs text-muted-foreground">
              Join now available
            </p>
          </CardContent>
        </Card>

        <Card data-testid="stat-completed-today">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              With recordings
            </p>
          </CardContent>
        </Card>

        <Card data-testid="stat-total">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total This Week</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              All meetings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-meetings"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32" data-testid="filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDate} onValueChange={setFilterDate}>
            <SelectTrigger className="w-32" data-testid="filter-date">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meetings Grid */}
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

      {/* Empty State */}
      {filteredMeetings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No meetings found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== "all" || filterDate !== "all"
                ? "Try adjusting your search or filters."
                : "Start by scheduling your first meeting."}
            </p>
            <Button data-testid="button-schedule-first-meeting">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}