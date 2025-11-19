import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Info, Sparkles } from 'lucide-react';
import { useAppStore, Message } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GenUIRenderer } from '@/components/genui/GenerativeWidgets';
const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === 'user';
  const isSystem = msg.role === 'system';
  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          <Info size={12} />
          <span>{msg.content}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("flex items-start gap-3 my-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "max-w-md rounded-2xl p-4 text-sm",
        isUser
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-muted rounded-bl-none"
      )}>
        <p className="whitespace-pre-wrap">{msg.content}</p>
        {msg.uiComponent && (
          <div className="mt-4">
            <GenUIRenderer component={msg.uiComponent} />
          </div>
        )}
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback><User size={18} /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
const SuggestedPrompts = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
  const prompts = [
    "Resumo do paciente 1001",
    "Plano de ação para paciente 1001",
    "Histórico de vitais do paciente 1003",
  ];
  return (
    <div className="p-4 animate-fade-in">
      <div className="flex flex-col items-center gap-2">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground mb-2">Experimente um destes comandos:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {prompts.map((prompt, i) => (
            <Button key={i} variant="outline" size="sm" onClick={() => onPromptClick(prompt)}>
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
export const GenUIAssistant = () => {
  const [input, setInput] = useState('');
  const chatHistory = useAppStore(s => s.chatHistory);
  const sendMessage = useAppStore(s => s.sendMessage);
  const isAiThinking = useAppStore(s => s.isAiThinking);
  const systemProcessing = useAppStore(s => s.systemProcessing);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };
  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };
  const isInputDisabled = isAiThinking || !!systemProcessing;
  const showSuggestedPrompts = chatHistory.length === 1;
  return (
    <div className="h-full flex flex-col bg-card border rounded-lg overflow-hidden">
      <header className="p-4 border-b">
        <h2 className="text-lg font-bold">MedScribe GenUI</h2>
        <p className="text-sm text-muted-foreground">Assistente de IA com interface generativa.</p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 custom-scroll">
        {chatHistory.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isAiThinking && (
          <div className="flex items-start gap-3 my-4 justify-start">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl p-4 rounded-bl-none">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
      {showSuggestedPrompts && <SuggestedPrompts onPromptClick={handlePromptClick} />}
      <footer className="p-4 border-t bg-background">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isInputDisabled ? "Aguarde..." : "Digite sua mensagem..."}
            disabled={isInputDisabled}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isInputDisabled || !input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </footer>
    </div>
  );
};