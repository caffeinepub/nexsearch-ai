import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Sparkles, Star, Zap } from "lucide-react";
import { type ModelOption, useSettingsStore } from "../store/settingsStore";

const MODELS: {
  id: ModelOption;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    id: "gpt-4",
    label: "GPT-4",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    desc: "OpenAI",
  },
  {
    id: "gemini",
    label: "Gemini",
    icon: <Zap className="w-3.5 h-3.5" />,
    desc: "Google",
  },
  {
    id: "free",
    label: "Free",
    icon: <Star className="w-3.5 h-3.5" />,
    desc: "No key needed",
  },
];

export function LLMSelector() {
  const { selectedModel, setSelectedModel } = useSettingsStore();
  const current = MODELS.find((m) => m.id === selectedModel) ?? MODELS[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-ocid="search.model_select"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] border border-[color:var(--nx-border)] hover:border-[color:var(--nx-cyan-dim)] bg-white/5"
        >
          <span className="text-[color:var(--nx-cyan)]">{current.icon}</span>
          <span>{current.label}</span>
          <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-44 bg-[#0e1628] border border-white/10 text-[color:var(--nx-text-white)] shadow-glass rounded-xl p-1"
      >
        {MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm hover:bg-white/10 focus:bg-white/10"
          >
            <span className="text-[color:var(--nx-cyan)]">{model.icon}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[color:var(--nx-text-white)] text-xs font-semibold">
                {model.label}
              </span>
              <span className="text-[color:var(--nx-text-muted)] text-xs">
                {model.desc}
              </span>
            </div>
            {selectedModel === model.id && (
              <span className="ml-auto text-[color:var(--nx-cyan)] text-xs">
                &#10003;
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
