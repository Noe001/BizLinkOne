import { KNOWLEDGE_ROUTE_BASE } from "@/constants/commands";
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
import { matchFaq, type FaqEntry } from "@/data/faqs";
import type { ChatMessage as ChatMessageType } from "@shared/schema";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { MessageModalContext } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspaceData } from "@/contexts/WorkspaceDataContext";
import { toast } from "@/hooks/use-toast";

interface ChannelInfo {
  name: string;
  description: string;
  memberCount: number;
  isChannel: boolean;
}

interface DisplayMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  channelId: string | null;
  timestamp: Date;
  isOwn: boolean;
  isUnread: boolean;
  threadCount?: number;
  lastThreadReply?: Date;
  isFirstUnread?: boolean;
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
  const { user } = useAuth();
  const currentUserId = user?.id ?? "user-1";
  const currentUserName = user?.name ?? "You";
  const { createTask: createWorkspaceTask, createKnowledge: createWorkspaceKnowledge } = useWorkspaceData();

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
    unreadCutoffRef.current = new Date(Date.now() - 30 * 60 * 1000);
  }, [channelId]);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unreadCutoffRef = useRef<Date>(new Date(Date.now() - 30 * 60 * 1000));
  
  const messagesQueryKey = useMemo(() => {
    if (isChannelContext) {
      return ["chatMessages", "channel", channelId ?? "general"];
    }
    return ["chatMessages", "conversation", contextId];
  }, [isChannelContext, channelId, contextId]);

  const { data: rawMessages = [], isLoading: isLoadingMessages, isError: isMessagesError } = useQuery<ChatMessageType[]>({
    queryKey: messagesQueryKey,
    queryFn: async () => {
      const querySuffix = isChannelContext && channelId ? `?channelId=${channelId}` : "";
      const response = await fetch(`/api/messages${querySuffix}`, { credentials: "include" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      return (await response.json()) as ChatMessageType[];
    },
  });

  const messages = useMemo<DisplayMessage[]>(() => {
    const unreadCutoff = unreadCutoffRef.current;
    return rawMessages
      .map((message): DisplayMessage => {
        const timestamp = new Date(message.timestamp);
        const isOwn = message.userId === currentUserId;
        const isUnread = !isOwn && timestamp > unreadCutoff;
        return {
          id: message.id,
          userId: message.userId,
          userName: message.userName,
          content: message.content,
          channelId: message.channelId ?? null,
          timestamp,
          isOwn,
          isUnread,
          threadCount: 0,
        };
      })
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [rawMessages, currentUserId]);

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        content,
        userId: currentUserId,
        userName: currentUserName,
        channelId: channelId ?? null,
        channelType: isChannelContext ? "channel" : "dm"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: unknown) => {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast({
        title: "Failed to send message",
        description,
        variant: "destructive",
      });
    },
  });
  
  const handleFaqResponse = useCallback(async (faq: FaqEntry) => {
    const responseContent = `FAQ Answer: ${faq.question}

${faq.answer}` +
      (faq.relatedKnowledgeId ? `

Knowledge: ${KNOWLEDGE_ROUTE_BASE}/${faq.relatedKnowledgeId}` : "");
    try {
      await apiRequest("POST", "/api/messages", {
        content: responseContent,
        userId: "biz-assistant",
        userName: "Biz Assistant",
        channelId: channelId ?? null,
        channelType: isChannelContext ? "channel" : "dm",
      });
      toast({
        title: "Shared quick answer",
        description: faq.question,
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Failed to share FAQ",
        description,
        variant: "destructive",
      });
    }
  }, [channelId, isChannelContext, toast]);

  const handleSendMessage = (content: string) => {
    const faqMatch = matchFaq(content);
    sendMessageMutation.mutate(content, {
      onSuccess: () => {
        if (faqMatch) {
          handleFaqResponse(faqMatch);
        }
      },
    });
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
      channelId: message.channelId ?? undefined,
    });
  };

  const handleTaskCreate = (taskData: NewTaskData) => {
    if (!taskModalContext) {
      return;
    }

    createWorkspaceTask({
      ...taskData,
      origin: {
        source: "chat",
        referenceId: taskModalContext.messageId,
        referenceLabel: channelInfo.name,
      },
      messageContext: {
        messageId: taskModalContext.messageId,
        content: taskModalContext.content,
        authorName: taskModalContext.authorName,
      },
    });

    toast({
      title: "Task created",
      description: `Converted message into task "${taskData.title}"`,
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
      channelId: message.channelId ?? undefined,
    });
  };

  const handleKnowledgeCreate = (knowledgeData: CreateKnowledgeData) => {
    if (!knowledgeModalContext) {
      return;
    }

    createWorkspaceKnowledge({
      ...knowledgeData,
      authorId: currentUserId,
      authorName: currentUserName,
      source: "chat",
    });

    toast({
      title: "Knowledge published",
      description: `Saved "${knowledgeData.title}" to the knowledge base`,
    });
    setKnowledgeModalContext(null);
  };

  const handleReply = (messageId: string) => {
    setSelectedThread(messageId);
    loadThreadMessages(messageId);
  };

  const handleViewThread = (messageId: string) => {
    setSelectedThread(messageId);
    loadThreadMessages(messageId);
  };

  const handleShareKnowledge = async (knowledgeId: string, title: string, summary: string) => {
    const message = `Knowledge share: ${title}

${summary}

${KNOWLEDGE_ROUTE_BASE}/${knowledgeId}`;
    try {
      await apiRequest("POST", "/api/messages", {
        content: message,
        userId: currentUserId,
        userName: currentUserName,
        channelId: channelId ?? null,
        channelType: isChannelContext ? "channel" : "dm",
      });
      toast({
        title: "Article shared",
        description: `Posted "${title}" to this chat`,
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Failed to share article",
        description,
        variant: "destructive",
      });
    }
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
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-pulse" />
                  <div className="text-muted-foreground">Loading messages...</div>
                </div>
              </div>
            ) : isMessagesError ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <div className="text-muted-foreground">Failed to load messages.</div>
                </div>
              </div>
            ) : messagesWithUnreadMarker.length === 0 ? (
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
                  channelId={message.channelId ?? channelId}
                  isOwn={message.isOwn}
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





