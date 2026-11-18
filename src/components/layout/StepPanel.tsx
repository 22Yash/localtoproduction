import React from 'react';
import {
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckSquare,
  Square,
  X,
  Sparkles,
} from 'lucide-react';
import { lessons, isLessonPlaceholder } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';

interface StepPanelProps {
  onCloseDrawer?: () => void;
  className?: string;
}

export function StepPanel({ onCloseDrawer, className = '' }: StepPanelProps): React.JSX.Element {
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);
  const nextStep = useCourseStore((s) => s.nextStep);
  const prevStep = useCourseStore((s) => s.prevStep);

  const lesson = lessons[currentLessonId];
  const steps = lesson?.steps ?? [];
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isPlaceholder = isLessonPlaceholder(lesson);
  const nextStepData = !isLastStep ? steps[currentStepIndex + 1] : undefined;

  // Compute "What changed" diff between step N and step N-1
  const prevStepData = currentStepIndex > 0 ? steps[currentStepIndex - 1] : undefined;
  const telemetryChanges = prevStepData && currentStep
    ? currentStep.telemetry
        .map((curr, idx) => {
          const prev = prevStepData.telemetry[idx];
          if (!prev || prev.value === curr.value) return null;
          return {
            label: curr.label,
            from: prev.value,
            to: curr.value,
          };
        })
        .filter((item): item is { label: string; from: string; to: string } => item !== null)
    : [];

  if (!lesson || !currentStep) {
    return (
      <aside className={`w-80 h-full border-l border-divider bg-surface p-4 ${className}`}>
        <p className="text-xs font-mono text-ink/70">No lesson selected.</p>
      </aside>
    );
  }

  return (
    <aside
      className={`w-80 sm:w-96 h-full flex flex-col border-l border-divider bg-surface select-none overflow-y-auto ${className}`}
    >
      {/* Top Header: Step Counter & Category Tag */}
      <div className="h-12 border-b border-divider px-4 flex items-center justify-between shrink-0">
        <span className="text-xs font-mono font-bold tracking-wider text-ink/80">
          STEP {currentStepIndex + 1} / {totalSteps}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-tint text-ink border border-ink px-2 py-0.5 rounded">
            {currentStep.category}
          </span>
          {onCloseDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              className="xl:hidden p-1 hover:bg-tint rounded text-ink"
              aria-label="Close step panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Step Title */}
        <h2 className="text-base font-mono font-bold text-ink leading-snug">
          {currentStep.title}
        </h2>

        {/* Step Explanation */}
        <div className="space-y-2 text-xs font-mono text-ink/90 leading-relaxed">
          {currentStep.explanation.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* "Good to know" Callout (Soft Green) */}
        <div className="bg-callout-bg border border-callout-border rounded-lg p-3 space-y-1.5 text-ink">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider">
            <Lightbulb className="w-3.5 h-3.5 text-ink/80" />
            <span>GOOD TO KNOW</span>
          </div>
          <p className="text-xs font-mono text-ink/90 leading-normal">
            {currentStep.goodToKnow}
          </p>
        </div>

        {/* What Changed Diff (Computed) */}
        {telemetryChanges.length > 0 && (
          <div className="border border-divider bg-bg/60 rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">
              <Sparkles className="w-3 h-3 text-ink/60" />
              <span>What Changed</span>
            </div>
            <div className="space-y-1">
              {telemetryChanges.map((change) => (
                <div
                  key={change.label}
                  className="text-xs font-mono flex items-center justify-between text-ink/85"
                >
                  <span className="text-ink/60">{change.label}</span>
                  <span className="font-semibold">
                    {change.from} <span className="text-ink/40">→</span> {change.to}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={isFirstStep}
              className="px-3.5 py-2 text-xs font-mono font-semibold rounded-lg border border-ink bg-surface hover:bg-tint disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={isLastStep && isPlaceholder}
              className={`flex-1 px-3.5 py-2 text-xs font-mono font-semibold rounded-lg border border-ink transition-all flex items-center justify-between ${
                isLastStep && isPlaceholder
                  ? 'bg-surface text-ink/40 border-divider cursor-not-allowed opacity-60'
                  : 'bg-accent hover:bg-accent-hover text-ink shadow-hard active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
              }`}
            >
              <span className="truncate">
                {isLastStep
                  ? isPlaceholder
                    ? 'Coming Soon'
                    : 'Complete Lesson'
                  : `Next: ${nextStepData?.shortLabel}`}
              </span>
              {isLastStep ? (
                !isPlaceholder && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1.5" />
              )}
            </button>
          </div>

          {/* Keyboard Hints */}
          <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-ink/60 pt-1">
            <span>
              <kbd className="border border-divider bg-bg px-1 py-0.5 rounded">←</kbd>{' '}
              <kbd className="border border-divider bg-bg px-1 py-0.5 rounded">→</kbd> step
            </span>
            <span>
              <kbd className="border border-divider bg-bg px-1 py-0.5 rounded">R</kbd> replay
            </span>
            <span>
              <kbd className="border border-divider bg-bg px-1 py-0.5 rounded">Space</kbd> pause
            </span>
          </div>
        </div>

        {/* "You'll Learn" Checklist */}
        <div className="pt-3 border-t border-divider space-y-2">
          <h3 className="text-[11px] font-mono font-bold tracking-wider uppercase text-ink/70">
            You&apos;ll Learn
          </h3>
          <ul className="space-y-1.5 text-xs font-mono">
            {steps.map((step, idx) => {
              const isUnlocked = idx <= currentStepIndex;
              return (
                <li
                  key={step.id}
                  className={`flex items-start gap-2 ${
                    isUnlocked ? 'text-ink font-medium' : 'text-ink/40'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isUnlocked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-ink/30" />
                    )}
                  </span>
                  <span className="text-[11px] leading-snug">{step.learned}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
