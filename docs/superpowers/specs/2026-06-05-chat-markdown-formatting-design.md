# Chat Markdown Formatting & Prompt Polish

**Date:** 2026-06-05  
**Status:** Approved → Implementation

## Problem

The AI chatbot returns plain text that renders without structure. Markdown syntax (bold, bullets, code) appears as raw characters. The system prompt gives no formatting instructions or persona guidance, so responses feel generic and undersell Ernest's profile.

## Goals

1. Render AI responses as formatted markdown (bold, bullets, inline code, headers).
2. Rewrite the system prompt to produce confident, professional, specific answers in Ernest's voice.
3. Keep all existing quality gates passing (lint, unit tests, Playwright).

## Architecture

**Backend (`backend/app/rag/prompt.py`):**  
Expand `SYSTEM_PROMPT` with explicit markdown-formatting rules and tone/voice guidance. The `build_messages` function and its signature are unchanged — only the prompt string changes, so all existing tests still pass.

**Frontend (`frontend/src/components/ChatWidget.tsx`):**  
Replace the raw `{msg.content}` text node in AI message bubbles with a `react-markdown` renderer. User messages stay as plain text. Style markdown elements via the `components` prop using existing Tailwind color tokens (no new CSS files). Install `react-markdown` + `remark-gfm` as production dependencies.

## System Prompt Design

Voice:
- Third-person always
- Confident and specific — cite real projects, technologies, outcomes from context
- Warm and approachable, never boastful
- No filler ("Great question!", "Certainly!")

Formatting rules instructed:
- `**bold**` for key technologies, companies, outcomes
- Bullet lists for multiple items/skills
- `` `inline code` `` for specific tools, APIs, technical terms
- `##` headers only for responses with 3+ distinct topics
- Most answers: 3–6 bullets or 2–3 short paragraphs

## Markdown Styling (dark theme)

| Element | Classes |
|---|---|
| `p` | `mb-2 last:mb-0 leading-relaxed` |
| `ul` | `list-disc list-outside pl-4 space-y-1 my-2` |
| `ol` | `list-decimal list-outside pl-4 space-y-1 my-2` |
| `li` | `leading-relaxed` |
| `strong` | `font-semibold text-slate-100` |
| `code` (inline) | `bg-slate-700 rounded px-1 py-0.5 text-xs font-mono text-cyan-300` |
| `pre` + `code` | `bg-slate-700 rounded p-2 my-2 overflow-x-auto text-xs font-mono block` |
| `h2`, `h3` | `font-semibold text-slate-100 mt-3 mb-1 text-sm` |
| `a` | `text-cyan-400 hover:underline` |

## Testing

- Backend: existing `test_prompt.py` passes unchanged (prompt text still included in system string).
- Frontend: existing `useChat.test.ts` passes unchanged (hook logic untouched).
- Playwright: existing e2e suite passes.
- Manual browser: open chat panel, send a question, verify markdown renders with bullets/bold.
