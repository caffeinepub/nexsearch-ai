import { Search, Sparkles } from "lucide-react";
import type { Thread } from "../backend.d";
import { FocusModeBar } from "../components/FocusModeBar";
import { LLMSelector } from "../components/LLMSelector";
import { SearchBar } from "../components/SearchBar";
import { useCreateThread, useSearch } from "../hooks/useQueries";
import { useSearchStore } from "../store/searchStore";
import { useSettingsStore } from "../store/settingsStore";
import { STARTER_PROMPTS } from "../utils/mockData";

interface HomePageProps {
  onSearchStart: (threadId: string) => void;
}

export function HomePage({ onSearchStart }: HomePageProps) {
  const { setActiveThreadId, addThread } = useSearchStore();
  const { selectedModel, focusMode } = useSettingsStore();
  const searchMutation = useSearch();
  const createThread = useCreateThread();

  async function handleSearch(query: string) {
    let threadId: string;
    try {
      threadId = await createThread.mutateAsync(query);
    } catch {
      threadId = `demo-${Date.now()}`;
    }
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
    setActiveThreadId(threadId);
    onSearchStart(threadId);

    await searchMutation.mutateAsync({
      threadId,
      query,
      model: selectedModel,
      focusMode,
    });
  }

  return (
    <main
      className="flex-1 flex flex-col items-center justify-center px-6 py-16 overflow-y-auto nx-scrollbar"
      data-ocid="home.page"
    >
      <div className="w-full max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="nx-badge-gradient w-14 h-14 rounded-2xl flex items-center justify-center shadow-cyan">
              <Search className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[color:var(--nx-text-white)] mb-3 tracking-tight">
            NexSearch AI
          </h1>
          <p className="text-[color:var(--nx-text-muted)] text-lg">
            Discover knowledge with the power of AI.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-5">
          <SearchBar onSearch={handleSearch} autoFocus />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap mb-12">
          <LLMSelector />
          <FocusModeBar />
          <div className="ml-auto">
            <span className="text-[color:var(--nx-text-muted)] text-xs">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-[color:var(--nx-border)] font-mono text-xs">
                /
              </kbd>{" "}
              to focus
            </span>
          </div>
        </div>

        {/* Starter prompts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[color:var(--nx-cyan)]" />
            <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest">
              Try asking
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3" data-ocid="home.prompts.list">
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={prompt.label}
                onClick={() => handleSearch(prompt.label)}
                data-ocid={`home.prompts.item.${i + 1}`}
                type="button"
                className="nx-source-card text-left p-4 rounded-2xl group transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{prompt.icon}</span>
                  <span className="text-[color:var(--nx-cyan)] text-xs font-medium">
                    {prompt.category}
                  </span>
                </div>
                <p className="text-[color:var(--nx-text-white)] text-sm font-medium leading-snug group-hover:brightness-110">
                  {prompt.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[color:var(--nx-text-muted)] text-xs mt-12">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[color:var(--nx-cyan)] transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </main>
  );
}
