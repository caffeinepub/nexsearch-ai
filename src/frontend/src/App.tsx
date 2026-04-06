import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import type { Thread } from "./backend.d";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { SettingsSheet } from "./components/SettingsSheet";
import { Sidebar } from "./features/history/Sidebar";
import { SearchPage } from "./features/search/SearchPage";
import { HomePage } from "./pages/HomePage";
import { useSearchStore } from "./store/searchStore";
import { useSettingsStore } from "./store/settingsStore";

export default function App() {
  const { activeThreadId, setActiveThreadId, clearActive } = useSearchStore();
  const { theme } = useSettingsStore();
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    setIsMobileSidebarOpen(false);
  }

  function handleSelectThread(thread: Thread) {
    setActiveThreadId(thread.id);
    setActiveThread(thread);
    setIsMobileSidebarOpen(false);
  }

  function handleSearchStart(threadId: string) {
    setActiveThreadId(threadId);
  }

  const activeTab = activeThreadId ? "history" : "home";

  return (
    <div className="nx-app-bg flex h-screen overflow-hidden font-sans">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          onNewSearch={handleNewSearch}
          onSelectThread={handleSelectThread}
        />
      </div>

      {/* Mobile sidebar — inside a Sheet */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[300px] border-r border-[color:var(--nx-border)] md:hidden"
          style={{ background: "var(--nx-sidebar-bg)" }}
          data-ocid="mobile.sidebar.sheet"
        >
          <Sidebar
            onNewSearch={handleNewSearch}
            onSelectThread={handleSelectThread}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-hidden pb-0 md:pb-0">
          {activeThreadId ? (
            <SearchPage
              thread={activeThread}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />
          ) : (
            <HomePage
              onSearchStart={handleSearchStart}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />
          )}
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav
          onHome={handleNewSearch}
          onOpenHistory={() => setIsMobileSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          activeTab={activeTab}
        />
      </div>

      {/* Settings sheet (mobile) */}
      <SettingsSheet
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

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
