import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Slash, AtSign, Image, Bold, Italic, Code, Quote } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showShortcut?: boolean;
}

export function ChatInput({ onSendMessage, placeholder = "Type a message...", disabled = false, showShortcut = true }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      console.log(`Sending message: ${message}`);
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
    // Allow normal Enter for line breaks (no preventDefault)
  };

  return (
    <div className="border-t border-card-border bg-card p-2">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative border border-input bg-background rounded-md pl-2">
          {/* Formatting buttons above textarea */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Bold" data-testid="button-bold">
                <Bold className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Italic" data-testid="button-italic">
                <Italic className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Quote" data-testid="button-quote">
                <Quote className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Code block" data-testid="button-code">
                <Code className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Slash commands" data-testid="button-slash">
                <Slash className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Insert image" data-testid="button-image">
                <Image className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Textarea container (removed top/bottom borders) */}
          <div className="py-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[44px] max-h-[256px] resize-none font-sans border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 overflow-y-auto w-full"
              data-testid="input-chat-message"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 256)}px`; // max-h-[256px]
              }}
            />
          </div>

          {/* Bottom action buttons (below textarea, non-overlapping) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Attach file" data-testid="button-attach-bottom">
                <Paperclip className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Mention user" data-testid="button-mention-bottom">
                <AtSign className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" data-testid="button-emoji">
                <Smile className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleSend}
                disabled={!message.trim() || disabled}
                data-testid="button-send-message"
                size="icon"
                variant="ghost"
                className="h-7 w-7 bg-green-700 hover:bg-green-800 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={`text-xs text-muted-foreground mt-2 flex justify-end ${showShortcut ? '' : 'opacity-0'}`} aria-hidden={!showShortcut}>
        <span className="font-medium">Ctrl + Enter</span>&nbsp;to send
      </div>
    </div>
  );
}
