import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { lessons, isLessonPlaceholder } from '../data/modules';

export interface CourseState {
  currentModuleId: string;
  currentLessonId: string;
  currentStepIndex: number;
  isPlaying: boolean;
  speed: 1 | 2;
  completedLessons: string[];
  theme: 'light' | 'dark';
  replayNonce: number;

  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectLesson: (lessonId: string, moduleId?: string) => void;
  togglePlay: () => void;
  replay: () => void;
  setSpeed: (speed: 1 | 2) => void;
  toggleTheme: () => void;
  markLessonComplete: (lessonId: string) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      currentModuleId: '04-nginx',
      currentLessonId: 'nginx-load-balancing',
      currentStepIndex: 0,
      isPlaying: true,
      speed: 1,
      completedLessons: [],
      theme: 'light',
      replayNonce: 0,

      goToStep: (index: number) => {
        const { currentLessonId } = get();
        const lesson = lessons[currentLessonId];
        const maxStep = lesson ? lesson.steps.length - 1 : 0;
        const target = Math.max(0, Math.min(index, maxStep));
        set({ currentStepIndex: target });
      },

      nextStep: () => {
        const { currentLessonId, currentStepIndex, completedLessons } = get();
        const lesson = lessons[currentLessonId];
        if (!lesson) return;
        if (currentStepIndex < lesson.steps.length - 1) {
          set({ currentStepIndex: currentStepIndex + 1 });
        } else {
          // Never mark placeholder lessons as complete
          if (!isLessonPlaceholder(lesson) && !completedLessons.includes(currentLessonId)) {
            set({ completedLessons: [...completedLessons, currentLessonId] });
          }
        }
      },

      prevStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },

      selectLesson: (lessonId: string, moduleId?: string) => {
        const targetLesson = lessons[lessonId];
        const targetModuleId = moduleId ?? targetLesson?.moduleId ?? '04-nginx';
        set({
          currentLessonId: lessonId,
          currentModuleId: targetModuleId,
          currentStepIndex: 0,
          isPlaying: true,
        });
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      replay: () => set((state) => ({ isPlaying: true, replayNonce: state.replayNonce + 1 })),

      setSpeed: (speed: 1 | 2) => set({ speed }),

      toggleTheme: () => {
        const nextTheme = get().theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme: nextTheme });
      },

      markLessonComplete: (lessonId: string) => {
        const targetLesson = lessons[lessonId];
        if (!targetLesson || isLessonPlaceholder(targetLesson)) return;
        const { completedLessons } = get();
        if (!completedLessons.includes(lessonId)) {
          set({ completedLessons: [...completedLessons, lessonId] });
        }
      },
    }),
    {
      name: 'shiptoprod-course-storage',
      version: 1,
      migrate: (persistedState: unknown) => {
        const state = persistedState as Partial<CourseState>;
        if (state && Array.isArray(state.completedLessons)) {
          state.completedLessons = state.completedLessons.filter((id) => {
            const l = lessons[id];
            return l && !isLessonPlaceholder(l);
          });
        }
        return state as CourseState;
      },
      partialize: (state) => ({
        completedLessons: state.completedLessons.filter((id) => {
          const l = lessons[id];
          return l && !isLessonPlaceholder(l);
        }),
        theme: state.theme,
        speed: state.speed,
        currentModuleId: state.currentModuleId,
        currentLessonId: state.currentLessonId,
        currentStepIndex: state.currentStepIndex,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Remove any placeholder lessons that may have been saved as complete
          if (Array.isArray(state.completedLessons)) {
            state.completedLessons = state.completedLessons.filter((id) => {
              const l = lessons[id];
              return l && !isLessonPlaceholder(l);
            });
          }
          if (typeof document !== 'undefined') {
            if (state.theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        }
      },
    },
  ),
);
