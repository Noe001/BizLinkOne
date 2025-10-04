import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CheckSquare, BookOpen, MoreHorizontal, Reply, Edit, Trash2, Copy, Pin, Flag, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "@/contexts/LanguageContext";

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
  isPending?: boolean; // 送信中フラグ
  threadId?: string;
  threadCount?: number;
  lastThreadReply?: Date;
  isPinned?: boolean;
  canConvertToTask?: boolean;
  canConvertToKnowledge?: boolean;
  onRequestTaskCreation?: (messageId: string) => void;
  onRequestKnowledgeCreation?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onViewThread?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onCopy?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onFlag?: (messageId: string) => void;
  onShare?: (messageId: string) => void;
}

export function ChatMessage(props: ChatMessageProps) {
  const { t } = useTranslation();
  const {
    id,
    userName,
    userAvatar,
    content,
    timestamp,
    isOwn = false,
    isUnread = false,
    isFirstUnread = false,
    isPending = false,
    threadCount = 0,
    isPinned = false,
    canConvertToTask = true,
    canConvertToKnowledge = true,
    onRequestTaskCreation,
    onRequestKnowledgeCreation,
    onReply,
    onViewThread,
    onEdit,
    onDelete,
    onCopy,
    onPin,
    onFlag,
    onShare,
  } = props;

  const handleConvertToTask = () => {
    onRequestTaskCreation?.(id);
  };

  const handleConvertToKnowledge = () => {
    onRequestKnowledgeCreation?.(id);
  };

  const handleReply = () => {
    onReply?.(id);
  };

  const handleViewThread = () => {
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
        className={`group flex gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3 hover:bg-accent/50 transition-colors touch-manipulation ${
          isUnread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
        } ${isPinned ? "bg-amber-50/30 dark:bg-amber-950/10" : ""} ${
          isPending ? "opacity-60" : ""
        }`}
        data-testid={`chat-message-${id}`}
        role="article"
        aria-label={`Message from ${userName}`}
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
              {isPending ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">送信中</span>
                  <span className="animate-spin inline-block h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                </span>
              ) : (
                formatDistanceToNow(timestamp, { addSuffix: true })
              )}
            </span>
            {isOwn && <Badge variant="outline" className="text-xs">You</Badge>}

            {/* controls: align to far right for non-own, keep on right for own */}
            <div className={`${isOwn ? '' : 'ml-auto'} flex items-center opacity-40 group-hover:opacity-100 transition-all duration-150 gap-1`}>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleReply}
                data-testid={`button-reply-${id}`}
                className="h-8 px-4 rounded flex items-center gap-2 min-w-[88px] flex-shrink-0 whitespace-nowrap"
                title={t("chat.message.actions.reply")}
              >
                <Reply className="w-4 h-4" />
                <span className="text-xs text-muted-foreground hidden md:inline">{t("chat.message.actions.reply")}</span>
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
                  title={t("chat.message.actions.task")}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-xs text-muted-foreground hidden md:inline">{t("chat.message.actions.task")}</span>
                </Button>
              )}

              {canConvertToKnowledge && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleConvertToKnowledge}
                  data-testid={`button-knowledge-${id}`}
                  className="h-8 px-3 rounded flex items-center gap-2 min-w-[96px] flex-shrink-0 whitespace-nowrap"
                  title={t("chat.message.actions.knowledge")}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs text-muted-foreground hidden md:inline">{t("chat.message.actions.knowledge")}</span>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid={`button-more-${id}`}
                    className="h-7 w-7"
                    title={t("chat.message.actions.more")}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isOwn && onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>{t("chat.message.actions.edit")}</span>
                    </DropdownMenuItem>
                  )}
                  {onCopy && (
                    <DropdownMenuItem onClick={() => onCopy(id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>{t("chat.message.actions.copy")}</span>
                    </DropdownMenuItem>
                  )}
                  {onPin && (
                    <DropdownMenuItem onClick={() => onPin(id)}>
                      <Pin className={`mr-2 h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
                      <span>{isPinned ? t("chat.message.actions.unpin") : t("chat.message.actions.pin")}</span>
                    </DropdownMenuItem>
                  )}
                  {onShare && (
                    <DropdownMenuItem onClick={() => onShare(id)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>{t("chat.message.actions.share")}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onFlag && (
                    <DropdownMenuItem onClick={() => onFlag(id)}>
                      <Flag className="mr-2 h-4 w-4" />
                      <span>{t("chat.message.actions.flag")}</span>
                    </DropdownMenuItem>
                  )}
                  {isOwn && onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{t("chat.message.actions.delete")}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className={`${isOwn ? 'text-right' : ''}`}>
            <p className="text-sm leading-relaxed text-foreground m-0">{content}</p>
          </div>
        </div>
      </div>

    </>
  );
}
