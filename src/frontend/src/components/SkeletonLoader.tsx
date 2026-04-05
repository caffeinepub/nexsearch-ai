export function SourceCardSkeleton() {
  return (
    <div className="flex gap-3" data-ocid="sources.loading_state">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-shrink-0 w-52 h-20 rounded-2xl nx-skeleton"
        />
      ))}
    </div>
  );
}

export function AnswerSkeleton() {
  return (
    <div className="nx-glass rounded-3xl p-6" data-ocid="answer.loading_state">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-xl nx-skeleton" />
        <div className="flex-1">
          <div className="h-4 w-2/3 nx-skeleton mb-1.5" />
          <div className="h-3 w-1/4 nx-skeleton" />
        </div>
      </div>
      <div className="border-t border-[color:var(--nx-border)] mb-4" />
      <div className="space-y-3">
        <div className="h-3.5 w-full nx-skeleton" />
        <div className="h-3.5 w-11/12 nx-skeleton" />
        <div className="h-3.5 w-3/4 nx-skeleton" />
        <div className="h-3.5 w-full nx-skeleton" />
        <div className="h-3.5 w-5/6 nx-skeleton" />
        <div className="h-3.5 w-2/3 nx-skeleton" />
      </div>
      <div className="flex gap-2 mt-6">
        <div className="h-7 w-32 rounded-full nx-skeleton" />
        <div className="h-7 w-40 rounded-full nx-skeleton" />
        <div className="h-7 w-28 rounded-full nx-skeleton" />
      </div>
    </div>
  );
}
