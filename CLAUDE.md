# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server at localhost:3000
npm run build      # Production build
npm run generate   # Static site generation
npm run preview    # Preview production build
```

No lint or test commands are configured. TypeScript checking is available via `vue-tsc`.

---

## Workflow Orchestration

### 1. Plan Node Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

## Architecture

**Nuxt 3** app with file-based routing, server API routes, and a file-based CMS (`@nuxt/content`).

### Content Layer

Site data lives in `/content/`:

- `/content/settings/hero.json` and `navbar.json` — structured JSON driving the hero section and navigation (editable via the admin dashboard)
- `/content/blog/` and `/content/projects/` — markdown files for blog posts and project pages

Schemas are defined in `content.config.ts` using Zod. The settings collections are read/written through server API routes, not queried directly by pages.

### Server API (`/server/api/admin/`)

Admin routes handle authentication (cookie-based, env var `ADMIN_PASSWORD`) and content CRUD:

- `login.post.ts` / `logout.post.ts` — sets/clears `admin_token` cookie (7-day, strict sameSite)
- `content/[section].get.ts` / `content/[section].put.ts` — read/write hero and navbar JSON files on disk

### Pages & Sections

- `pages/index.vue` — main portfolio page composed of section components
- `pages/admin/index.vue` — login page
- `pages/admin/dashboard.vue` — content editor for hero and navbar settings (815 lines; handles form state, unsaved-change tracking, toast notifications)
- `components/sections/HeroSection.vue` — fetches hero content from API, runs a GSAP timeline (character-by-character name reveal, stat counters, parallax ScrollTrigger), cycles roles every 3s
- `components/sections/HeroCanvas.vue` — Three.js neural-network particle visualization; responsive particle count (55 mobile / 90 desktop), mouse-interactive, color-mode aware

### Styling

UnoCSS (`uno.config.ts`) with an Apple-inspired design system:

- **Shortcuts:** `container-base`, `text-heading-*`, `card-base`, `btn-primary/secondary/ghost`, `nav-link`
- **Colors:** Apple blue (`#0071e3`), surface grays, status colors (green/red/orange)
- **Fonts:** Inter (body), JetBrains Mono, Cormorant Garamond (display) via `@unocss/preset-web-fonts`
- **Custom animations:** `fade-in`, `fade-up`, `float`, `shimmer`, `spin-slow` — ease `cubic-bezier(0.16,1,0.3,1)`

Dark/light mode is managed by `@nuxtjs/color-mode` (class-based, suffix `''`).

### Key Libraries

| Library              | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| GSAP + ScrollTrigger | Complex animation timelines, scroll-driven parallax     |
| Three.js             | Hero canvas particle system                             |
| @vueuse/motion       | Declarative motion directives                           |
| @vueuse/core         | Composable utilities (useScroll, useWindowSize, etc.)   |
| radix-vue            | Headless UI primitives                                  |
| better-sqlite3       | Server-side SQLite (available but not yet heavily used) |
