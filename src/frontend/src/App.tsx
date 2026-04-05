import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import type { Thread } from "./backend.d";
import { Sidebar } from "./features/history/Sidebar";
import { SearchPage } from "./features/search/SearchPage";
import { HomePage } from "./pages/HomePage";
import { useSearchStore } from "./store/searchStore";
import { useSettingsStore } from "./store/settingsStore";

export default function App() {
  const { activeThreadId, setActiveThreadId, clearActive } = useSearchStore();
  const { theme } = useSettingsStore();
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  // Apply theme class on mount and changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  // Default dark on first load
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  function handleNewSearch() {
    clearActive();
    setActiveThread(null);
  }

  function handleSelectThread(thread: Thread) {
    setActiveThreadId(thread.id);
    setActiveThread(thread);
  }

  function handleSearchStart(threadId: string) {
    setActiveThreadId(threadId);
  }

  return (
    <div className="nx-app-bg flex h-screen overflow-hidden font-sans">
      <Sidebar
        onNewSearch={handleNewSearch}
        onSelectThread={handleSelectThread}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeThreadId ? (
          <SearchPage thread={activeThread} />
        ) : (
          <HomePage onSearchStart={handleSearchStart} />
        )}
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#141a26",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#f0f4ff",
          },
        }}
      />
    </div>
  );
}
