import { useEffect, useRef, useState } from "react";

interface StreamingTextResult {
  displayedText: string;
  isComplete: boolean;
}

/**
 * Streams text token-by-token using requestAnimationFrame for silky 60fps output.
 * Feels fast like Claude/GPT — 10 chars per frame at ~60fps = ~600 chars/sec.
 */
export function useStreamingText(
  text: string,
  enabled: boolean,
): StreamingTextResult {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const textRef = useRef(text);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    // Reset when text changes
    if (textRef.current !== text) {
      textRef.current = text;
    }

    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    function tick() {
      const currentText = textRef.current;
      const currentIndex = indexRef.current;

      if (currentIndex >= currentText.length) {
        setDisplayedText(currentText);
        setIsComplete(true);
        return;
      }

      // Stream 10 chars per frame — fast, readable, cinematic
      const chunkSize = 10;
      const nextIndex = Math.min(currentIndex + chunkSize, currentText.length);
      indexRef.current = nextIndex;
      setDisplayedText(currentText.slice(0, nextIndex));

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [text, enabled]);

  return { displayedText, isComplete };
}
