# ShipToProd: Agent Instructions

Read this file first. It is the entry point for understanding the project.

## What this project is

ShipToProd is an interactive, step-by-step web app that teaches MERN developers how to take a `localhost` project into real production infrastructure. It does not hide infrastructure behind a "Deploy" button. It visually simulates:

- Linux VPS setup (SSH, users, UFW firewall)
- PM2 process management
- NGINX reverse proxy, load balancing, and failover
- Redis caching (cache-aside, TTL, invalidation)
- DNS, TLS/HTTPS, and Certbot
- How big companies do it (Docker, Kubernetes, cloud load balancers, CI/CD)

The audience is full-stack/MERN developers who have only run code on localhost.

## Core idea (most important)

**A lesson step is a snapshot of the whole scene, not a list of animation commands.**

Each step is a typed data object describing: which nodes are visible and their status, which flows carry traffic, the four telemetry values, and the explanation text. The canvas reads the current step and renders it. Framer Motion animates between snapshots.

Therefore: **adding a lesson means writing data only. Never add lesson-specific logic to UI components.**

## Tech stack

- React 18+ with TypeScript (strict) and Vite
- Tailwind CSS with theme tokens as CSS variables
- `framer-motion` for transitions and traffic particles
- `lucide-react` for icons
- Zustand with `persist` middleware (localStorage) for progress

## Global state

One store drives every zone: `currentModuleId`, `currentLessonId`, `currentStepIndex`, `isPlaying`, `speed` (1x or 2x), `completedLessons`, `theme` (light or dark).

## Screen layout (4 zones)

- **A. Top bar:** logo, tabs (Learn, Practice, Design Lab, Cheatsheets), search (`Ctrl K`), language selector, dark-mode toggle.
- **B. Left sidebar:** collapsible module tree with `done/total` counters, a green check on completed lessons, a highlighted active lesson, and a progress footer (`x / 28`).
- **C. Center:** lesson header (breadcrumb, title, subtitle, pills), 4 telemetry cards, isometric SVG canvas, bottom step timeline.
- **D. Right sidebar:** `STEP X / Y` and category tag, title, explanation, "Good to know" callout, "What changed" diff, Back/Next buttons, keyboard hints, "You'll learn" checklist.

Full visual rules: `.agent/rules/02-design-system.md`.

## Scope and current phase

- Only the **Learn** tab is built first. Practice, Design Lab, Cheatsheets, search, and the language selector are visible placeholders until later phases.
- First flagship lesson: **4.3 NGINX Load Balancing & Failover** (6 steps).
- Full curriculum: `docs/CURRICULUM.md` (7 modules, 28 lessons).
- Data types: `docs/DATA_SCHEMA.md`.
- Build order: `docs/BUILD_PLAN.md`.

## Rules and workflows

- Always-follow rules live in `.agent/rules/`.
- Repeatable tasks live in `.agent/workflows/` (for example, adding a lesson).
- Technical facts that must be taught correctly: `docs/TECH_ACCURACY.md`. **Check it before writing any lesson text.**

## Commands

```bash
npm install
npm run dev        # Vite dev server
npm run build      # type-check + production build
npm run lint
```

## Do not

- Do not copy text, illustrations, or code from other learning sites. Use original copy and original artwork. Reference screenshots are for layout only.
- Do not hard-code lesson content inside components.
- Do not use `any` in TypeScript.
- Do not add features outside the current phase without asking.
