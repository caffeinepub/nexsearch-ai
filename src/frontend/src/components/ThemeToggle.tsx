import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useSettingsStore } from "../store/settingsStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useSettingsStore();

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

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-ocid="settings.toggle"
      className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] hover:bg-white/10"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
