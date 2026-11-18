import React from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';
import { lessons } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';
import { TelemetryIcon } from '../ui/TelemetryIcon';

export function TelemetryStrip(): React.JSX.Element | null {
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);
  const isPlaying = useCourseStore((s) => s.isPlaying);
  const speed = useCourseStore((s) => s.speed);
  const togglePlay = useCourseStore((s) => s.togglePlay);
  const replay = useCourseStore((s) => s.replay);
  const setSpeed = useCourseStore((s) => s.setSpeed);

  const lesson = lessons[currentLessonId];
  const steps = lesson?.steps ?? [];
  const currentStep = steps[currentStepIndex];

  if (!currentStep) return null;

  return (
    <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
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

      {/* Simulation Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-mono font-semibold border border-ink rounded-lg bg-surface hover:bg-tint text-ink transition-colors"
          title="Replay from step 1 (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Replay</span>
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-mono font-semibold border border-ink rounded-lg bg-surface hover:bg-tint text-ink transition-colors"
          title="Toggle Play / Pause (Space)"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSpeed(speed === 1 ? 2 : 1)}
          className="px-2 py-2 text-xs font-mono font-semibold border border-ink rounded-lg bg-surface hover:bg-tint text-ink"
          title="Toggle speed"
        >
          {speed}x
        </button>
      </div>
    </div>
  );
}
