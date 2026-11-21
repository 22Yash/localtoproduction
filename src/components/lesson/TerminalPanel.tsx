import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { useCourseStore } from '../../store/useCourseStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { lessons } from '../../data/modules';

export function TerminalPanel(): React.JSX.Element | null {
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);
  const isPlaying = useCourseStore((s) => s.isPlaying);
  const speed = useCourseStore((s) => s.speed);
  const replayNonce = useCourseStore((s) => s.replayNonce);
  const reducedMotion = useReducedMotion();

  const lesson = lessons[currentLessonId];
  const step = lesson?.steps[currentStepIndex];
  const terminal = step?.terminal;
  const lines = terminal?.lines ?? [];

  const [revealedCount, setRevealedCount] = useState<number>(() =>
    reducedMotion ? lines.length : 1
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Reset reveal on step change, lesson change, or replay action
  useEffect(() => {
    if (reducedMotion) {
      setRevealedCount(lines.length);
    } else {
      setRevealedCount(lines.length > 0 ? 1 : 0);
    }
  }, [currentLessonId, currentStepIndex, replayNonce, lines.length, reducedMotion]);

  // Reveal lines one after another (scaled by speed setting), pausing when !isPlaying
  useEffect(() => {
    if (reducedMotion || !isPlaying) return;

    if (revealedCount < lines.length) {
      const delay = Math.max(50, Math.round(250 / speed));
      const timer = setTimeout(() => {
        setRevealedCount((prev) => Math.min(lines.length, prev + 1));
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, lines.length, isPlaying, speed, reducedMotion]);

  // Auto-scroll log to bottom as lines appear
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [revealedCount]);

  if (!terminal || lines.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex((prev) => (prev === index ? null : prev));
      }, 1500);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 pb-3 select-none">
      <div
        className="w-full rounded-xl border border-ink overflow-hidden shadow-hard flex flex-col"
        style={{
          backgroundColor: 'var(--terminal-bg, #141413)',
          color: 'var(--terminal-text, #EAE7DD)',
        }}
      >
        {/* Terminal Title Bar */}
        <div
          className="h-8 px-3 border-b border-divider/40 flex items-center justify-between shrink-0"
          style={{ backgroundColor: 'var(--terminal-surface, #1E1E1C)' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80 inline-block" />
            </div>
            <div
              className="flex items-center gap-1.5 ml-2 text-[11px] font-mono font-semibold"
              style={{ color: 'var(--terminal-text, #EAE7DD)' }}
            >
              <Terminal className="w-3.5 h-3.5 opacity-70" />
              <span>{terminal.title || 'terminal'}</span>
            </div>
          </div>
          <span
            className="text-[10px] font-mono opacity-60"
            style={{ color: 'var(--terminal-comment, #8A877C)' }}
          >
            bash
          </span>
        </div>

        {/* Terminal Output Log */}
        <div
          ref={logContainerRef}
          role="log"
          aria-live="polite"
          className="p-3 sm:p-4 space-y-1 font-mono text-xs leading-relaxed max-h-56 overflow-y-auto select-text"
        >
          {lines.slice(0, revealedCount).map((line, idx) => {
            const isCmd = line.kind === 'command';
            const isComment = line.kind === 'comment';
            const isHighlight = Boolean(line.highlight);

            return (
              <div
                key={idx}
                className={`flex items-start justify-between gap-2 px-1.5 py-0.5 rounded transition-colors group ${
                  isHighlight ? 'rounded' : ''
                }`}
                style={
                  isHighlight
                    ? { backgroundColor: 'var(--terminal-highlight-bg, rgba(166, 206, 132, 0.2))' }
                    : undefined
                }
              >
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  {isCmd && (
                    <span
                      className="font-bold shrink-0 select-none"
                      style={{ color: 'var(--terminal-prompt, #A6CE84)' }}
                    >
                      $
                    </span>
                  )}
                  <span
                    className={`break-all whitespace-pre-wrap ${
                      isCmd
                        ? 'font-bold'
                        : isComment
                        ? 'italic'
                        : 'font-normal'
                    }`}
                    style={{
                      color: isComment
                        ? 'var(--terminal-comment, #8A877C)'
                        : 'var(--terminal-text, #EAE7DD)',
                    }}
                  >
                    {line.text}
                  </span>
                </div>

                {isCmd && (
                  <button
                    type="button"
                    onClick={() => handleCopy(line.text, idx)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-xs shrink-0 select-none text-ink/70"
                    title="Copy command"
                    aria-label={`Copy command: ${line.text}`}
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" style={{ color: 'var(--terminal-text, #EAE7DD)' }} />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
