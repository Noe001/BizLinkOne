import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, BookOpen, MoreHorizontal, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  isOwn?: boolean;
  canConvertToTask?: boolean;
  canConvertToKnowledge?: boolean;
  onConvertToTask?: (messageId: string) => void;
  onConvertToKnowledge?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
}

export function ChatMessage({
  id,
  userId,
  userName,
  userAvatar,
  content,
  timestamp,
  isOwn = false,
  canConvertToTask = true,
  canConvertToKnowledge = true,
  onConvertToTask,
  onConvertToKnowledge,
  onReply,
}: ChatMessageProps) {
  const handleConvertToTask = () => {
    console.log(`Converting message ${id} to task`);
    onConvertToTask?.(id);
  };

  const handleConvertToKnowledge = () => {
    console.log(`Converting message ${id} to knowledge`);
    onConvertToKnowledge?.(id);
  };

  const handleReply = () => {
    console.log(`Replying to message ${id}`);
    onReply?.(id);
  };

  return (
    <div className={`group flex gap-3 p-4 hover-elevate ${isOwn ? 'flex-row-reverse' : ''}`} data-testid={`message-${id}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
        <AvatarFallback>
          {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 min-w-0 ${isOwn ? 'text-right' : ''}`}>
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
          <span className="font-medium text-sm">{userName}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
          {isOwn && <Badge variant="outline" className="text-xs">You</Badge>}
        </div>
        
        <div className={`bg-card border border-card-border rounded-lg p-3 ${isOwn ? 'bg-cohere-blue-500 text-white border-cohere-blue-500' : ''}`}>
          <p className="text-sm font-sans leading-relaxed">{content}</p>
        </div>
        
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-2 ${isOwn ? 'justify-end' : ''}`}>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReply}
            data-testid={`button-reply-${id}`}
            className="h-6 px-2 text-xs"
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>
          
          {canConvertToTask && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleConvertToTask}
              data-testid={`button-task-${id}`}
              className="h-6 px-2 text-xs"
            >
              <CheckSquare className="w-3 h-3 mr-1" />
              Task
            </Button>
          )}
          
          {canConvertToKnowledge && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleConvertToKnowledge}
              data-testid={`button-knowledge-${id}`}
              className="h-6 px-2 text-xs"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Knowledge
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            data-testid={`button-more-${id}`}
            className="h-6 px-2 text-xs"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}