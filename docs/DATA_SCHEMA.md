# Data schema (`src/types/course.ts`)

This is the intended shape. Implement it in TypeScript and keep it strict.

```ts
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type StepCategory = 'ARCHITECTURE' | 'CONFIG' | 'FAILOVER' | 'TECHNIQUE';
export type NodeKind = 'users' | 'nginx' | 'node' | 'redis' | 'mongo' | 'cdn' | 'docker' | 'k8s' | 'custom';
export type NodeStatus = 'hidden' | 'active' | 'overloaded' | 'crashed' | 'recovering';
export type FlowType = 'request' | 'response' | 'cacheMiss' | 'cacheFill' | 'invalidate' | 'blocked';

export interface SceneNode {
  id: string;
  kind: NodeKind;
  label: string;            // "App Server"
  sublabel?: string;        // "port 5001"
  position: { x: number; y: number }; // grid coordinates
  status: NodeStatus;
  badge?: string;           // small pill text, e.g. "8%"
}

export interface Flow {
  id: string;
  from: string;             // node id
  to: string;               // node id
  type: FlowType;
  active: boolean;
  sequence?: number;        // deterministic order for round robin
}

export interface TelemetryMetric {
  id: string;
  label: string;            // "P95 LATENCY"
  value: string;            // "180 ms" or "fresh" (text allowed)
  numeric?: number;         // used by the auto "What changed" diff
  icon: string;             // lucide icon name
}

export interface FormulaRow {
  label: string;
  expression: string;
  result?: string;
  highlighted?: boolean;    // final row highlight
}

export interface Step {
  id: string;
  shortLabel: string;       // timeline label, e.g. "DB melts"
  title: string;
  category: StepCategory;
  explanation: string[];    // max 2 short paragraphs
  goodToKnow: string;
  nodes: SceneNode[];       // FULL snapshot, not a diff
  flows: Flow[];
  telemetry: [TelemetryMetric, TelemetryMetric, TelemetryMetric, TelemetryMetric];
  crowd?: { users: number };            // drives the people platform and pill
  formula?: { title: string; rows: FormulaRow[] };
  learned: string;          // checklist item unlocked at this step
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  subtitle: string;
  minutes: number;
  difficulty: Difficulty;
  whyItMatters: string;
  realWorldEquivalent: string;
  steps: Step[];
}

export interface Module {
  id: string;
  order: number;
  title: string;
  lessonIds: string[];
}
```

## Rules
- `nodes` and `flows` in each step are a complete snapshot of the scene.
- The "What changed" card is **computed** by comparing `telemetry` of step N with step N-1. Do not hand-write it.
- `learned` entries accumulate in the "You'll learn" checklist as the learner moves through steps.
- Telemetry always has exactly four cards, but which four is chosen per lesson.
