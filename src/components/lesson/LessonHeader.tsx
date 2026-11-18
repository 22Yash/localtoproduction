import React from 'react';
import { Clock, Shield, Layers } from 'lucide-react';
import { lessons, modules } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';

export function LessonHeader(): React.JSX.Element | null {
  const currentModuleId = useCourseStore((s) => s.currentModuleId);
  const currentLessonId = useCourseStore((s) => s.currentLessonId);

  const module = modules.find((m) => m.id === currentModuleId);
  const lesson = lessons[currentLessonId];

  if (!lesson) return null;

  const stepsCount = lesson.steps.length;
  const stepsLabel = stepsCount === 1 ? '1 step' : `${stepsCount} steps`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="text-[11px] font-mono text-ink/60">
          {module?.title ?? 'Module'} &middot; Lesson {lesson.order} of{' '}
          {module?.lessonIds.length ?? 4}
        </div>
        <h1 className="text-xl sm:text-2xl font-mono font-bold text-ink mt-0.5">
          {lesson.title}
        </h1>
        <p className="text-xs font-mono text-ink/70 mt-1 max-w-2xl leading-relaxed">
          {lesson.subtitle}
        </p>
      </div>

      {/* Metadata Pills */}
      <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-ink rounded-lg bg-surface text-ink">
          <Clock className="w-3.5 h-3.5 text-ink/70" />
          <span>{lesson.minutes} min</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-ink rounded-lg bg-surface text-ink">
          <Shield className="w-3.5 h-3.5 text-ink/70" />
          <span>{lesson.difficulty}</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-ink rounded-lg bg-surface text-ink">
          <Layers className="w-3.5 h-3.5 text-ink/70" />
          <span>{stepsLabel}</span>
        </span>
      </div>
    </div>
  );
}
