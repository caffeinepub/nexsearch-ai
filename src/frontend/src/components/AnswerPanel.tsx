import { Bookmark, Bot, Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SearchResult } from "../backend.d";
import { useStreamingText } from "../hooks/useStreamingText";
import { useSearchStore } from "../store/searchStore";
import { parseMarkdown } from "../utils/markdown";
import { FollowUpChips } from "./FollowUpChips";

interface AnswerPanelProps {
  result: SearchResult;
  query: string;
  onFollowUp: (q: string) => void;
  isLatest?: boolean;
}

const MODEL_LABELS: Record<string, string> = {
  "gpt-4": "GPT-4",
  gemini: "Gemini",
  free: "NexSearch Free",
  demo: "Demo Mode",
};

const RELATED_IMAGE_PLACEHOLDERS = [1, 2, 3, 4];

export function AnswerPanel({
  result,
  query,
  onFollowUp,
  isLatest = false,
}: AnswerPanelProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { isDemoMode } = useSearchStore();

  // Stream only for latest result
  const { displayedText, isComplete } = useStreamingText(
    result.answer,
    isLatest,
  );
  const renderedText = isLatest ? displayedText : result.answer;
  const html = parseMarkdown(renderedText);

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

  function handleBookmark() {
    setSaved((prev) => !prev);
    toast.success(saved ? "Removed from saved" : "Saved to bookmarks");
  }

  return (
    <div
      className="nx-glass rounded-3xl p-5 sm:p-6 nx-fade-in-up"
      style={{
        background:
          "radial-gradient(ellipse at 0% 50%, rgba(22,214,255,0.06) 0%, transparent 60%), var(--nx-surface)",
      }}
      data-ocid="answer.panel"
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="nx-badge-gradient w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[color:var(--nx-text-white)] text-base font-semibold leading-snug truncate">
              {query}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(22,214,255,0.12)",
                  border: "1px solid rgba(22,214,255,0.2)",
                  color: "var(--nx-cyan)",
                  boxShadow: isLatest
                    ? "0 0 8px rgba(22,214,255,0.15)"
                    : "none",
                }}
              >
                {MODEL_LABELS[result.model] ?? result.model}
              </p>
              {/* Confidence badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                High confidence
              </span>
              {isDemoMode && (
                <span className="text-amber-400 text-xs">
                  (Demo — configure API keys for live results)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleBookmark}
            data-ocid="answer.save_button"
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition-all duration-200 bg-white/5 min-h-[36px] ${
              saved
                ? "text-[color:var(--nx-cyan)] border-[color:var(--nx-cyan-dim)]"
                : "text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] border-[color:var(--nx-border)] hover:border-[color:var(--nx-cyan-dim)]"
            }`}
            aria-label={saved ? "Remove bookmark" : "Save to bookmarks"}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`}
            />
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
          </button>
          <button
            onClick={handleCopy}
            data-ocid="answer.copy_button"
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] border border-[color:var(--nx-border)] hover:border-[color:var(--nx-cyan-dim)] transition-all duration-200 bg-white/5 min-h-[36px]"
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] border border-[color:var(--nx-border)] hover:border-[color:var(--nx-cyan-dim)] transition-all duration-200 bg-white/5 min-h-[36px]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[color:var(--nx-border)] mb-4" />

      {/* Streaming answer with cursor */}
      <div
        className={`nx-markdown text-sm leading-relaxed ${isLatest && !isComplete ? "nx-stream-cursor" : ""}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown parsed from trusted source
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Related Images row */}
      <div className="mt-5">
        <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest mb-3">
          Related Images
        </p>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {RELATED_IMAGE_PLACEHOLDERS.map((n) => (
            <div
              key={n}
              className="flex-shrink-0 w-20 h-14 rounded-xl nx-skeleton"
              style={{ minWidth: "80px" }}
            />
          ))}
        </div>
      </div>

      {/* Follow-ups only shown after streaming completes */}
      {(!isLatest || isComplete) && (
        <FollowUpChips chips={result.followUps} onChipClick={onFollowUp} />
      )}
    </div>
  );
}
