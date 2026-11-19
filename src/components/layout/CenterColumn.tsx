import React from 'react';
import { lessons } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';
import { LessonHeader } from '../lesson/LessonHeader';
import { TelemetryStrip } from '../lesson/TelemetryStrip';
import { StepTimeline } from '../lesson/StepTimeline';
import { Canvas } from '../canvas/Canvas';

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

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-bg overflow-y-auto select-none">
      {/* Lesson Header & Telemetry Strip */}
      <section className="p-4 sm:p-6 border-b border-divider bg-surface/50 space-y-3 shrink-0">
        <LessonHeader />
        <TelemetryStrip />
      </section>

      {/* Interactive Canvas Area */}
      <Canvas />

      {/* Step Timeline */}
      <div className="shrink-0">
        <StepTimeline />
      </div>
    </main>
  );
}
