import { ChevronLeft, ChevronRight, ExternalLink, Link } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
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

  async function handleCopyUrl(e: React.MouseEvent, url: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Failed to copy URL");
    }
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
            className="group nx-source-card flex-shrink-0 w-52 rounded-2xl p-3.5 cursor-pointer no-underline block relative"
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
            {/* Quick copy URL button - hover reveal */}
            <button
              type="button"
              onClick={(e) => handleCopyUrl(e, source.url)}
              data-ocid={`sources.copy_url_button.${i + 1}`}
              className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-lg bg-[color:var(--nx-surface-solid)] border border-[color:var(--nx-border)] text-[color:var(--nx-text-muted)] hover:text-[color:var(--nx-cyan)] transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Copy URL"
            >
              <Link className="w-3 h-3" />
            </button>
          </a>
        ))}
      </div>
    </div>
  );
}
