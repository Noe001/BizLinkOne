import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Hash, Users, Phone, Video, Settings, MessageSquare } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatThread } from "@/components/ChatThread";
import { NewTaskModal, type NewTaskData } from "@/components/NewTaskModal";
import { CreateKnowledgeModal, type CreateKnowledgeData } from "@/components/CreateKnowledgeModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage as ChatMessageType } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import type { MessageModalContext } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface ChannelInfo {
  name: string;
  description: string;
  memberCount: number;
  isChannel: boolean;
}

// Mock data with thread and unread support
const mockMessagesWithThreads = [
  {
    id: "msg-1",
    userId: "user-2",
    userName: "Alice Johnson",
    content: "Hey team, I've been working on the new authentication system. What do you think about implementing OAuth 2.0?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    channelId: "development",
    threadCount: 3,
    lastThreadReply: new Date(Date.now() - 1000 * 60 * 30),
    isUnread: false,
  },
  {
    id: "msg-2",
    userId: "user-1",
    userName: "You",
    content: "That sounds great! OAuth 2.0 would definitely improve our security posture. Have you considered which provider to use?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    channelId: "development",
    isUnread: false,
  },
  {
    id: "msg-3",
    userId: "user-2",
    userName: "Bob Smith",
    content: "I just pushed the latest updates to the API. The new endpoints are ready for testing. Can someone review the PR?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    channelId: "development",
    threadCount: 1,
    lastThreadReply: new Date(Date.now() - 1000 * 60 * 15),
    isUnread: true,
  },
  {
    id: "msg-4",
    userId: "user-3",
    userName: "Carol Wilson",
    content: "The client meeting went well! They approved the design mockups. I'll update the project board with the feedback.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    channelId: "development",
    isUnread: true,
  },
];

type MockMessage = (typeof mockMessagesWithThreads)[number];
type DisplayMessage = MockMessage & { isFirstUnread?: boolean };

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
  const { user } = useAuth();
  const currentUserId = user?.id ?? "user-1";
  const currentUserName = user?.name ?? "You";

  // Support both channel and DM routes
  const [matchType, paramsType] = useRoute("/chat/:type/:id");
  const [matchChannel, paramsChannel] = useRoute("/chat/channel/:channelId");
  const contextType = matchType ? (paramsType as any).type : (matchChannel ? "channel" : "channel");
  const contextId = matchType ? (paramsType as any).id : (paramsChannel as any)?.channelId || "general";
  const isChannelContext = contextType === "channel";
  const channelId = isChannelContext ? contextId : undefined;
  
  // Local state for filtering
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showThreadsOnly, setShowThreadsOnly] = useState(false);
  
  // Thread state
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);

  const [taskModalContext, setTaskModalContext] = useState<MessageModalContext | null>(null);
  const [knowledgeModalContext, setKnowledgeModalContext] = useState<MessageModalContext | null>(null);
  
  // Close thread when switching channels
  useEffect(() => {
    if (selectedThread) {
      setSelectedThread(null);
      setThreadMessages([]);
    }
  }, [channelId]);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use mock data for now - in real app, this would be API call
  // TODO: Replace mockMessagesWithThreads with useQuery to fetch real messages from API
  const messages = isChannelContext 
    ? mockMessagesWithThreads.filter(msg => msg.channelId === (channelId as string)) 
    : [];
  
  // Apply filters and identify first unread message
  const filteredMessages = messages.filter(message => {
    if (showUnreadOnly && !message.isUnread) return false;
    if (showThreadsOnly && !message.threadCount) return false;
    return true;
  });

  // Find the first unread message index
  const firstUnreadIndex = filteredMessages.findIndex(message => message.isUnread);
  
  // Mark the first unread message
  const messagesWithUnreadMarker: DisplayMessage[] = filteredMessages.map((message, index) => ({
    ...message,
    isFirstUnread: message.isUnread && index === firstUnreadIndex
  }));

  // Debug: Log message information
  console.log('Current channelId:', channelId);
  console.log('All messages:', messages.length);
  console.log('Filtered messages:', filteredMessages.length);
  console.log('Messages with unread marker:', messagesWithUnreadMarker.length);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesWithUnreadMarker.length]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        content,
        userId: currentUserId,
        userName: currentUserName,
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
  
  const channelInfo = isChannelContext 
    ? getChannelInfo(channelId as string) 
    : { name: contextId, description: "Direct message", memberCount: 2, isChannel: false };

  const handleRequestTaskCreation = (messageId: string) => {
    const message = messagesWithUnreadMarker.find(item => item.id === messageId);
    if (!message) {
      console.warn(`Unable to find message ${messageId} for task conversion.`);
      return;
    }

    setTaskModalContext({
      messageId,
      content: message.content,
      authorName: message.userName,
      channelId: message.channelId,
    });
  };

  const handleTaskCreate = (taskData: NewTaskData) => {
    if (!taskModalContext) {
      return;
    }

    console.log("Creating task from message", {
      messageId: taskModalContext.messageId,
      taskData,
    });
    setTaskModalContext(null);
  };

  const handleRequestKnowledgeCreation = (messageId: string) => {
    const message = messagesWithUnreadMarker.find(item => item.id === messageId);
    if (!message) {
      console.warn(`Unable to find message ${messageId} for knowledge conversion.`);
      return;
    }

    setKnowledgeModalContext({
      messageId,
      content: message.content,
      authorName: message.userName,
      channelId: message.channelId,
    });
  };

  const handleKnowledgeCreate = (knowledgeData: CreateKnowledgeData) => {
    if (!knowledgeModalContext) {
      return;
    }

    console.log("Creating knowledge article from message", {
      messageId: knowledgeModalContext.messageId,
      knowledgeData,
    });
    setKnowledgeModalContext(null);
  };

  const handleReply = (messageId: string) => {
    console.log(`Replying to message ${messageId}`);
    setSelectedThread(messageId);
    loadThreadMessages(messageId);
  };

  const handleViewThread = (messageId: string) => {
    console.log(`Viewing thread for message ${messageId}`);
    setSelectedThread(messageId);
    loadThreadMessages(messageId);
  };

  const handleShareKnowledge = (knowledgeId: string, title: string, summary: string) => {
    console.log(`Shared knowledge article: ${title} (${knowledgeId})`);
  };

  const loadThreadMessages = async (messageId: string) => {
    setIsLoadingThread(true);
    try {
      // Mock thread messages - in real app, this would be an API call
      const mockThreadMessages = [
        {
          id: `thread-${messageId}-1`,
          userId: "user-2",
          userName: "Bob Smith",
          content: "Great question! I've been looking into Google OAuth and Auth0.",
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          isOwn: false,
        },
        {
          id: `thread-${messageId}-2`,
          userId: currentUserId,
          userName: currentUserName,
          content: "Auth0 looks promising. What about the pricing?",
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          isOwn: true,
        },
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setThreadMessages(mockThreadMessages);
    } catch (error) {
      console.error('Failed to load thread messages:', error);
      setThreadMessages([]);
    } finally {
      setIsLoadingThread(false);
    }
  };

  const handleCloseThread = () => {
    setSelectedThread(null);
    setThreadMessages([]);
  };

  const handleSendThreadReply = async (content: string) => {
    if (!selectedThread) return;
    
    console.log(`Sending thread reply to ${selectedThread}: ${content}`);
    
    // Mock sending thread reply - in real app, this would be an API call
    const newReply = {
      id: `thread-${selectedThread}-${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      content,
      timestamp: new Date(),
      isOwn: true,
    };
    
    setThreadMessages(prev => [...prev, newReply]);
  };

  return (
    <div className="flex h-full bg-background rounded-md">
      {/* Main Chat Container */}
      <div className={`flex flex-col bg-card border border-card-border rounded-lg ${selectedThread ? 'flex-1 mr-2' : 'w-full'}`} data-testid="page-chat">
        {/* Chat Header - Enhanced with filters */}
        <div className="border-b border-card-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {channelInfo.isChannel ? (
                  <>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                      <Hash className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold" data-testid="chat-title">
                        {channelInfo.name}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {channelInfo.memberCount} members • {channelInfo.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold" data-testid="chat-title">
                        {channelInfo.name}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Direct message • {channelInfo.memberCount} participants
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Quick actions */}
              <Button variant="ghost" size="sm" className="px-2">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="px-2">
                <Video className="h-4 w-4" />
              </Button>
              
              {/* Message filters */}
              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant={showUnreadOnly ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className="text-xs"
                >
                  Unread only
                  {messages.filter(m => m.isUnread).length > 0 && (
                    <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                      {messages.filter(m => m.isUnread).length}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={showThreadsOnly ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowThreadsOnly(!showThreadsOnly)}
                  className="text-xs"
                >
                  Threads only
                  {messages.filter(m => m.threadCount).length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                      {messages.filter(m => m.threadCount).length}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="px-2">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-card" data-testid="messages-container">
          <div className="py-2">
            {messagesWithUnreadMarker.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <div className="text-muted-foreground">
                    {showUnreadOnly ? "No unread messages" : 
                     showThreadsOnly ? "No messages with threads" : 
                     "No messages yet. Start the conversation!"}
                  </div>
                </div>
              </div>
            ) : (
              messagesWithUnreadMarker.map((message) => (
                <ChatMessage
                  key={message.id}
                  {...message}
                  channelId={channelId}
                  isOwn={message.userId === currentUserId}
                  onRequestTaskCreation={handleRequestTaskCreation}
                  onRequestKnowledgeCreation={handleRequestKnowledgeCreation}
                  onReply={handleReply}
                  onViewThread={handleViewThread}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder={`Message ${isChannelContext ? '#' + channelInfo.name : '@' + channelInfo.name}`}
          disabled={sendMessageMutation.isPending}
          onShareKnowledge={handleShareKnowledge}
        />

        <NewTaskModal
          open={Boolean(taskModalContext)}
          onOpenChange={(open) => {
            if (!open) {
              setTaskModalContext(null);
            }
          }}
          onTaskCreate={handleTaskCreate}
          messageContent={taskModalContext?.content}
          relatedChatId={taskModalContext?.channelId}
        />

        <CreateKnowledgeModal
          isOpen={Boolean(knowledgeModalContext)}
          onClose={() => setKnowledgeModalContext(null)}
          onCreateKnowledge={handleKnowledgeCreate}
          messageContent={knowledgeModalContext?.content}
          messageAuthor={knowledgeModalContext?.authorName}
          relatedChatId={knowledgeModalContext?.channelId}
        />
      </div>

      {/* Thread UI - conditionally rendered side by side */}
      {selectedThread && (
        <div className="w-96">
          <ChatThread
            parentMessage={{
              id: selectedThread,
              userId: messages.find(m => m.id === selectedThread)?.userId || "",
              userName: messages.find(m => m.id === selectedThread)?.userName || "",
              content: messages.find(m => m.id === selectedThread)?.content || "",
              timestamp: messages.find(m => m.id === selectedThread)?.timestamp || new Date(),
            }}
            threadMessages={threadMessages}
            onClose={handleCloseThread}
            onSendReply={handleSendThreadReply}
            isLoading={isLoadingThread}
          />
        </div>
      )}
    </div>
  );
}
