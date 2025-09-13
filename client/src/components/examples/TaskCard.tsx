import { TaskCard } from "../TaskCard";

export default function TaskCardExample() {
  const handleStatusChange = (taskId: string, newStatus: any) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
  };

  const handleTaskClick = (taskId: string) => {
    console.log(`Task ${taskId} clicked`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-4xl">
      <TaskCard
        id="task-1"
        title="Implement user authentication system"
        description="Set up JWT-based authentication with login, logout, and registration functionality."
        status="in-progress"
        priority="high"
        assignee={{
          id: "john-doe",
          name: "John Doe",
        }}
        dueDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)}
        relatedChatId="general"
        onStatusChange={handleStatusChange}
        onClick={handleTaskClick}
      />
      
      <TaskCard
        id="task-2"
        title="Update documentation"
        description="Review and update the API documentation to reflect recent changes."
        status="todo"
        priority="medium"
        assignee={{
          id: "sarah-wilson",
          name: "Sarah Wilson",
        }}
        dueDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)}
        onStatusChange={handleStatusChange}
        onClick={handleTaskClick}
      />
      
      <TaskCard
        id="task-3"
        title="Fix responsive design issues"
        status="review"
        priority="urgent"
        assignee={{
          id: "mike-johnson",
          name: "Mike Johnson",
        }}
        dueDate={new Date(Date.now() + 1000 * 60 * 60 * 24)}
        relatedChatId="development"
        relatedMeetingId="standup-today"
        onStatusChange={handleStatusChange}
        onClick={handleTaskClick}
      />
    </div>
  );
}