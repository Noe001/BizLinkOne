import { ChatInput } from "../ChatInput";

export default function ChatInputExample() {
  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">#general</h3>
          <p className="text-sm text-muted-foreground">General discussion channel</p>
        </div>
        
        <div className="h-64 p-4 flex items-center justify-center text-muted-foreground">
          <p>Chat messages would appear here...</p>
        </div>
        
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder="Message #general"
        />
      </div>
    </div>
  );
}