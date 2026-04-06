import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Code2,
  Globe,
  GraduationCap,
  Moon,
  Newspaper,
  Sparkles,
  Star,
  Sun,
  Zap,
} from "lucide-react";
import {
  type FocusMode,
  type ModelOption,
  useSettingsStore,
} from "../store/settingsStore";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

const MODELS: {
  id: ModelOption;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    id: "gpt-4",
    label: "GPT-4",
    icon: <Sparkles className="w-4 h-4" />,
    desc: "OpenAI",
  },
  {
    id: "gemini",
    label: "Gemini",
    icon: <Zap className="w-4 h-4" />,
    desc: "Google",
  },
  {
    id: "free",
    label: "Free",
    icon: <Star className="w-4 h-4" />,
    desc: "No key needed",
  },
];

const FOCUS_MODES: { id: FocusMode; label: string; icon: React.ReactNode }[] = [
  { id: "All", label: "All", icon: <Globe className="w-4 h-4" /> },
  {
    id: "Academic",
    label: "Academic",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  { id: "Code", label: "Code", icon: <Code2 className="w-4 h-4" /> },
  { id: "News", label: "News", icon: <Newspaper className="w-4 h-4" /> },
];

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const {
    theme,
    toggleTheme,
    selectedModel,
    setSelectedModel,
    focusMode,
    setFocusMode,
  } = useSettingsStore();

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="nx-settings-sheet rounded-t-3xl border-t border-[color:var(--nx-border)] max-h-[85vh] overflow-y-auto"
        style={{ background: "var(--nx-surface-solid)" }}
        data-ocid="settings.sheet"
      >
        <SheetHeader className="pb-4 border-b border-[color:var(--nx-border)]">
          <SheetTitle className="text-[color:var(--nx-text-white)] text-lg font-semibold">
            Settings
          </SheetTitle>
        </SheetHeader>

        <div className="py-5 space-y-6">
          {/* Theme */}
          <section>
            <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest mb-3">
              Appearance
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              data-ocid="settings.theme.toggle"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border border-[color:var(--nx-border)] bg-white/5 hover:bg-white/10 transition-all duration-200 min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-[color:var(--nx-cyan)]" />
                ) : (
                  <Sun className="w-4 h-4 text-[color:var(--nx-cyan)]" />
                )}
                <span className="text-[color:var(--nx-text-white)] text-sm font-medium">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <div
                className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                  theme === "dark" ? "bg-[color:var(--nx-cyan)]" : "bg-white/20"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                    theme === "dark" ? "left-5" : "left-0.5"
                  }`}
                />
              </div>
            </button>
          </section>

          {/* Model */}
          <section>
            <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest mb-3">
              AI Model
            </p>
            <div className="space-y-2">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  data-ocid={`settings.model.${model.id}.button`}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 min-h-[52px] ${
                    selectedModel === model.id
                      ? "border-[color:var(--nx-cyan)] bg-[color:var(--nx-cyan)]/10"
                      : "border-[color:var(--nx-border)] bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span
                    className={
                      selectedModel === model.id
                        ? "text-[color:var(--nx-cyan)]"
                        : "text-[color:var(--nx-text-muted)]"
                    }
                  >
                    {model.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <p className="text-[color:var(--nx-text-white)] text-sm font-semibold">
                      {model.label}
                    </p>
                    <p className="text-[color:var(--nx-text-muted)] text-xs">
                      {model.desc}
                    </p>
                  </div>
                  {selectedModel === model.id && (
                    <span className="text-[color:var(--nx-cyan)] text-sm">
                      &#10003;
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Focus Mode */}
          <section>
            <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest mb-3">
              Focus Mode
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FOCUS_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFocusMode(mode.id)}
                  data-ocid={`settings.focus.${mode.id.toLowerCase()}.button`}
                  className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border transition-all duration-200 min-h-[52px] ${
                    focusMode === mode.id
                      ? "border-[color:var(--nx-cyan)] bg-[color:var(--nx-cyan)]/10 text-[color:var(--nx-cyan)]"
                      : "border-[color:var(--nx-border)] bg-white/5 hover:bg-white/10 text-[color:var(--nx-text-muted)]"
                  }`}
                >
                  {mode.icon}
                  <span className="text-sm font-medium">{mode.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
