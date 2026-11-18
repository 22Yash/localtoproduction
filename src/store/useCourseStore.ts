import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { lessons } from '../data/modules';

export interface CourseState {
  currentModuleId: string;
  currentLessonId: string;
  currentStepIndex: number;
  isPlaying: boolean;
  speed: 1 | 2;
  completedLessons: string[];
  theme: 'light' | 'dark';

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
      isPlaying: false,
      speed: 1,
      completedLessons: [],
      theme: 'light',

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
          if (!completedLessons.includes(currentLessonId)) {
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
          isPlaying: false,
        });
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      replay: () => set({ currentStepIndex: 0, isPlaying: true }),

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
        const { completedLessons } = get();
        if (!completedLessons.includes(lessonId)) {
          set({ completedLessons: [...completedLessons, lessonId] });
        }
      },
    }),
    {
      name: 'shiptoprod-course-storage',
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        theme: state.theme,
        speed: state.speed,
        currentModuleId: state.currentModuleId,
        currentLessonId: state.currentLessonId,
        currentStepIndex: state.currentStepIndex,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    },
  ),
);
