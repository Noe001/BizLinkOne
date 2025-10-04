import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Smile, ThumbsUp, Heart, Laugh, Frown, Angry } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
  userIds: string[];
}

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
  onAddReaction?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (messageId: string, emoji: string) => void;
  disabled?: boolean;
}

const QUICK_REACTIONS = [
  { emoji: '👍', label: 'thumbs up', icon: ThumbsUp },
  { emoji: '❤️', label: 'heart', icon: Heart },
  { emoji: '😂', label: 'laugh', icon: Laugh },
  { emoji: '😮', label: 'surprised', icon: Smile },
  { emoji: '😢', label: 'sad', icon: Frown },
  { emoji: '😠', label: 'angry', icon: Angry },
  { emoji: '🎉', label: 'celebrate', icon: Smile },
  { emoji: '🚀', label: 'rocket', icon: Smile },
  { emoji: '👀', label: 'eyes', icon: Smile },
  { emoji: '✅', label: 'check', icon: Smile },
];

export function MessageReactions({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  disabled = false,
}: MessageReactionsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (disabled) return;
    
    if (hasReacted) {
      onRemoveReaction?.(messageId, emoji);
    } else {
      onAddReaction?.(messageId, emoji);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (disabled) return;
    
    const existingReaction = reactions.find(r => r.emoji === emoji);
    if (existingReaction?.hasReacted) {
      onRemoveReaction?.(messageId, emoji);
    } else {
      onAddReaction?.(messageId, emoji);
    }
    setIsPickerOpen(false);
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Display existing reactions */}
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant="ghost"
          size="sm"
          onClick={() => handleReactionClick(reaction.emoji, reaction.hasReacted)}
          disabled={disabled}
          className={cn(
            'h-6 px-2 gap-1 text-xs hover:bg-accent',
            reaction.hasReacted && 'bg-primary/10 border border-primary/20 hover:bg-primary/20'
          )}
        >
          <span className="text-sm">{reaction.emoji}</span>
          <span className={cn(
            'text-xs font-medium',
            reaction.hasReacted && 'text-primary'
          )}>
            {reaction.count}
          </span>
        </Button>
      ))}

      {/* Add reaction button */}
      <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Smile className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="grid grid-cols-5 gap-1">
            {QUICK_REACTIONS.map((reaction) => (
              <Button
                key={reaction.emoji}
                variant="ghost"
                size="sm"
                onClick={() => handleEmojiSelect(reaction.emoji)}
                className="h-10 w-10 text-xl hover:bg-accent"
                title={reaction.label}
              >
                {reaction.emoji}
              </Button>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              クリックしてリアクションを追加
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
