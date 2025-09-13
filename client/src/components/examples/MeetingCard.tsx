import { MeetingCard } from "../MeetingCard";

export default function MeetingCardExample() {
  const handleJoin = (meetingId: string) => {
    console.log(`Joining meeting ${meetingId}`);
  };

  const handleClick = (meetingId: string) => {
    console.log(`Meeting ${meetingId} clicked`);
  };

  const participants = [
    { id: "john-doe", name: "John Doe" },
    { id: "sarah-wilson", name: "Sarah Wilson" },
    { id: "mike-johnson", name: "Mike Johnson" },
    { id: "alice-cooper", name: "Alice Cooper" },
    { id: "bob-smith", name: "Bob Smith" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-6xl">
      <MeetingCard
        id="meeting-1"
        title="Daily Standup"
        description="Quick sync on current progress and blockers"
        startTime={new Date(Date.now() + 1000 * 60 * 30)}
        endTime={new Date(Date.now() + 1000 * 60 * 60)}
        status="scheduled"
        participants={participants.slice(0, 3)}
        platform="zoom"
        relatedChatId="development"
        onJoin={handleJoin}
        onClick={handleClick}
      />
      
      <MeetingCard
        id="meeting-2"
        title="Sprint Planning"
        description="Planning session for the upcoming sprint, including story estimation and capacity planning"
        startTime={new Date()}
        endTime={new Date(Date.now() + 1000 * 60 * 90)}
        status="ongoing"
        participants={participants}
        platform="meet"
        hasNotes={true}
        relatedChatId="general"
        onJoin={handleJoin}
        onClick={handleClick}
      />
      
      <MeetingCard
        id="meeting-3"
        title="Product Demo"
        description="Demonstration of new features for stakeholders"
        startTime={new Date(Date.now() - 1000 * 60 * 60 * 2)}
        endTime={new Date(Date.now() - 1000 * 60 * 60)}
        status="completed"
        participants={participants.slice(0, 4)}
        platform="teams"
        hasRecording={true}
        hasNotes={true}
        relatedChatId="product"
        onJoin={handleJoin}
        onClick={handleClick}
      />
    </div>
  );
}