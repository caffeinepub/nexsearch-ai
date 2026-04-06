import { useEffect, useRef, useState } from "react";
import type { Message, SearchResult, Source, Thread } from "../../backend.d";
import { AnswerPanel } from "../../components/AnswerPanel";
import { FocusModeBar } from "../../components/FocusModeBar";
import { LLMSelector } from "../../components/LLMSelector";
import { MobileTopBar } from "../../components/MobileTopBar";
import { SearchBar } from "../../components/SearchBar";
import { SourceCardSkeleton } from "../../components/SkeletonLoader";
import { SourceCards } from "../../components/SourceCard";
import { TypingIndicator } from "../../components/TypingIndicator";
import { useCreateThread, useSearch } from "../../hooks/useQueries";
import { useSearchStore } from "../../store/searchStore";
import { useSettingsStore } from "../../store/settingsStore";

interface SearchPageProps {
  thread: Thread | null;
  onOpenMobileSidebar: () => void;
}

type ConversationTurn = {
  query: string;
  result: SearchResult;
};

function buildTurns(thread: Thread): ConversationTurn[] {
  const userMsgs = thread.messages.filter((m: Message) => m.role === "user");
  return userMsgs
    .map((msg: Message, i: number) => ({
      query: msg.content,
      result: thread.results[i],
    }))
    .filter((t): t is ConversationTurn => Boolean(t.result));
}

// Wrapper that applies stagger animation to source cards
function SourceCardsStaggered({ sources }: { sources: Source[] }) {
  return (
    <div className="nx-source-stagger-container">
      <SourceCards sources={sources} />
    </div>
  );
}

export function SearchPage({ thread, onOpenMobileSidebar }: SearchPageProps) {
  const {
    isLoading,
    currentResults,
    currentQuery,
    setActiveThreadId,
    addThread,
  } = useSearchStore();
  const { selectedModel, focusMode } = useSettingsStore();
  const searchMutation = useSearch();
  const createThread = useCreateThread();
  const bottomRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const turns: ConversationTurn[] = thread ? buildTurns(thread) : [];
  const latestResult =
    currentResults ??
    (turns.length > 0 ? turns[turns.length - 1].result : null);
  const latestQuery =
    currentQuery || (turns.length > 0 ? turns[turns.length - 1].query : "");

  // Track scroll to apply glow to sticky header
  useEffect(() => {
    const container = document.querySelector(".nx-search-scroll");
    if (!container) return;
    function onScroll() {
      setIsScrolled((container?.scrollTop ?? 0) > 10);
    }
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSearch(query: string) {
    let threadId = thread?.id;

    if (!threadId) {
      try {
        threadId = await createThread.mutateAsync(query);
        setActiveThreadId(threadId);
        const newThread: Thread = {
          id: threadId,
          title: query,
          messages: [
            {
              content: query,
              role: "user",
              timestamp: BigInt(Date.now()) * BigInt(1_000_000),
            },
          ],
          results: [],
          createdAt: BigInt(Date.now()) * BigInt(1_000_000),
          updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
        };
        addThread(newThread);
      } catch {
        threadId = `demo-${Date.now()}`;
        setActiveThreadId(threadId);
      }
    }

    await searchMutation.mutateAsync({
      threadId,
      query,
      model: selectedModel,
      focusMode,
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mobile top bar */}
      <MobileTopBar onOpenSidebar={onOpenMobileSidebar} />

      {/* Sticky search header */}
      <div
        ref={headerRef}
        className="sticky top-0 z-20 px-4 sm:px-6 pt-4 pb-3 border-b border-[color:var(--nx-border)] backdrop-blur-xl transition-all duration-300"
        style={{
          background: "rgba(7,10,20,0.88)",
          boxShadow: isScrolled
            ? "0 1px 0 rgba(22,214,255,0.12), 0 4px 20px rgba(0,0,0,0.3), 0 1px 30px rgba(22,214,255,0.05)"
            : "none",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} compact />
          <div className="overflow-x-auto mt-2 pb-0.5">
            <div className="flex items-center gap-3 flex-nowrap min-w-min">
              <LLMSelector />
              <FocusModeBar />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto nx-scrollbar nx-search-scroll px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {turns.slice(0, -1).map((turn) => (
            <div
              key={turn.query}
              className="opacity-60 hover:opacity-80 transition-opacity"
            >
              <AnswerPanel
                result={turn.result}
                query={turn.query}
                onFollowUp={handleSearch}
                isLatest={false}
              />
            </div>
          ))}

          {latestResult && !isLoading && (
            <div>
              {latestResult.sources.length > 0 && (
                <div className="mb-4">
                  <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest mb-3">
                    Sources
                  </p>
                  {/* Source cards with stagger animation */}
                  <SourceCardsStaggered sources={latestResult.sources} />
                </div>
              )}
              <AnswerPanel
                result={latestResult}
                query={latestQuery}
                onFollowUp={handleSearch}
                isLatest
              />
            </div>
          )}

          {isLoading && (
            <div className="space-y-4 nx-fade-in">
              <div>
                <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest mb-3">
                  Searching…
                </p>
                <SourceCardSkeleton />
              </div>
              <TypingIndicator />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
