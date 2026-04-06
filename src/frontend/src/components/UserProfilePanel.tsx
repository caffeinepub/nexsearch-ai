import { Check, Copy, LogOut, Shield, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface UserProfilePanelProps {
  onClose: () => void;
  sessionStart: Date;
}

function formatDuration(start: Date): string {
  const ms = Date.now() - start.getTime();
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return "Just now";
}

export function UserProfilePanel({
  onClose,
  sessionStart,
}: UserProfilePanelProps) {
  const { identity, clear } = useInternetIdentity();
  const [copied, setCopied] = useState(false);
  const [duration, setDuration] = useState(formatDuration(sessionStart));
  const panelRef = useRef<HTMLDivElement>(null);

  const principal = identity?.getPrincipal().toString() ?? "";

  // Live session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(formatDuration(sessionStart));
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  async function handleCopyPrincipal() {
    try {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      toast.success("Principal ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  function handleSignOut() {
    clear();
    onClose();
    toast.success("Signed out");
  }

  const initials = principal.slice(0, 2).toUpperCase();

  return (
    <div
      ref={panelRef}
      className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl border border-[color:var(--nx-border)] shadow-2xl z-50"
      style={{
        background: "rgba(11, 16, 32, 0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(22,214,255,0.08)",
      }}
      data-ocid="user_profile.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[color:var(--nx-border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #16d6ff 0%, #5b7fff 50%, #a855f7 100%)",
            }}
          >
            {initials}
          </div>
          <div>
            <p className="text-[color:var(--nx-text-white)] text-sm font-semibold">
              Internet Identity
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span className="text-emerald-400 text-xs">Authenticated</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-ocid="user_profile.close_button"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] hover:bg-white/10 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Principal */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Shield className="w-3 h-3 text-[color:var(--nx-cyan)]" />
          <span className="text-[color:var(--nx-text-muted)] text-xs font-medium uppercase tracking-wider">
            Principal ID
          </span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-[color:var(--nx-border)]">
          <code className="flex-1 font-mono text-[10px] text-[color:var(--nx-text)] break-all leading-relaxed">
            {principal}
          </code>
          <button
            type="button"
            onClick={handleCopyPrincipal}
            data-ocid="user_profile.copy_button"
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{
              background: copied
                ? "rgba(22,214,255,0.2)"
                : "rgba(22,214,255,0.08)",
              border: "1px solid rgba(22,214,255,0.25)",
              color: "var(--nx-cyan)",
            }}
            aria-label="Copy principal ID"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Session info */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-[color:var(--nx-border)]">
          <span className="text-[color:var(--nx-text-muted)] text-xs">
            Session duration
          </span>
          <span className="text-[color:var(--nx-text-white)] text-xs font-mono">
            {duration}
          </span>
        </div>
      </div>

      {/* Sign out */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleSignOut}
          data-ocid="user_profile.sign_out_button"
          className="w-full flex items-center justify-center gap-2 h-9 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(239,68,68,0.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(239,68,68,0.1)";
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
