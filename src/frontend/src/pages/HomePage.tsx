import { Search, Sparkles } from "lucide-react";
import type { Thread } from "../backend.d";
import { FocusModeBar } from "../components/FocusModeBar";
import { LLMSelector } from "../components/LLMSelector";
import { MobileTopBar } from "../components/MobileTopBar";
import { SearchBar } from "../components/SearchBar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateThread, useSearch } from "../hooks/useQueries";
import { useSearchStore } from "../store/searchStore";
import { useSettingsStore } from "../store/settingsStore";
import { STARTER_PROMPTS } from "../utils/mockData";

interface HomePageProps {
  onSearchStart: (threadId: string) => void;
  onOpenMobileSidebar: () => void;
}

export function HomePage({
  onSearchStart,
  onOpenMobileSidebar,
}: HomePageProps) {
  const { setActiveThreadId, addThread } = useSearchStore();
  const { selectedModel, focusMode } = useSettingsStore();
  const searchMutation = useSearch();
  const createThread = useCreateThread();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";
  const truncatedPrincipal =
    principal.length > 10
      ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
      : principal;

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
    <div className="flex flex-col h-full">
      {/* Mobile top bar */}
      <MobileTopBar onOpenSidebar={onOpenMobileSidebar} />

      <main
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16 overflow-y-auto nx-scrollbar pb-20 md:pb-10 relative overflow-hidden"
        data-ocid="home.page"
      >
        {/* Ambient orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="nx-orb absolute rounded-full"
            style={{
              width: "520px",
              height: "520px",
              top: "-120px",
              left: "-180px",
              background:
                "radial-gradient(circle, rgba(22,214,255,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
              animationDelay: "0s",
            }}
          />
          <div
            className="nx-orb absolute rounded-full"
            style={{
              width: "400px",
              height: "400px",
              bottom: "-60px",
              right: "-100px",
              background:
                "radial-gradient(circle, rgba(91,127,255,0.14) 0%, transparent 70%)",
              filter: "blur(50px)",
              animationDelay: "2.5s",
            }}
          />
          <div
            className="nx-orb absolute rounded-full"
            style={{
              width: "300px",
              height: "300px",
              top: "30%",
              right: "10%",
              background:
                "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
              filter: "blur(36px)",
              animationDelay: "5s",
            }}
          />
        </div>

        <div className="w-full max-w-3xl relative z-10">
          {/* Hero */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center mb-4 sm:mb-5">
              <div className="nx-badge-gradient w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-cyan">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>

            <h1
              className="text-3xl sm:text-5xl font-bold mb-3 tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #16d6ff 0%, #ffffff 50%, #a78bfa 100%)",
              }}
            >
              NexSearch AI
            </h1>

            {isAuthenticated ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-[color:var(--nx-text-muted)] text-base sm:text-lg">
                  Welcome back,{" "}
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: "var(--nx-cyan)" }}
                  >
                    {truncatedPrincipal}
                  </span>
                </p>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(22,214,255,0.08)",
                    border: "1px solid rgba(22,214,255,0.2)",
                    color: "var(--nx-cyan)",
                  }}
                  data-ocid="home.auth_badge"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Signed in via Internet Identity
                </div>
              </div>
            ) : (
              <p className="text-[color:var(--nx-text-muted)] text-base sm:text-lg">
                Discover knowledge with the power of AI.
              </p>
            )}

            {/* Internet Computer badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs mt-3"
              style={{
                background: "rgba(91,127,255,0.08)",
                border: "1px solid rgba(91,127,255,0.2)",
                color: "rgba(168,178,255,0.9)",
              }}
            >
              <span className="text-[10px]">⚡</span>
              Verified by Internet Computer
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-4 sm:mb-5">
            <SearchBar onSearch={handleSearch} autoFocus />
          </div>

          {/* Controls */}
          <div className="overflow-x-auto pb-1 mb-10 sm:mb-12">
            <div className="flex items-center gap-3 flex-nowrap min-w-min">
              <LLMSelector />
              <FocusModeBar />
              <div className="ml-auto flex-shrink-0">
                <span className="text-[color:var(--nx-text-muted)] text-xs">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-[color:var(--nx-border)] font-mono text-xs">
                    /
                  </kbd>{" "}
                  to focus
                </span>
              </div>
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
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              data-ocid="home.prompts.list"
            >
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSearch(prompt.label)}
                  data-ocid={`home.prompts.item.${i + 1}`}
                  type="button"
                  className="nx-source-card text-left p-4 rounded-2xl group transition-all duration-200 min-h-[44px]"
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
          <p className="text-center text-[color:var(--nx-text-muted)] text-xs mt-10 sm:mt-12">
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
    </div>
  );
}
