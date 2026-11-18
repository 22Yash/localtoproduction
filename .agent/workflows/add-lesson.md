---
description: Add a new lesson to ShipToProd using data only
---

# Workflow: Add a lesson

1. Read `docs/CURRICULUM.md` and find the lesson. Confirm its module, order, and title.
2. Read `docs/TECH_ACCURACY.md` for every technology the lesson touches.
3. Read an existing lesson in `src/data/lessons/` as the pattern to follow.
4. Create `src/data/lessons/<lesson-slug>.ts` that exports a `Lesson` (see `docs/DATA_SCHEMA.md`):
   - metadata: title, subtitle, minutes, difficulty, "Why this matters" line
   - 6 to 10 steps, each a **full scene snapshot** (nodes, flows, telemetry, text, category tag, optional formula card)
   - a "Good to know" tip per step, and a "Real-world equivalent" tip for the lesson
   - a "You'll learn" checklist
5. Register the lesson in `src/data/modules.ts`.
6. Do **not** edit UI components. If the lesson cannot be expressed in the current schema, stop, propose a schema extension, and ask before changing it.
7. Run `npm run build` and `npm run lint`. Open the lesson in `npm run dev` and step through it with the keyboard.
8. Summarize what you added and list any `TODO(verify)` items.
