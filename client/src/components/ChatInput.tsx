import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Slash, AtSign, Bold, Italic, Code, Quote, BookOpen, Search } from "lucide-react";
import { KnowledgeSearchModal, KnowledgeSearchArticle } from "./KnowledgeSearchModal";
import { KNOWLEDGE_ROUTE_BASE, KNOWLEDGE_COMMANDS, SLASH_COMMANDS, type KnowledgeCommand } from "@/constants/commands";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showShortcut?: boolean;
  onShareKnowledge?: (knowledgeId: string, title: string, summary: string) => void;
}

export function ChatInput({ 
  onSendMessage, 
  placeholder = "Type a message...", 
  disabled = false, 
  showShortcut = true,
  onShareKnowledge
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle slash commands
  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Check for slash commands
    if (value.startsWith("/")) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  };

  const handleKnowledgeSelect = (knowledge: KnowledgeSearchArticle) => {
    const knowledgeMessage = `📚 **${knowledge.title}**\n\n${knowledge.summary}\n\n[View full article](${KNOWLEDGE_ROUTE_BASE}/${knowledge.id})`;
    onSendMessage(knowledgeMessage);
    onShareKnowledge?.(knowledge.id, knowledge.title, knowledge.summary);
  };

  const insertCommand = (command: string) => {
    setMessage(command);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      // Handle special commands
      if (KNOWLEDGE_COMMANDS.includes(trimmedMessage as KnowledgeCommand)) {
        setShowKnowledgeModal(true);
        setMessage("");
        return;
      }

      console.log(`Sending message: ${trimmedMessage}`);
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
    
    if (e.key === "Escape" && showCommands) {
      setShowCommands(false);
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
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7" 
                aria-label="Slash commands" 
                onClick={() => setShowCommands(!showCommands)}
                data-testid="button-slash"
              >
                <Slash className="h-6 w-6" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7" 
                aria-label="Search knowledge" 
                onClick={() => setShowKnowledgeModal(true)}
                data-testid="button-knowledge"
              >
                <BookOpen className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Textarea container */}
          <div className="py-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[44px] max-h-[256px] resize-none font-sans border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 overflow-y-auto w-full"
              data-testid="input-chat-message"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 256)}px`;
              }}
            />

            {/* Command suggestions */}
            {showCommands && message.startsWith("/") && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover border rounded-md shadow-lg z-50">
                <div className="p-2 space-y-1">
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                    onClick={() => insertCommand(SLASH_COMMANDS.KNOWLEDGE_SEARCH)}
                  >
                    <BookOpen className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{SLASH_COMMANDS.KNOWLEDGE_SEARCH}</div>
                      <div className="text-xs text-muted-foreground">Search knowledge base</div>
                    </div>
                  </div>
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                    onClick={() => insertCommand(SLASH_COMMANDS.KNOWLEDGE_QUICK_SEARCH)}
                  >
                    <Search className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{SLASH_COMMANDS.KNOWLEDGE_QUICK_SEARCH}</div>
                      <div className="text-xs text-muted-foreground">Quick knowledge search</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Attach file" data-testid="button-attach-bottom">
                <Paperclip className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Mention user" data-testid="button-mention-bottom">
                <AtSign className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Insert emoji" data-testid="button-emoji-bottom">
                <Smile className="h-6 w-6" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">

              {/* Ctrl+Enter hint */}
              {showShortcut && (
                <>
                  <kbd className="px-1 py-0.5 rounded text-xs">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="px-1 py-0.5 rounded text-xs">Enter</kbd>
                </>
              )}

              <Button
                size="icon"
                onClick={handleSend}
                disabled={!message.trim() || disabled}
                data-testid="button-send-message"
                className="h-7 w-7 bg-cohere-green-700 hover:bg-cohere-blue-800"
              >
                <Send className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Search Modal */}
      <KnowledgeSearchModal
        isOpen={showKnowledgeModal}
        onClose={() => setShowKnowledgeModal(false)}
        onSelectKnowledge={handleKnowledgeSelect}
      />
    </div>
  );
}
