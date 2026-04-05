import { Plus, Settings, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import type { Thread } from "../../backend.d";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useDeleteThread, useGetMyThreads } from "../../hooks/useQueries";
import { useSearchStore } from "../../store/searchStore";
import { SAMPLE_THREADS } from "../../utils/mockData";
import { relativeTime } from "../../utils/time";

interface SidebarProps {
  onNewSearch: () => void;
  onSelectThread: (thread: Thread) => void;
}

export function Sidebar({ onNewSearch, onSelectThread }: SidebarProps) {
  const { activeThreadId } = useSearchStore();
  const { data: fetchedThreads, isLoading } = useGetMyThreads();
  const deleteThread = useDeleteThread();

  const threads =
    fetchedThreads && fetchedThreads.length > 0
      ? fetchedThreads
      : SAMPLE_THREADS;

  async function handleDelete(e: React.MouseEvent, threadId: string) {
    e.stopPropagation();
    try {
      await deleteThread.mutateAsync(threadId);
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <aside
      className="nx-sidebar w-[300px] flex-shrink-0 h-screen flex flex-col overflow-hidden"
      data-ocid="sidebar.panel"
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="nx-badge-gradient w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base">N</span>
          </div>
          <span className="text-[color:var(--nx-text-white)] font-semibold text-lg tracking-tight">
            NexSearch AI
          </span>
        </div>
        <ThemeToggle />
      </div>

      {/* New Search */}
      <div className="px-5 mb-5">
        <button
          onClick={onNewSearch}
          data-ocid="sidebar.new_search_button"
          type="button"
          className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-cyan"
          style={{ background: "var(--nx-cyan)", color: "#070a14" }}
        >
          <Plus className="w-4 h-4" />
          New Search
        </button>
      </div>

      {/* Conversations list */}
      <div className="px-5 flex-1 overflow-hidden flex flex-col min-h-0">
        <p className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-widest mb-3">
          Recent
        </p>

        <div className="flex-1 overflow-y-auto nx-scrollbar -mx-1 px-1 space-y-0.5">
          {isLoading && (
            <div className="space-y-2 py-2" data-ocid="sidebar.loading_state">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-xl nx-skeleton" />
              ))}
            </div>
          )}

          {!isLoading &&
            threads.map((thread, i) => (
              <div
                key={thread.id}
                className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                  activeThreadId === thread.id
                    ? "nx-sidebar-item-active"
                    : "hover:bg-white/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectThread(thread)}
                  data-ocid={`sidebar.item.${i + 1}`}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-[color:var(--nx-text-white)] text-sm font-medium truncate leading-tight">
                    {thread.title}
                  </p>
                  <p className="text-[color:var(--nx-text-muted)] text-xs mt-0.5">
                    {relativeTime(thread.updatedAt)}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, thread.id)}
                  data-ocid={`sidebar.delete_button.${i + 1}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-[color:var(--nx-text-muted)]"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-5 pt-4 border-t border-[color:var(--nx-border)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 flex-1 text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] transition-colors"
            data-ocid="sidebar.settings.button"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[color:var(--nx-text-muted)] text-sm">
              Guest
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
