import { create } from 'zustand';
import { generateLogs, generateAiResponse } from '@/lib/mock-data';
import { v4 as uuidv4 } from 'uuid';
export type TabId = 'dashboard' | 'patients' | 'files' | 'settings' | string;
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}
interface AppState {
  activeTab: TabId;
  chatHistory: Message[];
  systemProcessing: string | null;
  isAiThinking: boolean;
  setActiveTab: (tab: TabId) => void;
  setSystemProcessing: (id: string | null) => void;
  runAction: (id: string, title: string) => void;
  sendMessage: (content: string) => void;
  addChatMessage: (message: Omit<Message, 'id'>) => void;
}
export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  chatHistory: [
    { id: uuidv4(), role: 'assistant', content: 'Olá! Sou a IA do MedScribe. Como posso ajudar hoje? Digite `ajuda` para ver os comandos.' }
  ],
  systemProcessing: null,
  isAiThinking: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSystemProcessing: (id) => set({ systemProcessing: id }),
  addChatMessage: (message) => {
    const newMessage = { ...message, id: uuidv4() };
    set((state) => ({ chatHistory: [...state.chatHistory, newMessage] }));
  },
  sendMessage: (content) => {
    if (!content.trim() || get().isAiThinking || get().systemProcessing) return;
    const userMessage: Omit<Message, 'id'> = { role: 'user', content };
    get().addChatMessage(userMessage);
    set({ isAiThinking: true });
    setTimeout(() => {
      const aiResponseContent = generateAiResponse(content);
      const aiMessage: Omit<Message, 'id'> = { role: 'assistant', content: aiResponseContent };
      get().addChatMessage(aiMessage);
      set({ isAiThinking: false });
    }, 1200);
  },
  runAction: (id, title) => {
    if (get().systemProcessing || get().isAiThinking) return;
    set({ systemProcessing: id, chatHistory: [] });
    const addSystemMessage = (content: string) => {
        get().addChatMessage({ role: 'system', content });
    };
    const newLogs = generateLogs(title.toUpperCase());
    let delay = 0;
    newLogs.forEach((log) => {
      setTimeout(() => addSystemMessage(log), delay);
      delay += 600;
    });
    setTimeout(() => {
      addSystemMessage(`[${new Date().toLocaleTimeString()}] SUCESSO: ${title} finalizado com êxito.`);
      set({ systemProcessing: null });
    }, delay + 1000);
  },
}));