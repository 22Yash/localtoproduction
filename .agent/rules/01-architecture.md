# Rule: Architecture

## Data-driven lessons
- All modules, lessons, and steps live in typed data under `src/data/`. Types live in `src/types/course.ts`.
- A step is a **full snapshot of the scene**. It is never a diff or a list of animation commands.
- UI components render the current step. They contain no lesson-specific `if` branches. If a lesson needs something new, extend the schema and the generic renderer, then use it from data.

## Folder structure
```
src/
  types/course.ts
  data/
    modules.ts            # module + lesson index (28 lessons)
    lessons/              # one file per lesson, e.g. nginx-load-balancing.ts
  store/useCourseStore.ts # Zustand + persist
  hooks/                  # useKeyboardShortcuts, useStepDiff, useReducedMotion
  theme/                  # CSS variable tokens (light + dark)
  components/
    layout/   TopNav, Sidebar, StepPanel
    lesson/   LessonHeader, TelemetryStrip, StepTimeline
    canvas/   Canvas, IsoNode, Connector, Particle, Crowd, Legend, FormulaCard
    ui/       Pill, Button, Callout, ProgressBar
  App.tsx
```

## State
- One Zustand store. Fields: `currentModuleId`, `currentLessonId`, `currentStepIndex`, `isPlaying`, `speed`, `completedLessons`, `theme`.
- Persist only `completedLessons`, `theme`, `speed`, and the last opened lesson and step.
- Derived values (such as the "What changed" diff) are computed from data, never stored.

## Canvas
- Node positions are in the lesson data (grid coordinates), not hard-coded in components.
- `IsoNode` is one reusable component: it takes `color`, `icon`, `label`, `sublabel`, `status`.
- Traffic particles follow a **deterministic** sequence (a counter), never `Math.random()`. Round robin must visibly go 1, 2, 3, 1, 2, 3.
- Build flat boxes first. Isometric styling is a later, visual-only pass that must not change logic.

## Accessibility and responsiveness
- Respect `prefers-reduced-motion`: replace particle travel with static arrows.
- Below the tablet breakpoint, sidebars become drawers.
- All controls are keyboard reachable. Shortcuts: `←` `→` step, `R` replay, `Space` pause, `Ctrl K` search.
