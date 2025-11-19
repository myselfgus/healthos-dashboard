import { create } from 'zustand';
import { generateLogs } from '@/lib/mock-data';
export type TabId = 'dashboard' | 'patients' | 'files' | 'settings' | string;
interface AppState {
  activeTab: TabId;
  logs: string[];
  processing: string | null;
  setActiveTab: (tab: TabId) => void;
  addLog: (log: string) => void;
  clearLogs: () => void;
  setProcessing: (id: string | null) => void;
  runAction: (id: string, title: string) => void;
}
export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  logs: [],
  processing: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),
  setProcessing: (id) => set({ processing: id }),
  runAction: (id, title) => {
    if (get().processing) return;
    set({ processing: id, logs: [] });
    const newLogs = generateLogs(title.toUpperCase());
    let delay = 0;
    newLogs.forEach((log) => {
      setTimeout(() => get().addLog(log), delay);
      delay += 800;
    });
    setTimeout(() => {
      get().addLog(`[${new Date().toLocaleTimeString()}] SUCESSO: ${title} finalizado com êxito.`);
      set({ processing: null });
    }, delay + 1000);
  },
}));