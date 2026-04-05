import { Bot, Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SearchResult } from "../backend.d";
import { useSearchStore } from "../store/searchStore";
import { parseMarkdown } from "../utils/markdown";
import { FollowUpChips } from "./FollowUpChips";

interface AnswerPanelProps {
  result: SearchResult;
  query: string;
  onFollowUp: (q: string) => void;
}

const MODEL_LABELS: Record<string, string> = {
  "gpt-4": "GPT-4",
  gemini: "Gemini",
  free: "NexSearch Free",
  demo: "Demo Mode",
};

export function AnswerPanel({ result, query, onFollowUp }: AnswerPanelProps) {
  const [copied, setCopied] = useState(false);
  const { isDemoMode } = useSearchStore();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.answer);
      setCopied(true);
      toast.success("Answer copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  const html = parseMarkdown(result.answer);

  return (
    <div
      className="nx-glass rounded-3xl p-6 nx-fade-in-up"
      data-ocid="answer.panel"
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="nx-badge-gradient w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[color:var(--nx-text-white)] text-base font-semibold leading-snug">
              {query}
            </p>
            <p className="text-[color:var(--nx-text-muted)] text-xs mt-0.5">
              {MODEL_LABELS[result.model] ?? result.model}
              {isDemoMode && (
                <span className="ml-2 text-amber-400 text-xs">
                  (Demo — configure API keys for live results)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleCopy}
            data-ocid="answer.copy_button"
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] border border-[color:var(--nx-border)] hover:border-[color:var(--nx-cyan-dim)] transition-all duration-200 bg-white/5"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
          <button
            onClick={handleShare}
            data-ocid="answer.share_button"
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] border border-[color:var(--nx-border)] hover:border-[color:var(--nx-cyan-dim)] transition-all duration-200 bg-white/5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[color:var(--nx-border)] mb-4" />

      <div
        className="nx-markdown text-sm leading-relaxed"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown parsed from trusted source
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <FollowUpChips chips={result.followUps} onChipClick={onFollowUp} />
    </div>
  );
}
