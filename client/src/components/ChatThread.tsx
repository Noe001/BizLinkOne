import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, MoreHorizontal } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
  onSendReply: (content: string, file?: File | null) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export function ChatThread({
  parentMessage,
  threadMessages,
  onClose,
  onSendReply,
  isLoading = false,
  className,
}: ChatThreadProps) {
  const { t } = useTranslation();

  const containerClassName = cn(
    "flex h-full flex-col bg-card",
    className ?? "w-96 border-l border-card-border shadow-lg"
  );

  return (
    <div className={containerClassName}>
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-card-border p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Thread</h3>
          <Badge variant="secondary" className="text-xs">
            {threadMessages.length} {threadMessages.length === 1 ? "reply" : "replies"}
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
      <div className="border-b border-card-border bg-accent/10 p-3 sm:p-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={parentMessage.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${parentMessage.userName}`} />
            <AvatarFallback className="text-xs">
              {parentMessage.userName.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold">{parentMessage.userName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(parentMessage.timestamp, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-foreground">{parentMessage.content}</p>
          </div>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4">
        {threadMessages.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No replies yet. Be the first to reply!
          </div>
        ) : (
          threadMessages.map((message) => (
            <div key={message.id} className="group flex gap-3">
              <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                <AvatarImage src={message.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${message.userName}`} />
                <AvatarFallback className="text-xs">
                  {message.userName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                  {message.isOwn && <Badge variant="outline" className="text-xs">You</Badge>}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto h-6 w-6 opacity-50 transition-all duration-150 hover:bg-accent group-hover:opacity-100"
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
      <div className="border-t border-card-border bg-card/95">
        <ChatInput
          onSendMessage={onSendReply}
          placeholder="Reply to thread..."
          disabled={isLoading}
          showShortcut={false}
        />
      </div>
    </div>
  );
}
