import { ChatMessage } from "../ChatMessage";

export default function ChatMessageExample() {
  const handleConvertToTask = (messageId: string) => {
    console.log(`Converting message ${messageId} to task`);
  };

  const handleConvertToKnowledge = (messageId: string) => {
    console.log(`Converting message ${messageId} to knowledge`);
  };

  const handleReply = (messageId: string) => {
    console.log(`Replying to message ${messageId}`);
  };

  return (
    <div className="max-w-2xl space-y-4 p-4">
      <ChatMessage
        id="msg-1"
        userId="john-doe"
        userName="John Doe"
        content="Hey team, I think we should implement the new authentication system next sprint. What do you all think?"
        timestamp={new Date(Date.now() - 1000 * 60 * 15)}
        onConvertToTask={handleConvertToTask}
        onConvertToKnowledge={handleConvertToKnowledge}
        onReply={handleReply}
      />
      
      <ChatMessage
        id="msg-2"
        userId="current-user"
        userName="You"
        content="That's a great idea! I can help with the backend implementation. Should we schedule a meeting to discuss the details?"
        timestamp={new Date(Date.now() - 1000 * 60 * 10)}
        isOwn={true}
        onConvertToTask={handleConvertToTask}
        onConvertToKnowledge={handleConvertToKnowledge}
        onReply={handleReply}
      />
      
      <ChatMessage
        id="msg-3"
        userId="sarah-wilson"
        userName="Sarah Wilson"
        content="I've documented the authentication flow requirements in our knowledge base. Here's the link: https://knowledge.company.com/auth-flow"
        timestamp={new Date(Date.now() - 1000 * 60 * 5)}
        canConvertToTask={false}
        onConvertToTask={handleConvertToTask}
        onConvertToKnowledge={handleConvertToKnowledge}
        onReply={handleReply}
      />
    </div>
  );
}