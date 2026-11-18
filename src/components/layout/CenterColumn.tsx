import React from 'react';
import { Users, Box } from 'lucide-react';
import { lessons } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';
import { LessonHeader } from '../lesson/LessonHeader';
import { TelemetryStrip } from '../lesson/TelemetryStrip';
import { StepTimeline } from '../lesson/StepTimeline';

export function CenterColumn(): React.JSX.Element {
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);

  const lesson = lessons[currentLessonId];
  const steps = lesson?.steps ?? [];
  const currentStep = steps[currentStepIndex];

  if (!lesson || !currentStep) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center font-mono text-xs text-ink/60">
        Select a lesson to begin.
      </main>
    );
  }

  const activeNodesCount = currentStep.nodes.filter((n) => n.status !== 'hidden').length;

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-bg overflow-y-auto select-none">
      {/* Lesson Header & Telemetry Strip */}
      <section className="p-4 sm:p-6 border-b border-divider bg-surface/50 space-y-3">
        <LessonHeader />
        <TelemetryStrip />
      </section>

      {/* Canvas Area Placeholder (Phase 4) */}
      <section className="flex-1 p-4 sm:p-6 flex flex-col justify-center items-center relative min-h-[360px]">
        <div className="w-full h-full min-h-[320px] rounded-xl border border-dashed border-divider bg-surface/30 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {currentStep.crowd && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono border border-ink rounded bg-surface text-ink shadow-hard-sm">
                <Users className="w-3 h-3 text-ink/70" />
                <span>{currentStep.crowd.users.toLocaleString()} users</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono border border-divider rounded bg-bg text-ink/70">
              <Box className="w-3 h-3" />
              <span>{activeNodesCount} nodes active</span>
            </span>
          </div>

          <div className="max-w-md space-y-2 select-none">
            <div className="w-12 h-12 rounded-xl border border-ink bg-accent mx-auto flex items-center justify-center shadow-hard">
              <Box className="w-6 h-6 text-ink" />
            </div>
            <h3 className="text-sm font-mono font-bold text-ink">
              Canvas &amp; Traffic Simulation Placeholder
            </h3>
            <p className="text-xs font-mono text-ink/60">
              In Phase 4, the interactive isometric SVG canvas, animated nodes, connectors, and deterministic traffic particles will render here.
            </p>
          </div>

          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-ink/40">
            Current Scene: {currentStep.id}
          </div>
        </div>
      </section>

      {/* Step Timeline */}
      <StepTimeline />
    </main>
  );
}
