import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, MoreHorizontal } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "@/contexts/LanguageContext";

interface ThreadMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  isOwn?: boolean;
}

interface ChatThreadProps {
  parentMessage: {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    timestamp: Date;
  };
  threadMessages: ThreadMessage[];
  onClose: () => void;
  onSendReply: (content: string) => void;
  isLoading?: boolean;
}

export function ChatThread({ 
  parentMessage, 
  threadMessages, 
  onClose, 
  onSendReply, 
  isLoading = false 
}: ChatThreadProps) {
  const { t } = useTranslation();
  // Use shared ChatInput for reply behaviour to match main input

  return (
    <div className="w-96 bg-card border-l border-card-border shadow-lg flex flex-col h-full">
      {/* Thread Header */}
      <div className="flex items-center justify-between p-4 border-b border-card-border">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Thread</h3>
          <Badge variant="secondary" className="text-xs">
            {threadMessages.length} {threadMessages.length === 1 ? 'reply' : 'replies'}
          </Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8"
          data-testid="button-close-thread"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Parent Message */}
      <div className="p-4 border-b border-card-border bg-accent/10">
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={parentMessage.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${parentMessage.userName}`} />
            <AvatarFallback className="text-xs">
              {parentMessage.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-sm">{parentMessage.userName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(parentMessage.timestamp, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-foreground">{parentMessage.content}</p>
          </div>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {threadMessages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No replies yet. Be the first to reply!
          </div>
        ) : (
          threadMessages.map((message) => (
            <div key={message.id} className="flex gap-3 group">
              <Avatar className="w-8 h-8 flex-shrink-0 mt-0.5">
                <AvatarImage src={message.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${message.userName}`} />
                <AvatarFallback className="text-xs">
                  {message.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                  {message.isOwn && <Badge variant="outline" className="text-xs">You</Badge>}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-50 group-hover:opacity-100 hover:bg-accent transition-all duration-150 ml-auto"
                    aria-label={t("chat.message.actions.messageActions")}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Input - shared ChatInput for parity with main input */}
      <div className="border-t border-card-border">
        <ChatInput
          onSendMessage={(content) => onSendReply(content)}
          placeholder="Reply to thread..."
          disabled={isLoading}
          showShortcut={false}
        />
      </div>
    </div>
  );
}
