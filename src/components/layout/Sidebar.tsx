import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  X,
} from 'lucide-react';
import { modules, lessons, allLessons, isLessonPlaceholder } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';

interface SidebarProps {
  onCloseDrawer?: () => void;
  className?: string;
}

export function Sidebar({ onCloseDrawer, className = '' }: SidebarProps): React.JSX.Element {
  const currentModuleId = useCourseStore((s) => s.currentModuleId);
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const completedLessons = useCourseStore((s) => s.completedLessons);
  const selectLesson = useCourseStore((s) => s.selectLesson);

  // Filter completed lessons so placeholders never count
  const validCompletedLessons = completedLessons.filter((id) => {
    const l = lessons[id];
    return l && !isLessonPlaceholder(l);
  });

  // Keep track of which modules are expanded
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    '04-nginx': true,
    [currentModuleId]: true,
  });

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  }

  const totalLessonsCount = allLessons.length;
  const completedCount = validCompletedLessons.length;
  const progressPercent = Math.round((completedCount / (totalLessonsCount || 1)) * 100);

  return (
    <aside
      className={`w-72 h-full flex flex-col border-r border-divider bg-surface select-none ${className}`}
    >
      {/* Course Header */}
      <div className="h-12 border-b border-divider px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink">
          <Folder className="w-4 h-4 text-ink/70" />
          <span>Course</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-ink/60 bg-bg px-2 py-0.5 rounded border border-divider">
            {totalLessonsCount} lessons
          </span>
          {onCloseDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              className="lg:hidden p-1 hover:bg-tint rounded text-ink"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Module Tree Accordion */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 text-xs font-mono">
        {modules.map((module) => {
          const isExpanded = !!expandedModules[module.id];
          const moduleCompleted = module.lessonIds.filter((id) =>
            validCompletedLessons.includes(id),
          ).length;

          return (
            <div key={module.id} className="rounded-lg border border-divider bg-bg/50 overflow-hidden">
              {/* Module Accordion Header */}
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full px-2.5 py-2 flex items-start justify-between text-left hover:bg-tint/50 transition-colors"
              >
                <div className="flex items-start gap-1.5 font-bold text-ink mr-2 min-w-0">
                  <span className="text-ink/60 mt-0.5 shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <span className="text-ink/70 mt-0.5 shrink-0">
                    {isExpanded ? (
                      <FolderOpen className="w-3.5 h-3.5 text-ink/80" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-ink/70" />
                    )}
                  </span>
                  <span className="leading-snug break-words line-clamp-2">{module.title}</span>
                </div>
                <span className="text-[10px] text-ink/60 shrink-0 mt-0.5">
                  {moduleCompleted}/{module.lessonIds.length}
                </span>
              </button>

              {/* Module Lessons List */}
              {isExpanded && (
                <div className="px-1.5 pb-1.5 pt-0.5 space-y-1 border-t border-divider/60">
                  {module.lessonIds.map((lessonId) => {
                    const lesson = lessons[lessonId];
                    if (!lesson) return null;
                    const isActive = lesson.id === currentLessonId;
                    const isDone = validCompletedLessons.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          selectLesson(lesson.id, module.id);
                          onCloseDrawer?.();
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-start gap-2 transition-all ${
                          isActive
                            ? 'bg-accent text-ink border border-ink shadow-hard font-semibold'
                            : 'text-ink/80 hover:bg-tint hover:text-ink'
                        }`}
                      >
                        <span className="shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-ink/30" />
                          )}
                        </span>
                        <span className="text-[11px] leading-snug break-words line-clamp-2">
                          {lesson.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Footer */}
      <div className="border-t border-divider p-3 bg-surface text-xs font-mono space-y-2">
        <div className="flex items-center justify-between text-ink font-semibold">
          <span className="text-[11px] uppercase tracking-wider text-ink/70">Progress</span>
          <span className="text-[11px]">
            {completedCount} / {totalLessonsCount}
          </span>
        </div>
        <div className="w-full bg-bg h-2 rounded-full border border-divider overflow-hidden">
          <div
            className="bg-accent h-full border-r border-ink transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
