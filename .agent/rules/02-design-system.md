# Rule: Design system ("Warm Technical Blueprint")

Layout reference: a screenshot of a similar learning site was shared for **layout only**. Use our own copy, lesson text, illustrations, and icons.

## Colors (define as CSS variables, swap them for dark mode)
| Token | Light value | Use |
|---|---|---|
| `--bg` | `#F6F4EC` | App background (warm paper) |
| `--surface` | `#FCFBF7` | Cards, sidebars, canvas |
| `--tint` | `#EBE7D9` | Hover and active tint |
| `--ink` | `#222222` | Text and 1px borders |
| `--divider` | `#D5D0C3` | Subtle dividers |
| `--accent` | sage green (`#CBE4B4` family) | Active tab, active lesson, Next button |
| `--callout-bg` / `--callout-border` | soft green | "Good to know" card |

Decision: the "Good to know" callout is **soft green**, matching the reference layout. Do not mix with the earlier yellow idea.

### Node colors
- NGINX / load balancer: `#CBE4B4`
- Node.js / PM2 app servers: `#B8D8F8`
- Redis cache: `#F7D9A8`
- MongoDB: `#D8C8F4`
- Crashed node: red tint with an `X` icon

### Traffic particle colors
- Request `#22C55E`, response `#3B82F6`, cache miss / DB query `#F59E0B`, invalidate / write `#EF4444`

## Typography
- **Monospace almost everywhere** (JetBrains Mono or Space Mono), including headings, body text, pills, and metrics. This gives the technical feel. If readability suffers on long paragraphs, use Inter for the step explanation only.

## Components
- Cards, pills, and nodes: `1px solid var(--ink)`, `rounded-lg` or `rounded-xl`.
- Active tab, active lesson, selected pills, and the Next button: sage fill plus a hard offset shadow `shadow-[2px_2px_0px_#222222]`.
- Pills carry an icon plus text (`14 min`, `Beginner`, `10 steps`). The category tag (`ARCHITECTURE`, `CONFIG`, `FAILOVER`, `TECHNIQUE`) sits at the top right of the right panel.
- Telemetry strip: **four cards per lesson, configurable**. Each has `label`, `value`, `icon`. A value can be text (for example `fresh`), not only a number.
- Canvas: faint diamond grid floor, chunky hexagonal isometric blocks with icon, bold label, small sublabel. Users shown as a crowd on a platform with a pill such as `20,000 users`. Small pills on nodes (for example a DB CPU bar with a percentage).
- Arrows: thick and dark, with colored dots traveling along them. Legend sits at the bottom left of the canvas.
- Formula card: monospace table where the **final row is highlighted** to show the current result.
- Step timeline: numbered circles on a line. Completed circles are filled, the current one is green, and short labels sit underneath. Clicking a circle jumps to that step.
- Keyboard hints sit under the Next button.

## Dark mode
- A toggle in the top bar swaps the CSS variables only. No component should hard-code a color.
