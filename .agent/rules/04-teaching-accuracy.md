# Rule: Teaching accuracy

This app teaches real infrastructure. Wrong facts here are worse than missing features.

- Read `docs/TECH_ACCURACY.md` before writing or editing any lesson text, config snippet, or command.
- Every command and config shown in a lesson must be real and runnable on Ubuntu LTS.
- Every lesson ends with a **"Real-world equivalent"** tip, for example: "At scale, Kubernetes does this job." Be honest that a single VPS is a single point of failure.
- Each lesson opens with a one-line **"Why this matters"** that states the problem before the solution.
- Explanations are two short paragraphs at most. The "Good to know" tip is one practical senior-engineer insight, not a repeat of the explanation.
- Telemetry numbers are illustrative simulations. Label them as such where a learner could mistake them for benchmarks.
- When unsure about a technical claim, mark it in a `// TODO(verify):` comment and mention it in your summary. Do not guess.
