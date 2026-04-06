import { Key, Loader2, Plus, Settings, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Thread } from "../../backend.d";
import { ThemeToggle } from "../../components/ThemeToggle";
import { UserProfilePanel } from "../../components/UserProfilePanel";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useDeleteThread, useGetMyThreads } from "../../hooks/useQueries";
import { useSearchStore } from "../../store/searchStore";
import { SAMPLE_THREADS } from "../../utils/mockData";
import { relativeTime } from "../../utils/time";

interface SidebarProps {
  onNewSearch: () => void;
  onSelectThread: (thread: Thread) => void;
  onClose?: () => void;
}

export function Sidebar({
  onNewSearch,
  onSelectThread,
  onClose,
}: SidebarProps) {
  const { activeThreadId } = useSearchStore();
  const { data: fetchedThreads, isLoading } = useGetMyThreads();
  const deleteThread = useDeleteThread();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sessionStart] = useState(() => new Date());

  const {
    identity,
    login,
    isLoggingIn,
    isInitializing,
    isLoginIdle,
    isLoginError,
  } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";
  const truncatedPrincipal =
    principal.length > 10
      ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
      : principal;
  const avatarInitials = principal.slice(0, 2).toUpperCase();

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

  function handleSelectThread(thread: Thread) {
    onSelectThread(thread);
    onClose?.();
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
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              data-ocid="sidebar.close.button"
              className="flex items-center justify-center w-9 h-9 rounded-xl text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] hover:bg-white/10 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
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
                    : "hover:bg-white/5 hover:border-l-2 hover:border-[color:var(--nx-cyan-dim)] hover:pl-[calc(0.75rem-2px)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectThread(thread)}
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

      {/* Bottom — Auth section */}
      <div className="p-5 pt-4 border-t border-[color:var(--nx-border)] relative">
        {/* Unauthenticated: show login */}
        {(isLoginIdle || isLoginError) && !isAuthenticated && (
          <>
            <button
              type="button"
              className="flex items-center gap-2 flex-1 text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] transition-colors min-h-[44px] mb-3"
              data-ocid="sidebar.settings.button"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button
              type="button"
              onClick={login}
              data-ocid="sidebar.login_button"
              className="w-full flex items-center justify-center gap-2.5 h-10 rounded-xl font-medium text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "rgba(22,214,255,0.12)",
                border: "1px solid rgba(22,214,255,0.3)",
                color: "var(--nx-cyan)",
              }}
            >
              <Key className="w-3.5 h-3.5" />
              Login with Internet Identity
            </button>
            {isLoginError && (
              <p className="text-red-400 text-xs text-center mt-2">
                Login failed. Please try again.
              </p>
            )}
          </>
        )}

        {/* Loading state */}
        {(isLoggingIn || isInitializing) && (
          <div
            className="flex items-center justify-center gap-2 h-10 text-[color:var(--nx-text-muted)]"
            data-ocid="sidebar.login.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              {isInitializing ? "Restoring session…" : "Signing in…"}
            </span>
          </div>
        )}

        {/* Authenticated */}
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 flex-1 text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] transition-colors min-h-[44px]"
              data-ocid="sidebar.settings.button"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>

            {/* Avatar button — opens profile panel */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                data-ocid="sidebar.user_avatar.button"
                className="flex items-center gap-2 group"
                aria-label="User profile"
              >
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #16d6ff 0%, #5b7fff 50%, #a855f7 100%)",
                    }}
                  >
                    {avatarInitials}
                  </div>
                  {/* Green pulse dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b1020] nx-pulse-dot" />
                </div>
                <span className="text-[color:var(--nx-text-muted)] text-xs font-mono group-hover:text-[color:var(--nx-text-white)] transition-colors">
                  {truncatedPrincipal}
                </span>
              </button>

              {isProfileOpen && (
                <UserProfilePanel
                  onClose={() => setIsProfileOpen(false)}
                  sessionStart={sessionStart}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
