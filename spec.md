# NexSearch AI

## Current State
New project. Only scaffold files exist (empty Motoko actor, no frontend components).

## Requested Changes (Diff)

### Add
- Motoko backend with stable memory for conversation history and user sessions
- HTTP outcalls to OpenAI GPT-4, Google Gemini, and Brave Search APIs
- Backend functions: search (query + model + focus mode), get conversation history, create/switch threads, delete thread, paginate history
- Full frontend application with modular architecture:
  - `components/`: SearchBar, AnswerPanel, SourceCard, FollowUpChips, LLMSelector, FocusModeBar, ConversationThread, SkeletonLoader, ThemeToggle, CopyButton, ShareButton
  - `features/search/`: search logic, hooks
  - `features/history/`: sidebar history list
  - `pages/`: HomePage, SearchPage
  - `hooks/`: useSearch, useConversation, useKeyboardShortcuts, useTheme
  - `store/`: Zustand stores (searchStore, historyStore, settingsStore)
  - `utils/`: markdown renderer, feature flags
- Desktop-first layout: collapsible sidebar (conversation history) + main content panel
- Glassmorphism UI: dark (#0a0a0f) and light mode, purple/indigo gradients, electric blue/cyan accents
- Dark/light mode toggle persisted to localStorage
- Large centered search bar (empty state), transforms to top bar on search
- AI answer panel with streaming-style animated text reveal and markdown rendering
- Source cards with favicon, title, URL, snippet
- Follow-up question chips below answer
- Multi-turn conversation thread in same view
- LLM selector dropdown: GPT-4, Gemini, Free (mock)
- Focus modes: All, Academic, Code, News
- Copy answer + Share button UI
- Keyboard shortcuts: `/` to focus search, `Enter` to search, `Escape` to clear
- Animated skeleton/pulse loading states
- Empty state with 6 suggested starter prompts
- Feature flags object for future phases

### Modify
- Replace empty Motoko actor with full NexSearch backend
- Replace default frontend scaffold with NexSearch UI

### Remove
- Default scaffold placeholder content

## Implementation Plan
1. Select `http-outcalls` Caffeine component (needed for OpenAI, Gemini, Brave API calls)
2. Generate Motoko backend: conversation storage, HTTP outcalls, session management, search orchestration
3. Build frontend:
   - Set up Zustand stores and React Query client
   - Implement layout shell (sidebar + main panel)
   - Build SearchBar with keyboard shortcuts
   - Build AnswerPanel with animated text and markdown
   - Build SourceCard grid
   - Build FollowUpChips
   - Build ConversationThread (multi-turn)
   - Build ConversationHistory sidebar with new/delete
   - Build LLMSelector and FocusModeBar
   - Build loading skeletons and empty state
   - Wire dark/light mode
   - Connect all components to backend APIs via React Query
