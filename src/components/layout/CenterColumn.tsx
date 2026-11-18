import React from 'react';
import {
  Clock,
  Shield,
  Layers,
  RotateCcw,
  Play,
  Pause,
  Users,
  Box,
} from 'lucide-react';
import { lessons, modules } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';
import { TelemetryIcon } from '../ui/TelemetryIcon';

export function CenterColumn(): React.JSX.Element {
  const currentModuleId = useCourseStore((s) => s.currentModuleId);
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);
  const isPlaying = useCourseStore((s) => s.isPlaying);
  const speed = useCourseStore((s) => s.speed);
  const togglePlay = useCourseStore((s) => s.togglePlay);
  const replay = useCourseStore((s) => s.replay);
  const setSpeed = useCourseStore((s) => s.setSpeed);
  const goToStep = useCourseStore((s) => s.goToStep);

  const module = modules.find((m) => m.id === currentModuleId);
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
      {/* Lesson Header */}
      <section className="p-4 sm:p-6 border-b border-divider bg-surface/50 space-y-3">
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
              <span>{steps.length} steps</span>
            </span>
          </div>
        </div>

        {/* Telemetry Strip & Playback Bar */}
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
      </section>

      {/* Canvas Area Placeholder (Phase 4) */}
      <section className="flex-1 p-4 sm:p-6 flex flex-col justify-center items-center relative min-h-[360px]">
        {/* Subtle background blueprint grid pattern */}
        <div className="w-full h-full min-h-[320px] rounded-xl border border-dashed border-divider bg-surface/30 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Decorative badges */}
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

      {/* Step Timeline Placeholder */}
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
                  className={`text-[10px] font-mono truncate max-w-[85px] ${
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
    </main>
  );
}
