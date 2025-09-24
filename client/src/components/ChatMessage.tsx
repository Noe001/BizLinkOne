import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, BookOpen, MoreHorizontal, Reply, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { NewTaskModal, NewTaskData } from "./NewTaskModal";
import { CreateKnowledgeModal, CreateKnowledgeData } from "./CreateKnowledgeModal";

interface ChatMessageProps {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  channelId?: string;
  isOwn?: boolean;
  isUnread?: boolean;
  isFirstUnread?: boolean;
  threadId?: string;
  threadCount?: number;
  lastThreadReply?: Date;
  canConvertToTask?: boolean;
  canConvertToKnowledge?: boolean;
  onConvertToTask?: (messageId: string) => void;
  onConvertToKnowledge?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onViewThread?: (messageId: string) => void;
}

export function ChatMessage(props: ChatMessageProps) {
  const {
    id,
    userId,
    userName,
    userAvatar,
    content,
    timestamp,
    isOwn = false,
    isUnread = false,
    isFirstUnread = false,
    threadId,
    threadCount = 0,
    lastThreadReply,
    canConvertToTask = true,
    canConvertToKnowledge = true,
    onConvertToTask,
    onConvertToKnowledge,
    onReply,
    onViewThread,
  } = props;

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);

  const handleConvertToTask = () => {
    setShowTaskModal(true);
  };

  const handleConvertToKnowledge = () => {
    setShowKnowledgeModal(true);
  };

  const handleTaskCreate = (taskData: NewTaskData) => {
    console.log("Creating task from message:", { messageId: id, taskData });
    onConvertToTask?.(id);
    // Here you would typically call an API to create the task
  };

  const handleKnowledgeCreate = (knowledgeData: CreateKnowledgeData) => {
    console.log("Creating knowledge from message:", { messageId: id, knowledgeData });
    onConvertToKnowledge?.(id);
    // Here you would typically call an API to create the knowledge article
  };

  const handleReply = () => {
    console.log(`Replying to message ${id}`);
    onReply?.(id);
  };

  const handleViewThread = () => {
    console.log(`Viewing thread for message ${id}`);
    onViewThread?.(id);
  };

  return (
    <>
      {isFirstUnread && (
        <div className="relative my-4 mx-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-red-500"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-sm font-medium text-red-500 uppercase tracking-wide">
              New Messages
            </span>
          </div>
        </div>
      )}

      <div 
        className={`group relative flex gap-3 p-2 mx-1 hover:bg-accent/20 rounded ${
          isUnread 
            ? 'bg-card border-b border-card-border' 
            : ''
        } ${isOwn ? 'flex-row-reverse' : ''}`} 
        data-testid={`message-${id}`}
      >
        <Avatar className="w-8 h-8 flex-shrink-0 mt-0.5">
          <AvatarImage src={userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
          <AvatarFallback className="text-xs font-medium">
            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className={`flex-1 min-w-0 ${isOwn ? 'text-right' : ''}`}>
          <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
            <span className="font-semibold text-sm text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
            {isOwn && <Badge variant="outline" className="text-xs">You</Badge>}

            {/* controls: align to far right for non-own, keep on right for own */}
            <div className={`${isOwn ? '' : 'ml-auto'} flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1`}>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleReply}
                data-testid={`button-reply-${id}`}
                className="h-8 px-4 rounded flex items-center gap-2 min-w-[88px] flex-shrink-0 whitespace-nowrap"
                title="Reply to message"
              >
                <Reply className="w-4 h-4" />
                <span className="text-xs text-muted-foreground hidden md:inline">Reply</span>
                {threadCount > 0 && (
                  <span className="text-xs font-medium text-muted-foreground ml-1">{threadCount}</span>
                )}
              </Button>

              {canConvertToTask && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleConvertToTask}
                  data-testid={`button-task-${id}`}
                  className="h-8 px-3 rounded flex items-center gap-2 min-w-[80px] flex-shrink-0 whitespace-nowrap"
                  title="Convert to task"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-xs text-muted-foreground hidden md:inline">Task</span>
                </Button>
              )}

              {canConvertToKnowledge && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleConvertToKnowledge}
                  data-testid={`button-knowledge-${id}`}
                  className="h-8 px-3 rounded flex items-center gap-2 min-w-[96px] flex-shrink-0 whitespace-nowrap"
                  title="Convert to knowledge"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs text-muted-foreground hidden md:inline">Knowledge</span>
                </Button>
              )}

              <Button
                size="icon"
                variant="ghost"
                data-testid={`button-more-${id}`}
                className="h-7 w-7"
                title="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className={`${isOwn ? 'text-right' : ''}`}>
            <p className="text-sm leading-relaxed text-foreground m-0">{content}</p>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <NewTaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        onTaskCreate={handleTaskCreate}
        messageContent={content}
        relatedChatId={props.channelId}
      />

      {/* Knowledge Creation Modal */}
      <CreateKnowledgeModal
        isOpen={showKnowledgeModal}
        onClose={() => setShowKnowledgeModal(false)}
        onCreateKnowledge={handleKnowledgeCreate}
        messageContent={content}
        messageAuthor={userName}
        relatedChatId={props.channelId}
      />
    </>
  );
}
