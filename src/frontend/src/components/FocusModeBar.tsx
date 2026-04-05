import { Code2, Globe, GraduationCap, Newspaper } from "lucide-react";
import { type FocusMode, useSettingsStore } from "../store/settingsStore";

const MODES: { id: FocusMode; label: string; icon: React.ReactNode }[] = [
  { id: "All", label: "All", icon: <Globe className="w-3.5 h-3.5" /> },
  {
    id: "Academic",
    label: "Academic",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
  { id: "Code", label: "Code", icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: "News", label: "News", icon: <Newspaper className="w-3.5 h-3.5" /> },
];

export function FocusModeBar() {
  const { focusMode, setFocusMode } = useSettingsStore();

  return (
    <fieldset className="flex items-center gap-1.5 border-0 p-0 m-0">
      <legend className="sr-only">Focus mode</legend>
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => setFocusMode(mode.id)}
          data-ocid="search.focus.tab"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
            focusMode === mode.id
              ? "nx-focus-active border-transparent"
              : "border-[color:var(--nx-border)] text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] bg-white/5"
          }`}
        >
          {mode.icon}
          <span>{mode.label}</span>
        </button>
      ))}
    </fieldset>
  );
}
