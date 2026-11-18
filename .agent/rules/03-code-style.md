# Rule: Code style

- TypeScript `strict: true`. No `any`. Use `unknown` and narrow, or write a proper type.
- Function components with hooks only. One component per file, named exports, file name equals component name.
- Props are typed with an `interface`. Keep components small. If a component passes about 150 lines, split it.
- Tailwind for styling. Colors come from theme tokens (`bg-surface`, `text-ink`), never raw hex values in JSX.
- Icons from `lucide-react` only.
- Animations use `framer-motion`. Prefer `variants` driven by step data. Always honor `prefers-reduced-motion`.
- No magic numbers for timing. Put durations and easing in `src/theme/motion.ts`.
- Keep lesson text out of components. Text belongs in `src/data/`.
- After changes, `npm run build` and `npm run lint` must pass.
- Commit messages: short, imperative (`Add NGINX failover lesson data`).
