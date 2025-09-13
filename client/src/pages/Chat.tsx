import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Hash, Users, Phone, Video, Settings } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage as ChatMessageType } from "@shared/schema";

interface ChannelInfo {
  name: string;
  description: string;
  memberCount: number;
  isChannel: boolean;
}

// Mock channel info until we have channels API
const getChannelInfo = (channelId: string): ChannelInfo => {
  const channels: Record<string, ChannelInfo> = {
    general: { name: "general", description: "General discussions", memberCount: 12, isChannel: true },
    development: { name: "development", description: "Development team discussions and updates", memberCount: 8, isChannel: true },
    marketing: { name: "marketing", description: "Marketing and growth discussions", memberCount: 6, isChannel: true },
    support: { name: "support", description: "Customer support and issues", memberCount: 4, isChannel: true },
  };
  return channels[channelId] || { name: channelId, description: "", memberCount: 1, isChannel: true };
};

export default function Chat() {
  // Get channelId from URL params
  const [match, params] = useRoute("/chat/channel/:channelId");
  const channelId = params?.channelId || "general";
  
  // Fetch messages for this channel
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessageType[]>({
    queryKey: ["/api/messages", `?channelId=${channelId}`],
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        content,
        userId: "current-user",
        userName: "You",
        channelId,
        channelType: "channel"
      });
    },
    onSuccess: () => {
      // Invalidate and refetch messages for this channel
      queryClient.invalidateQueries({ queryKey: ["/api/messages", `?channelId=${channelId}`] });
    },
  });
  
  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };
  
  const channelInfo = getChannelInfo(channelId);

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
    <div className="flex flex-col h-full bg-card border border-card-border rounded-lg" data-testid="page-chat">
      {/* Chat Header - Cohere Style */}
      <div className="border-b border-card-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {channelInfo.isChannel ? (
                <Hash className="h-5 w-5 text-primary" />
              ) : (
                <Users className="h-5 w-5 text-primary" />
              )}
              <h1 className="text-lg font-sans font-medium" data-testid="chat-title">
                {channelInfo.name}
              </h1>
            </div>
            <Badge variant="outline" className="text-xs font-mono uppercase" data-testid="member-count">
              <Users className="h-3 w-3 mr-1" />
              {channelInfo.memberCount}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9"
                data-testid="input-search-messages"
              />
            </div>
            <Button variant="ghost" size="icon" data-testid="button-voice-call">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-video-call">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-chat-settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {channelInfo.description && (
          <p className="text-sm font-sans text-muted-foreground mt-2" data-testid="chat-description">
            {channelInfo.description}
          </p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto" data-testid="messages-container">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">No messages yet. Start the conversation!</div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  {...message}
                  isOwn={message.userId === "current-user"}
                  onConvertToTask={handleConvertToTask}
                  onConvertToKnowledge={handleConvertToKnowledge}
                  onReply={handleReply}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        placeholder={`Message #${channelInfo.name}`}
        disabled={sendMessageMutation.isPending}
      />
    </div>
  );
}