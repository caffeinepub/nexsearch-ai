export function TypingIndicator() {
  return (
    <div
      className="nx-glass rounded-3xl p-6 nx-fade-in"
      data-ocid="answer.loading_state"
    >
      <div className="flex items-center gap-3">
        <div className="nx-badge-gradient w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">N</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[color:var(--nx-text-muted)] text-sm">
            NexSearch is thinking
          </span>
          <div className="flex items-center gap-1">
            <span
              className="nx-typing-dot w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--nx-cyan)",
                animationDelay: "0ms",
              }}
            />
            <span
              className="nx-typing-dot w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--nx-cyan)",
                animationDelay: "160ms",
              }}
            />
            <span
              className="nx-typing-dot w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--nx-cyan)",
                animationDelay: "320ms",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
