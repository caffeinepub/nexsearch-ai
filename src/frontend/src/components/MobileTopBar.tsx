import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface MobileTopBarProps {
  onOpenSidebar: () => void;
}

export function MobileTopBar({ onOpenSidebar }: MobileTopBarProps) {
  return (
    <header
      className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[color:var(--nx-border)] backdrop-blur-xl sticky top-0 z-30"
      style={{ background: "rgba(7,10,20,0.90)" }}
      data-ocid="mobile.topbar"
    >
      <button
        type="button"
        onClick={onOpenSidebar}
        data-ocid="mobile.topbar.menu.button"
        className="flex items-center justify-center w-10 h-10 rounded-xl text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] hover:bg-white/10 transition-all duration-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <div className="nx-badge-gradient w-6 h-6 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">N</span>
        </div>
        <span className="text-[color:var(--nx-text-white)] font-semibold text-base tracking-tight">
          NexSearch AI
        </span>
      </div>

      <ThemeToggle />
    </header>
  );
}
