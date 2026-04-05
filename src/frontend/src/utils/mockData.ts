import type { SearchResult, Source, Thread } from "../backend.d";

export const MOCK_SOURCES: Source[] = [
  {
    title: "Wikipedia",
    url: "https://en.wikipedia.org",
    favicon: "https://www.google.com/s2/favicons?domain=wikipedia.org&sz=32",
    snippet:
      "The free encyclopedia with millions of articles on nearly every topic.",
  },
  {
    title: "GitHub",
    url: "https://github.com",
    favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=32",
    snippet:
      "Where the world builds software — millions of repositories and projects.",
  },
  {
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    favicon:
      "https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=32",
    snippet:
      "Developer Q&A community with answers to millions of coding questions.",
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    favicon: "https://www.google.com/s2/favicons?domain=mozilla.org&sz=32",
    snippet: "Comprehensive resources for developers by Mozilla Foundation.",
  },
  {
    title: "arXiv",
    url: "https://arxiv.org",
    favicon: "https://www.google.com/s2/favicons?domain=arxiv.org&sz=32",
    snippet:
      "Open access to 2M+ scholarly articles in physics, math, CS, and more.",
  },
];

export function generateMockAnswer(query: string): SearchResult {
  return {
    model: "demo",
    answer: `## About "${query}"

This is a **demonstration response** from NexSearch AI. In production, this would be powered by your selected AI model with real-time web search results.

### Key Points

- NexSearch AI combines the power of large language models with live web search
- Answers are grounded in current, real-world sources for accuracy
- You can switch between **GPT-4**, **Gemini**, and **Free** models
- Use **Focus Modes** to narrow results to Academic, Code, or News sources

### Getting Started

To enable real AI-powered search:
1. Set your \`OPENAI_API_KEY\` or \`GEMINI_API_KEY\` environment variable
2. Configure \`BRAVE_API_KEY\` for web search integration
3. Deploy your Motoko backend to the Internet Computer

Once configured, NexSearch AI will deliver real-time answers synthesized from multiple web sources, complete with citations and follow-up suggestions tailored to your query.`,
    sources: MOCK_SOURCES,
    followUps: [
      `How does ${query} work in detail?`,
      `What are the latest advances in ${query}?`,
      `Compare ${query} with alternatives`,
      `Best practices for ${query}`,
    ],
  };
}

const NOW = BigInt(Date.now()) * BigInt(1_000_000);
const HOUR = BigInt(3_600_000_000_000);

export const SAMPLE_THREADS: Thread[] = [
  {
    id: "thread-1",
    title: "What is quantum computing?",
    messages: [
      {
        content: "What is quantum computing?",
        role: "user",
        timestamp: NOW - HOUR * BigInt(2),
      },
    ],
    results: [generateMockAnswer("quantum computing")],
    createdAt: NOW - HOUR * BigInt(2),
    updatedAt: NOW - HOUR * BigInt(2),
  },
  {
    id: "thread-2",
    title: "Explain React hooks",
    messages: [
      {
        content: "Explain React hooks",
        role: "user",
        timestamp: NOW - HOUR * BigInt(5),
      },
    ],
    results: [generateMockAnswer("React hooks")],
    createdAt: NOW - HOUR * BigInt(5),
    updatedAt: NOW - HOUR * BigInt(5),
  },
  {
    id: "thread-3",
    title: "Latest AI research breakthroughs",
    messages: [
      {
        content: "Latest AI research breakthroughs",
        role: "user",
        timestamp: NOW - HOUR * BigInt(24),
      },
    ],
    results: [generateMockAnswer("AI research breakthroughs")],
    createdAt: NOW - HOUR * BigInt(24),
    updatedAt: NOW - HOUR * BigInt(24),
  },
  {
    id: "thread-4",
    title: "How does GPT-4 work?",
    messages: [
      {
        content: "How does GPT-4 work?",
        role: "user",
        timestamp: NOW - HOUR * BigInt(48),
      },
    ],
    results: [generateMockAnswer("GPT-4")],
    createdAt: NOW - HOUR * BigInt(48),
    updatedAt: NOW - HOUR * BigInt(48),
  },
];

export const STARTER_PROMPTS = [
  { label: "What is quantum computing?", icon: "\u26db", category: "Science" },
  {
    label: "Explain React hooks with examples",
    icon: "\u269b",
    category: "Code",
  },
  {
    label: "Latest AI research breakthroughs",
    icon: "U0001f916",
    category: "AI",
  },
  { label: "How does GPT-4 work?", icon: "U0001f9e0", category: "AI" },
  {
    label: "Best practices for TypeScript",
    icon: "U0001f4a1",
    category: "Code",
  },
  {
    label: "Explain neural networks simply",
    icon: "U0001f52c",
    category: "Science",
  },
];
