import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import type { Source } from "../backend.d";

interface SourceCardsProps {
  sources: Source[];
}

export function SourceCards({ sources }: SourceCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(sources.length > 3);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative nx-fade-in" data-ocid="sources.list">
      {canScrollLeft && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--nx-bg)] to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scroll("left")}
            data-ocid="sources.pagination_prev"
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full border border-[color:var(--nx-border)] text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] transition-all duration-200"
            style={{ background: "var(--nx-surface-solid)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </>
      )}

      {canScrollRight && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--nx-bg)] to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scroll("right")}
            data-ocid="sources.pagination_next"
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full border border-[color:var(--nx-border)] text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-text-white)] transition-all duration-200"
            style={{ background: "var(--nx-surface-solid)" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto pb-1 nx-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {sources.map((source, i) => (
          <a
            key={`${source.url}-${i}`}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`sources.item.${i + 1}`}
            className="nx-source-card flex-shrink-0 w-52 rounded-2xl p-3.5 cursor-pointer no-underline block"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <img
                src={source.favicon}
                alt=""
                className="w-4 h-4 rounded flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[color:var(--nx-text-white)] text-sm font-semibold truncate">
                {source.title}
              </span>
              <ExternalLink className="w-3 h-3 ml-auto flex-shrink-0 opacity-40" />
            </div>
            <p className="text-[color:var(--nx-text-muted)] text-xs leading-relaxed line-clamp-2">
              {source.snippet}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
