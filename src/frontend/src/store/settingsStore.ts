import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ModelOption = "gpt-4" | "gemini" | "free";
export type FocusMode = "All" | "Academic" | "Code" | "News";

interface SettingsState {
  theme: "dark" | "light";
  selectedModel: ModelOption;
  focusMode: FocusMode;
  setTheme: (t: "dark" | "light") => void;
  setSelectedModel: (m: ModelOption) => void;
  setFocusMode: (f: FocusMode) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      selectedModel: "free",
      focusMode: "All",
      setTheme: (t) => set({ theme: t }),
      setSelectedModel: (m) => set({ selectedModel: m }),
      setFocusMode: (f) => set({ focusMode: f }),
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
      },
    }),
    {
      name: "nexsearch-settings",
      partialize: (state) => ({
        theme: state.theme,
        selectedModel: state.selectedModel,
        focusMode: state.focusMode,
      }),
    },
  ),
);
