import { KNOWLEDGE_ROUTE_BASE } from "@/constants/commands";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Hash, Users, Phone, Video, Settings, MessageSquare, Wifi, WifiOff } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatThread } from "@/components/ChatThread";
import { NewTaskModal, type NewTaskData } from "@/components/NewTaskModal";
import { CreateKnowledgeModal, type CreateKnowledgeData } from "@/components/CreateKnowledgeModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { matchFaq, type FaqEntry } from "@/data/faqs";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type {
  MessageModalContext,
  ChatMessagesResponse,
  ChatMessageWithExtrasDto,
  ChatAttachmentDto,
  ChatReactionSummaryDto,
  ChatReadReceiptDto,
} from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspaceData } from "@/contexts/WorkspaceDataContext";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useOnlinePresence } from "@/hooks/useOnlinePresence";
import { isSupabaseConfigured } from "@/lib/supabase";
import { uploadChatAttachment } from "@/lib/chatAttachments";
import { useTranslation } from "@/contexts/LanguageContext";

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
  isPending?: boolean; // 送信中フラグ
  threadCount?: number;
  lastThreadReply?: Date;
  isFirstUnread?: boolean;
  attachments: ChatAttachmentDto[];
  reactions: (ChatReactionSummaryDto & { hasReacted: boolean })[];
}

type SendMessageContext = {
  channelQueryKey?: QueryKey;
  aggregatedQueryKey?: QueryKey;
  previousChannelTimeline?: ChatMessagesResponse;
  previousAggregatedTimeline?: ChatMessagesResponse;
  optimisticId?: string;
};

type PendingAttachmentInput = {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
};

type SendMessageInput = {
  content: string;
  attachments: PendingAttachmentInput[];
};

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
  const { user, currentWorkspaceId } = useAuth();
  const currentUserId = user?.id ?? "user-1";
  const currentUserName = user?.name ?? "You";
  const { createTask: createWorkspaceTask, createKnowledge: createWorkspaceKnowledge } = useWorkspaceData();
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  // Support both channel and DM routes
  const [matchType, paramsType] = useRoute("/chat/:type/:id");
  const [matchChannel, paramsChannel] = useRoute("/chat/channel/:channelId");
  const contextType = matchType ? (paramsType as any).type : (matchChannel ? "channel" : "channel");
  const contextId = matchType ? (paramsType as any).id : (paramsChannel as any)?.channelId || "general";
  const isChannelContext = contextType === "channel";
  const channelId = isChannelContext ? contextId : undefined;
  
  // Realtime 機能を有効化（Supabase が設定されている場合のみ）
  const realtimeEnabled = isSupabaseConfigured();
  
  // Realtime メッセージ購読
  const { isConnected: isRealtimeConnected, error: realtimeError } = useRealtimeMessages({ 
    channelId: channelId || "general",
    enabled: realtimeEnabled && isChannelContext,
  });
  
  // オンラインプレゼンス追跡
  const { onlineUsers, isConnected: isPresenceConnected } = useOnlinePresence(currentWorkspaceId);
  
  // Local state for filtering
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showThreadsOnly, setShowThreadsOnly] = useState(false);
  
  // Thread state
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);

  const [taskModalContext, setTaskModalContext] = useState<MessageModalContext | null>(null);
  const [knowledgeModalContext, setKnowledgeModalContext] = useState<MessageModalContext | null>(null);
  
  // Realtime エラーハンドリング
  useEffect(() => {
    if (realtimeError) {
      console.error("Realtime error:", realtimeError);
      toast({
        title: "Connection issue",
        description: "Failed to connect to realtime updates. Messages may not appear instantly.",
        variant: "destructive",
      });
    }
  }, [realtimeError]);
  
  // Close thread when switching channels
  useEffect(() => {
    if (selectedThread) {
      setSelectedThread(null);
      setThreadMessages([]);
    }
  }, [channelId]);

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messagesQueryKey = useMemo(() => {
    if (!currentWorkspaceId) {
      return null;
    }
    if (isChannelContext) {
      return ["chatMessages", currentWorkspaceId, "channel", channelId ?? "general"] as const;
    }
    return ["chatMessages", currentWorkspaceId, "conversation", contextId] as const;
  }, [currentWorkspaceId, isChannelContext, channelId, contextId]);

  const aggregatedMessagesQueryKey = useMemo(() => {
    return currentWorkspaceId ? (["/api/messages", currentWorkspaceId] as const) : null;
  }, [currentWorkspaceId]);

  const { data: timeline, isLoading: isLoadingMessages, isError: isMessagesError } = useQuery<ChatMessagesResponse>({
    queryKey: messagesQueryKey ?? ["chatMessages", "unscoped"],
    enabled: Boolean(messagesQueryKey && currentWorkspaceId),
    queryFn: async () => {
      if (!currentWorkspaceId) {
        return { messages: [], unreadCount: 0, readReceipt: null } satisfies ChatMessagesResponse;
      }
      const params = new URLSearchParams({ workspaceId: currentWorkspaceId, userId: currentUserId });
      if (isChannelContext && channelId) {
        params.set("channelId", channelId);
      }
      const response = await fetch(`/api/messages?${params.toString()}`, { credentials: "include" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      return (await response.json()) as ChatMessagesResponse;
    },
  });

  const rawMessages = useMemo<ChatMessageWithExtrasDto[]>(() => timeline?.messages ?? [], [timeline]);
  const readReceipt = timeline?.readReceipt ?? null;
  const unreadCount = timeline?.unreadCount ?? 0;

  const updateMessageReactions = useCallback((messageId: string, reactions: ChatReactionSummaryDto[]) => {
    if (messagesQueryKey) {
      queryClient.setQueryData<ChatMessagesResponse>(messagesQueryKey, (old) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          messages: old.messages.map((message) =>
            message.id === messageId ? { ...message, reactions } : message
          ),
        };
      });
    }
    if (aggregatedMessagesQueryKey) {
      queryClient.setQueryData<ChatMessagesResponse>(aggregatedMessagesQueryKey, (old) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          messages: old.messages.map((message) =>
            message.id === messageId ? { ...message, reactions } : message
          ),
        };
      });
    }
  }, [messagesQueryKey, aggregatedMessagesQueryKey]);

  const messages = useMemo<DisplayMessage[]>(() => {
    const lastReadAt = readReceipt?.lastReadAt ? new Date(readReceipt.lastReadAt) : null;
    return rawMessages
      .map((message): DisplayMessage => {
        let timestamp: Date;
        try {
          timestamp = message.createdAt instanceof Date
            ? message.createdAt
            : new Date(message.createdAt);

          if (isNaN(timestamp.getTime())) {
            console.warn('Invalid timestamp for message:', message.id, message.createdAt);
            timestamp = new Date();
          }
        } catch (error) {
          console.error('Error parsing timestamp:', error);
          timestamp = new Date();
        }

        const isOwn = message.userId === currentUserId;
        const isUnread = !isOwn && (!lastReadAt || timestamp > lastReadAt);

        const attachments: ChatAttachmentDto[] = (message.attachments ?? []).map((attachment) => ({
          ...attachment,
          uploadedAt: attachment.uploadedAt ?? new Date(),
        }));

        const reactions = (message.reactions ?? []).map((reaction) => ({
          ...reaction,
          hasReacted: reaction.userIds.includes(currentUserId),
        }));

        return {
          id: message.id,
          userId: message.userId,
          userName: message.userName,
          content: message.content,
          channelId: message.channelId ?? null,
          timestamp,
          isOwn,
          isUnread,
          isPending: (message as any).isPending || false,
          threadCount: 0,
          attachments,
          reactions,
        };
      })
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [rawMessages, currentUserId, readReceipt]);

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

  const { mutate: markRead, isPending: isMarkingRead } = useMutation<void, unknown, { messageId: string; timestamp: Date }>({
    mutationFn: async ({ messageId, timestamp }) => {
      const workspaceId = currentWorkspaceId;
      const activeChannelId = channelId;
      if (!activeChannelId || !workspaceId) {
        return;
      }
      await apiRequest("POST", "/api/messages/read-receipts", {
        workspaceId,
        userId: currentUserId,
        channelId: activeChannelId,
        lastReadMessageId: messageId,
        lastReadAt: timestamp,
      });
    },
    onSuccess: (_data, variables) => {
      if (!currentWorkspaceId || !channelId) {
        return;
      }
      if (messagesQueryKey) {
        queryClient.setQueryData<ChatMessagesResponse>(messagesQueryKey, (old) => {
          if (!old) {
            return old;
          }
          const updatedReceipt: ChatReadReceiptDto = {
            id: old.readReceipt?.id ?? `temp-${currentUserId}-${channelId}`,
            workspaceId: currentWorkspaceId,
            userId: currentUserId,
            channelId: channelId ?? "",
            lastReadMessageId: variables.messageId,
            lastReadAt: variables.timestamp,
          };
          return {
            ...old,
            readReceipt: updatedReceipt,
            unreadCount: 0,
          };
        });
      }

      if (aggregatedMessagesQueryKey) {
        queryClient.setQueryData<ChatMessagesResponse>(aggregatedMessagesQueryKey, (old) => {
          if (!old) {
            return old;
          }
          const updatedReceipt: ChatReadReceiptDto = {
            id: old.readReceipt?.id ?? `temp-${currentUserId}-${channelId}`,
            workspaceId: currentWorkspaceId,
            userId: currentUserId,
            channelId: channelId ?? "",
            lastReadMessageId: variables.messageId,
            lastReadAt: variables.timestamp,
          };
          return {
            ...old,
            readReceipt: updatedReceipt,
            unreadCount: 0,
          };
        });
      }
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (!channelId || !currentWorkspaceId || rawMessages.length === 0) {
      return;
    }
    const lastMessage = rawMessages[rawMessages.length - 1];
    const timestamp = lastMessage.createdAt instanceof Date
      ? lastMessage.createdAt
      : new Date(lastMessage.createdAt);
    const lastReadAtTime = readReceipt?.lastReadAt ? new Date(readReceipt.lastReadAt).getTime() : 0;

    if (!isNaN(timestamp.getTime()) && timestamp.getTime() > lastReadAtTime && !isMarkingRead) {
      markRead({ messageId: lastMessage.id, timestamp });
    }
  }, [rawMessages, readReceipt, channelId, currentWorkspaceId, markRead, isMarkingRead]);

  // Send message mutation
  const sendMessageMutation = useMutation<ChatMessageWithExtrasDto, unknown, SendMessageInput, SendMessageContext>({
    mutationFn: async ({ content, attachments }) => {
      if (!currentWorkspaceId) {
        throw new Error("Workspace ID is required");
      }
      if (!channelId) {
        throw new Error("Channel ID is required");
      }

      const response = await apiRequest("POST", "/api/messages", {
        workspaceId: currentWorkspaceId,
        channelId,
        content,
        userId: currentUserId,
        userName: currentUserName,
        attachments,
      });

      return (await response.json()) as ChatMessageWithExtrasDto;
    },
    onMutate: async ({ content, attachments }) => {
      if (!messagesQueryKey || !aggregatedMessagesQueryKey || !currentWorkspaceId || !channelId) {
        return {};
      }

      const channelQueryKey = messagesQueryKey;
      const aggregatedQueryKey = aggregatedMessagesQueryKey;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: channelQueryKey }),
        queryClient.cancelQueries({ queryKey: aggregatedQueryKey }),
      ]);

      const previousChannelTimeline = queryClient.getQueryData<ChatMessagesResponse>(channelQueryKey);
      const previousAggregatedTimeline = queryClient.getQueryData<ChatMessagesResponse>(aggregatedQueryKey);

      const optimisticId = `temp-${Date.now()}`;
      const createdAt = new Date();

      const optimisticMessage: ChatMessageWithExtrasDto = {
        id: optimisticId,
        workspaceId: currentWorkspaceId,
        channelId,
        userId: currentUserId,
        userName: currentUserName,
        content,
        createdAt,
        parentMessageId: null,
        editedAt: null,
        deletedAt: null,
        attachments: attachments.map((attachment, index) => ({
          id: `temp-attachment-${optimisticId}-${index}`,
          messageId: optimisticId,
          fileName: attachment.fileName,
          fileUrl: attachment.fileUrl,
          fileSize: attachment.fileSize,
          mimeType: attachment.mimeType,
          uploadedAt: createdAt,
        })),
        reactions: [],
      };

      queryClient.setQueryData<ChatMessagesResponse>(channelQueryKey, (old) => {
        const base = old ?? { messages: [], unreadCount: timeline?.unreadCount ?? 0, readReceipt: readReceipt ?? null };
        return {
          ...base,
          messages: [...base.messages, { ...optimisticMessage, isPending: true } as ChatMessageWithExtrasDto],
        };
      });

      queryClient.setQueryData<ChatMessagesResponse>(aggregatedQueryKey, (old) => {
        const base = old ?? { messages: [], unreadCount: 0, readReceipt: null };
        return {
          ...base,
          messages: [...base.messages, { ...optimisticMessage, isPending: true } as ChatMessageWithExtrasDto],
        };
      });

      return {
        channelQueryKey,
        aggregatedQueryKey,
        previousChannelTimeline,
        previousAggregatedTimeline,
        optimisticId,
      };
    },
    onError: (error, _variables, context) => {
      const channelQueryKey = context?.channelQueryKey;
      const aggregatedQueryKey = context?.aggregatedQueryKey;

      if (channelQueryKey && context?.previousChannelTimeline) {
        queryClient.setQueryData(channelQueryKey, context.previousChannelTimeline);
      }
      if (aggregatedQueryKey && context?.previousAggregatedTimeline) {
        queryClient.setQueryData(aggregatedQueryKey, context.previousAggregatedTimeline);
      }

      const description = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Failed to send message",
        description,
        variant: "destructive",
      });
    },
    onSuccess: (savedMessage, _variables, context) => {
      const channelQueryKey = context?.channelQueryKey;
      const aggregatedQueryKey = context?.aggregatedQueryKey;

      if (channelQueryKey) {
        queryClient.setQueryData<ChatMessagesResponse>(channelQueryKey, (old) => {
          if (!old) {
            return old;
          }
          const updatedMessages = old.messages.some((message) => message.id === context?.optimisticId)
            ? old.messages.map((message) =>
                message.id === context?.optimisticId
                  ? { ...savedMessage }
                  : message,
              )
            : [...old.messages, savedMessage];

          return {
            ...old,
            messages: updatedMessages,
          };
        });
      }

      if (aggregatedQueryKey) {
        queryClient.setQueryData<ChatMessagesResponse>(aggregatedQueryKey, (old) => {
          if (!old) {
            return old;
          }
          const updatedMessages = old.messages.some((message) => message.id === context?.optimisticId)
            ? old.messages.map((message) =>
                message.id === context?.optimisticId
                  ? { ...savedMessage }
                  : message,
              )
            : [...old.messages, savedMessage];

          return {
            ...old,
            messages: updatedMessages,
          };
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const addReactionMutation = useMutation<ChatReactionSummaryDto[], unknown, { messageId: string; emoji: string }>({
    mutationFn: async ({ messageId, emoji }) => {
      if (!currentWorkspaceId || !channelId) {
        throw new Error("Workspace and channel are required");
      }
      const response = await apiRequest("POST", `/api/messages/${messageId}/reactions`, {
        workspaceId: currentWorkspaceId,
        channelId,
        userId: currentUserId,
        emoji,
      });
      return (await response.json()) as ChatReactionSummaryDto[];
    },
    onSuccess: (reactions, variables) => {
      updateMessageReactions(variables.messageId, reactions);
    },
    onError: (error) => {
      const description = error instanceof Error ? error.message : t("chat.message.tryAgain");
      toast({
        title: t("chat.message.reactionFailed"),
        description,
        variant: "destructive",
      });
    },
  });

  const removeReactionMutation = useMutation<ChatReactionSummaryDto[], unknown, { messageId: string; emoji: string }>({
    mutationFn: async ({ messageId, emoji }) => {
      const params = new URLSearchParams({ userId: currentUserId, emoji });
      const response = await fetch(`/api/messages/${messageId}/reactions?${params.toString()}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      return (await response.json()) as ChatReactionSummaryDto[];
    },
    onSuccess: (reactions, variables) => {
      updateMessageReactions(variables.messageId, reactions);
    },
    onError: (error) => {
      const description = error instanceof Error ? error.message : t("chat.message.tryAgain");
      toast({
        title: t("chat.message.reactionFailed"),
        description,
        variant: "destructive",
      });
    },
  });

  const handleFaqResponse = useCallback(async (faq: FaqEntry) => {
    const workspaceId = currentWorkspaceId;
    const activeChannelId = channelId;
    if (!workspaceId || !activeChannelId) {
      console.error("Missing workspace or channel ID");
      return;
    }

    const responseContent = `FAQ Answer: ${faq.question}

${faq.answer}` +
      (faq.relatedKnowledgeId ? `

Knowledge: ${KNOWLEDGE_ROUTE_BASE}/${faq.relatedKnowledgeId}` : "");
    try {
      await apiRequest("POST", "/api/messages", {
        workspaceId,
        channelId: activeChannelId,
        content: responseContent,
        userId: "biz-assistant",
        userName: "Biz Assistant",
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
  }, [currentWorkspaceId, channelId, toast]);

  const handleSendMessage = async (content: string, file?: File | null) => {
    const workspaceId = currentWorkspaceId;
    const activeChannelId = channelId;
    if (!workspaceId || !activeChannelId) {
      toast({
        title: t("chat.message.sendError"),
        description: t("chat.message.selectWorkspace"),
        variant: "destructive",
      });
      return;
    }

    const trimmedContent = content.trim();
    const faqMatch = trimmedContent ? matchFaq(trimmedContent) : null;
    const attachments: PendingAttachmentInput[] = [];

    if (file) {
      try {
        const uploaded = await uploadChatAttachment(file, {
          workspaceId,
          channelId: activeChannelId,
        });
        attachments.push(uploaded);
      } catch (error) {
        const description = error instanceof Error ? error.message : t("chat.message.tryAgain");
        toast({
          title: t("chat.message.attachmentUploadFailed"),
          description,
          variant: "destructive",
        });
        return;
      }
    }

    const messageContent = trimmedContent || t("chat.message.attachmentPlaceholder");

    try {
      await sendMessageMutation.mutateAsync({
        content: messageContent,
        attachments,
      });

      if (faqMatch) {
        await handleFaqResponse(faqMatch);
      }
    } catch (error) {
      // エラーハンドリングはmutation内で実施
    }
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

  const handleAddReaction = (messageId: string, emoji: string) => {
    addReactionMutation.mutate({ messageId, emoji });
  };

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    removeReactionMutation.mutate({ messageId, emoji });
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
    const workspaceId = currentWorkspaceId;
    if (!workspaceId) {
      toast({
        title: "Unable to share",
        description: "Select a workspace and try again.",
        variant: "destructive",
      });
      return;
    }

    const message = `Knowledge share: ${title}

${summary}

${KNOWLEDGE_ROUTE_BASE}/${knowledgeId}`;
    try {
      await apiRequest("POST", "/api/messages", {
        workspaceId,
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

  const handleSendThreadReply = async (content: string, file?: File | null) => {
    if (!selectedThread) return;

    const formattedContent = file ? `${content}\n\n(Attached file: ${file.name})` : content;

    // Mock sending thread reply - in real app, this would be an API call
    const newReply = {
      id: `thread-${selectedThread}-${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      content: formattedContent,
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{channelInfo.memberCount} members</span>
                        {realtimeEnabled && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {isRealtimeConnected ? (
                                <>
                                  <Wifi className="h-3 w-3 text-green-500" />
                                  <span className="text-green-600 dark:text-green-400">Live</span>
                                </>
                              ) : (
                                <>
                                  <WifiOff className="h-3 w-3 text-yellow-500" />
                                  <span className="text-yellow-600 dark:text-yellow-400">Offline</span>
                                </>
                              )}
                            </span>
                            {onlineUsers.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 dark:text-green-400">
                                  {onlineUsers.length} online
                                </span>
                              </>
                            )}
                          </>
                        )}
                        <span>•</span>
                        <span>{channelInfo.description}</span>
                      </div>
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Direct message</span>
                        <span>•</span>
                        <span>{channelInfo.memberCount} participants</span>
                        {realtimeEnabled && onlineUsers.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 dark:text-green-400">
                              {onlineUsers.length} online
                            </span>
                          </>
                        )}
                      </div>
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
                  {t("chat.filters.unreadOnly")}
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                      {unreadCount}
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
                  {t("chat.filters.threadsOnly")}
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
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                  disableReactions={addReactionMutation.isPending || removeReactionMutation.isPending}
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





