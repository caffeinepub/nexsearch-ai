import { Clock, Home, Settings } from "lucide-react";

interface MobileBottomNavProps {
  onHome: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  activeTab?: "home" | "history" | "settings";
}

export function MobileBottomNav({
  onHome,
  onOpenHistory,
  onOpenSettings,
  activeTab = "home",
}: MobileBottomNavProps) {
  return (
    <nav
      className="md:hidden nx-bottom-nav fixed bottom-0 left-0 right-0 z-40"
      data-ocid="mobile.nav.panel"
    >
      <div className="flex items-center justify-around px-2 py-1 safe-area-pb">
        <button
          type="button"
          onClick={onHome}
          data-ocid="mobile.nav.home.button"
          className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all duration-200 min-h-[52px] min-w-[64px] ${
            activeTab === "home"
              ? "text-[color:var(--nx-cyan)]"
              : "text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)]"
          }`}
          aria-label="Home"
        >
          <Home
            className={`w-5 h-5 transition-all ${
              activeTab === "home" ? "scale-110" : ""
            }`}
          />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          data-ocid="mobile.nav.history.button"
          className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all duration-200 min-h-[52px] min-w-[64px] ${
            activeTab === "history"
              ? "text-[color:var(--nx-cyan)]"
              : "text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)]"
          }`}
          aria-label="Search history"
        >
          <Clock
            className={`w-5 h-5 transition-all ${
              activeTab === "history" ? "scale-110" : ""
            }`}
          />
          <span className="text-[10px] font-medium">History</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          data-ocid="mobile.nav.settings.button"
          className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all duration-200 min-h-[52px] min-w-[64px] ${
            activeTab === "settings"
              ? "text-[color:var(--nx-cyan)]"
              : "text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)]"
          }`}
          aria-label="Settings"
        >
          <Settings
            className={`w-5 h-5 transition-all ${
              activeTab === "settings" ? "scale-110" : ""
            }`}
          />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
}
