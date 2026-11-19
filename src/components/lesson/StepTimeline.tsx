import React from 'react';
import { lessons } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';

export function StepTimeline(): React.JSX.Element | null {
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);
  const goToStep = useCourseStore((s) => s.goToStep);

  const lesson = lessons[currentLessonId];
  const steps = lesson?.steps ?? [];

  if (steps.length === 0) return null;

  return (
    <section className="border-t border-divider p-4 sm:p-5 bg-surface/70">
      <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-ink/60 mb-2">
        Step Timeline ({currentStepIndex + 1} of {steps.length})
      </div>
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(idx)}
              className="flex-1 min-w-[70px] flex flex-col items-center gap-1 group transition-all"
            >
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-accent text-ink border-ink shadow-hard scale-105'
                    : isCompleted
                    ? 'bg-ink text-surface border-ink'
                    : 'bg-surface text-ink/50 border-divider group-hover:border-ink'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-[10px] font-mono text-center leading-tight line-clamp-2 max-w-[95px] px-0.5 ${
                  isActive ? 'font-bold text-ink' : 'text-ink/60'
                }`}
              >
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
