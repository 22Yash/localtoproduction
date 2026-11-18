import { useEffect } from 'react';
import { useCourseStore } from '../store/useCourseStore';

interface KeyboardShortcutsOptions {
  onSearchFocus?: () => void;
}

export function useKeyboardShortcuts(options?: KeyboardShortcutsOptions) {
  const nextStep = useCourseStore((s) => s.nextStep);
  const prevStep = useCourseStore((s) => s.prevStep);
  const replay = useCourseStore((s) => s.replay);
  const togglePlay = useCourseStore((s) => s.togglePlay);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        options?.onSearchFocus?.();
        return;
      }

      // Ignore standard shortcut keys if typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            replay();
          }
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep, replay, togglePlay, options]);
}
