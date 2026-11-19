import React from 'react';
import { lessons } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';
import { TelemetryIcon } from '../ui/TelemetryIcon';

export function TelemetryStrip(): React.JSX.Element | null {
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);

  const lesson = lessons[currentLessonId];
  const steps = lesson?.steps ?? [];
  const currentStep = steps[currentStepIndex];

  if (!currentStep) return null;

  return (
    <div className="pt-2 w-full">
      {/* 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {currentStep.telemetry.map((metric) => (
          <div
            key={metric.id}
            className="bg-surface border border-ink rounded-lg p-2 sm:p-2.5 shadow-sm space-y-1"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider text-ink/60 uppercase">
              <TelemetryIcon name={metric.icon} className="w-3.5 h-3.5 text-ink/70" />
              <span className="truncate">{metric.label}</span>
            </div>
            <div className="text-sm font-mono font-bold text-ink truncate">
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
