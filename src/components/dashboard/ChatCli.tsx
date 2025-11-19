import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Loader2 } from 'lucide-react';
import { useAppStore, Message } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const MessageAvatar = ({ role }: { role: Message['role'] }) => {
  const getAvatarContent = () => {
    switch (role) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'assistant':
        return <Bot className="h-4 w-4" />;
      case 'system':
        return <Terminal className="h-4 w-4" />;
    }
  };
  const getAvatarClass = () => {
    switch (role) {
      case 'user':
        return 'bg-secondary text-secondary-foreground';
      case 'assistant':
        return 'bg-primary text-primary-foreground';
      case 'system':
        return 'bg-muted text-muted-foreground';
    }
  };
  return (
    <Avatar className={cn("h-8 w-8", getAvatarClass())}>
      <AvatarFallback>{getAvatarContent()}</AvatarFallback>
    </Avatar>
  );
};
const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className={cn(
      "flex items-start gap-3 text-sm py-3 animate-fade-in",
      message.role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {message.role !== 'user' && <MessageAvatar role={message.role} />}
      <div className={cn(
        "max-w-sm md:max-w-md lg:max-w-lg p-3 rounded-lg whitespace-pre-wrap",
        message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : '',
        message.role === 'assistant' ? 'bg-secondary rounded-bl-none' : '',
        message.role === 'system' ? 'bg-muted/60 text-muted-foreground text-xs font-mono rounded-none w-full' : ''
      )}>
        {message.content}
      </div>
      {message.role === 'user' && <MessageAvatar role={message.role} />}
    </div>
  );
};
export const ChatCli = () => {
  const chatHistory = useAppStore(s => s.chatHistory);
  const isAiThinking = useAppStore(s => s.isAiThinking);
  const systemProcessing = useAppStore(s => s.systemProcessing);
  const sendMessage = useAppStore(s => s.sendMessage);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };
  const isInputDisabled = isAiThinking || !!systemProcessing;
  return (
    <div className="h-full flex flex-col bg-card border rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {chatHistory.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isAiThinking && (
            <div className="flex items-start gap-3 text-sm py-3 animate-fade-in">
              <MessageAvatar role="assistant" />
              <div className="bg-secondary p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground italic text-sm">Pensando...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isInputDisabled ? "Aguarde..." : "Digite um comando..."}
            disabled={isInputDisabled}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isInputDisabled || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};