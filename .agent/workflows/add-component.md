---
description: Add a new reusable UI or canvas component
---

# Workflow: Add a component

1. Read `.agent/rules/01-architecture.md` and `.agent/rules/02-design-system.md`.
2. Check `src/components/` for an existing component that can be extended. Prefer extending over adding.
3. Create the component in the right folder (`layout`, `lesson`, `canvas`, or `ui`). Props go in a typed `interface`.
4. Use theme tokens only. No raw hex colors and no lesson-specific logic.
5. Support light and dark themes and `prefers-reduced-motion`.
6. Run `npm run build` and `npm run lint`.
7. Summarize the component, its props, and where it is used.
