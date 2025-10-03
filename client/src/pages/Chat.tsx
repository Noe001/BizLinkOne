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
import { cn } from "@/lib/utils";
import { matchFaq, type FaqEntry } from "@/data/faqs";
import type { ChatMessage as ChatMessageType } from "@shared/schema";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { MessageModalContext } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspaceData } from "@/contexts/WorkspaceDataContext";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();

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

  const activeThreadParent = selectedThread
    ? messages.find(m => m.id === selectedThread)
    : undefined;

  return (
    <div
      className={cn(
        "flex h-full rounded-md bg-background",
        isMobile && "flex-col rounded-none bg-transparent"
      )}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col rounded-lg border border-card-border bg-card",
          selectedThread ? "lg:mr-2" : "w-full",
          isMobile && "border-0 rounded-none shadow-none"
        )}
        data-testid="page-chat"
      >
        <div
          className={cn(
            "border-b border-card-border bg-card p-4",
            isMobile && "sticky top-0 z-20 bg-card/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-card/80"
          )}
        >
          <div
            className={cn(
              "flex flex-wrap items-start justify-between gap-4",
              isMobile && "flex-col"
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex items-start gap-2">
                {channelInfo.isChannel ? (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Hash className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
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

            <div
              className={cn(
                "flex flex-1 items-center justify-end gap-3",
                isMobile && "w-full flex-col items-stretch gap-3"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2",
                  isMobile && "justify-end gap-3"
                )}
              >
                <Button
                  variant="ghost"
                  size={isMobile ? "icon" : "sm"}
                  className={cn(
                    "px-2",
                    isMobile && "h-10 w-10 rounded-full border border-card-border/70 bg-card/60"
                  )}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size={isMobile ? "icon" : "sm"}
                  className={cn(
                    "px-2",
                    isMobile && "h-10 w-10 rounded-full border border-card-border/70 bg-card/60"
                  )}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size={isMobile ? "icon" : "sm"}
                  className={cn(
                    "px-2",
                    isMobile && "h-10 w-10 rounded-full border border-card-border/70 bg-card/60"
                  )}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <div
                className={cn(
                  "flex items-center gap-1 ml-4",
                  isMobile && "ml-0 overflow-x-auto rounded-full border border-card-border/70 bg-card/60 px-2 py-1 [-ms-overflow-style:none] [scrollbar-width:none]"
                )}
              >
                <Button
                  variant={showUnreadOnly ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className={cn(
                    "text-xs",
                    isMobile && "min-w-[6.5rem] justify-center"
                  )}
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
                  className={cn(
                    "text-xs",
                    isMobile && "min-w-[6.5rem] justify-center"
                  )}
                >
                  Threads only
                  {messages.filter(m => m.threadCount).length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                      {messages.filter(m => m.threadCount).length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-card" data-testid="messages-container">
          <div className="py-2 px-3 sm:px-4">
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

      {/* Thread UI */}
      {selectedThread && (
        <ChatThread
          parentMessage={{
            id: selectedThread,
            userId: activeThreadParent?.userId ?? "",
            userName: activeThreadParent?.userName ?? "",
            content: activeThreadParent?.content ?? "",
            timestamp: activeThreadParent?.timestamp ?? new Date(),
          }}
          threadMessages={threadMessages}
          onClose={handleCloseThread}
          onSendReply={handleSendThreadReply}
          isLoading={isLoadingThread}
          className={cn(
            isMobile
              ? "mt-4 w-full max-h-[60vh] border-t border-card-border rounded-t-lg shadow-none"
              : "w-96 border-l border-card-border shadow-lg"
          )}
        />
      )}
    </div>
  );
}





