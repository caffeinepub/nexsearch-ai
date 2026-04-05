import { create } from "zustand";
import type { SearchResult, Thread } from "../backend.d";

interface SearchState {
  activeThreadId: string | null;
  currentQuery: string;
  currentResults: SearchResult | null;
  isLoading: boolean;
  isDemoMode: boolean;
  threads: Thread[];
  setActiveThreadId: (id: string | null) => void;
  setCurrentQuery: (q: string) => void;
  setCurrentResults: (r: SearchResult | null) => void;
  setIsLoading: (v: boolean) => void;
  setIsDemoMode: (v: boolean) => void;
  setThreads: (threads: Thread[]) => void;
  addThread: (thread: Thread) => void;
  removeThread: (id: string) => void;
  clearActive: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  activeThreadId: null,
  currentQuery: "",
  currentResults: null,
  isLoading: false,
  isDemoMode: false,
  threads: [],
  setActiveThreadId: (id) => set({ activeThreadId: id }),
  setCurrentQuery: (q) => set({ currentQuery: q }),
  setCurrentResults: (r) => set({ currentResults: r }),
  setIsLoading: (v) => set({ isLoading: v }),
  setIsDemoMode: (v) => set({ isDemoMode: v }),
  setThreads: (threads) => set({ threads }),
  addThread: (thread) =>
    set((prev) => ({ threads: [thread, ...prev.threads] })),
  removeThread: (id) =>
    set((prev) => ({ threads: prev.threads.filter((t) => t.id !== id) })),
  clearActive: () =>
    set({ activeThreadId: null, currentQuery: "", currentResults: null }),
}));
