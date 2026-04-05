import { ArrowRight, Loader2, Mic } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef } from "react";
import { useSearchStore } from "../store/searchStore";

interface SearchBarProps {
  onSearch: (query: string) => void;
  compact?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  onSearch,
  compact = false,
  autoFocus = false,
}: SearchBarProps) {
  const { currentQuery, setCurrentQuery, isLoading } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setCurrentQuery("");
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setCurrentQuery]);

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  function handleKeyDownInput(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isLoading && currentQuery.trim()) {
      onSearch(currentQuery.trim());
    }
  }

  function handleSend() {
    if (!isLoading && currentQuery.trim()) {
      onSearch(currentQuery.trim());
    }
  }

  return (
    <div
      className={`nx-search-bar flex items-center gap-3 w-full ${
        compact ? "rounded-2xl px-3 py-2" : "rounded-[28px] px-5 py-3.5"
      }`}
    >
      <div
        className={`nx-badge-gradient flex items-center justify-center rounded-full font-bold text-white flex-shrink-0 ${
          compact ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"
        }`}
      >
        N
      </div>

      <input
        ref={inputRef}
        type="text"
        value={currentQuery}
        onChange={(e) => setCurrentQuery(e.target.value)}
        onKeyDown={handleKeyDownInput}
        placeholder="Ask NexSearch anything…"
        disabled={isLoading}
        data-ocid="search.input"
        className={`flex-1 bg-transparent border-none outline-none text-[color:var(--nx-text-white)] placeholder:text-[color:var(--nx-text-muted)] disabled:opacity-50 ${
          compact ? "text-sm" : "text-base"
        }`}
        autoComplete="off"
        spellCheck="false"
      />

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] transition-colors p-1 rounded-lg"
          aria-label="Voice input"
          tabIndex={-1}
          type="button"
        >
          <Mic className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        </button>

        <button
          onClick={handleSend}
          disabled={isLoading || !currentQuery.trim()}
          data-ocid="search.submit_button"
          type="button"
          className={`flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 ${
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          }`}
          style={{ background: "var(--nx-cyan)", color: "#070a14" }}
          aria-label="Search"
        >
          {isLoading ? (
            <Loader2
              className={
                compact ? "w-3 h-3 animate-spin" : "w-4 h-4 animate-spin"
              }
            />
          ) : (
            <ArrowRight className={compact ? "w-3 h-3" : "w-4 h-4"} />
          )}
          {!compact && <span>Search</span>}
        </button>
      </div>
    </div>
  );
}
