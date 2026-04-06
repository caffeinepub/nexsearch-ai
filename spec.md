# NexSearch AI — Phase 3

## Current State
- Glassmorphism dark/light UI, desktop-first with mobile-responsive layout
- Conversation threads stored per-principal in Motoko backend
- Multi-LLM selector (GPT-4, Gemini, Free/Demo)
- Focus modes, follow-up chips, bookmarks, confidence badges
- Mobile bottom nav, settings sheet, typing indicator
- Demo mode with mock data when no API keys present
- `useInternetIdentity` hook exists but NOT wired into the UI (user shows as "Guest" always)
- No streaming: full answer appears at once after loading

## Requested Changes (Diff)

### Add
- **Internet Identity authentication** — wire `useInternetIdentity` into App; show Login button in sidebar bottom + home hero; authenticated users see their Principal, guest users see a prompt to sign in. Auth state persists across reloads.
- **User Profile Panel** — clicking the user avatar in the sidebar opens a profile panel showing Principal (truncated + copyable), session info, sign out button, and a "Pro" badge placeholder.
- **Streaming answer animation** — token-by-token typewriter effect for AI answer reveal using a simulated streaming engine (RAF + batched character injection). Architecture is SSE-ready (streaming hook abstracted for real SSE swap). Real-time word-by-word reveal with cursor blink.
- **World-class Chrome-level visual overhaul** — premium design pass:
  - Sidebar: frosted glass depth layers, hover states with subtle glow, animated active state with left accent bar
  - Search result page: cinematic answer header with radial gradient halo, animated source cards stagger-in, answer text with line-by-line reveal
  - HomePage: large animated hero with floating orb background, gradient wordmark, animated search bar focus ring
  - Depth: multi-layered glassmorphism with 3-stop backdrop blurs, ambient light bleed at top of page
  - Micro-interactions: search icon spin on submit, source card 3D tilt hover, smooth thread transition
  - Typography: tighter tracking on headings, larger contrast for readable body text
  - New `nx-stream-cursor` blinking cursor class
  - Premium scrollbar with fade edges
  - Ambient glow animations behind hero section

### Modify
- `Sidebar.tsx` — wire `useInternetIdentity`, show login/logout button in bottom area, show truncated Principal when authenticated, animate avatar with auth state
- `App.tsx` — wrap with `InternetIdentityProvider`, pass identity to backend actor
- `useActor.ts` / `backend.ts` — use authenticated identity when available
- `AnswerPanel.tsx` — replace instant render with streaming typewriter hook
- `HomePage.tsx` — hero redesign with ambient animation, auth-aware greeting
- `index.css` — add streaming cursor, ambient glow keyframes, tilt card CSS vars, premium depth tokens
- `SearchPage.tsx` — animated source card stagger, cinematic header

### Remove
- Hard-coded "Guest" string in Sidebar bottom (replaced by dynamic auth state)

## Implementation Plan
1. Wire `InternetIdentityProvider` into `main.tsx` or `App.tsx`
2. Create `useStreamingText` hook — takes full string, returns streamed partial + `isStreaming` bool; simulates token streaming via RAF/setInterval
3. Update `AnswerPanel.tsx` to use `useStreamingText` hook for answer content
4. Update `Sidebar.tsx` — connect `useInternetIdentity`, replace Guest section with auth-aware UI
5. Create `UserProfilePanel.tsx` — Principal display, copy, session, sign out
6. Visual overhaul: update `index.css` with new animation tokens, ambient glow, stream cursor
7. Update `HomePage.tsx` — animated hero, floating orb, gradient wordmark, auth greeting
8. Update `SearchPage.tsx` — stagger-in source cards, cinematic header gradient
9. Validate and build
