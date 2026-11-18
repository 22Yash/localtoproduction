# Build plan

Build in this order. Finish and verify each phase before starting the next. Ask before skipping ahead.

## Phase 1: Foundation
1. Create the Vite + React + TypeScript project. Add Tailwind, `framer-motion`, `lucide-react`, and Zustand.
2. Define theme tokens (light and dark CSS variables) and the Tailwind theme.
3. Write `src/types/course.ts` from `docs/DATA_SCHEMA.md`.
4. Write `src/data/modules.ts` with all 7 modules and 28 lesson entries (most are empty placeholders).
5. Write the flagship lesson data: `src/data/lessons/nginx-load-balancing.ts` (6 steps).

## Phase 2: State and layout
6. Zustand store with step navigation, play/pause, speed, completed lessons, theme, and persistence.
7. Keyboard shortcuts hook (`←` `→` `R` `Space` `Ctrl K`).
8. Static 4-zone layout: TopNav, Sidebar, center column, StepPanel. Responsive, with drawers on small screens.

## Phase 3: Lesson UI
9. LessonHeader, TelemetryStrip (4 configurable cards), StepTimeline.
10. StepPanel contents: title, explanation, "Good to know", auto "What changed" diff, Back/Next, keyboard hints, "You'll learn" checklist.

## Phase 4: Canvas
11. Canvas with flat boxes responding to step data (nodes appear, scale, turn red).
12. Connectors and deterministic traffic particles, Replay and Pause/Play.
13. Crowd component, formula card, legend.
14. Isometric styling pass (visual only).

## Phase 5: Content and polish
15. Fill in remaining lessons one at a time using `.agent/workflows/add-lesson.md`.
16. Dark mode polish, accessibility pass, reduced motion.
17. Practice, Design Lab, and Cheatsheets tabs, then search and language selector.

## Definition of done for each phase
- `npm run build` and `npm run lint` pass.
- Works at desktop and mobile widths, in light and dark themes.
- No lesson-specific logic in components.
