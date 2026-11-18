import React, { useRef, useState, useEffect } from 'react';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { CenterColumn } from './components/layout/CenterColumn';
import { StepPanel } from './components/layout/StepPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCourseStore } from './store/useCourseStore';

export function App(): React.JSX.Element {
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const theme = useCourseStore((s) => s.theme);

  // Sync theme to root class on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard navigation hook
  useKeyboardShortcuts({
    onSearchFocus: () => {
      searchInputRef.current?.focus();
    },
  });

  return (
    <div className="h-screen flex flex-col bg-bg text-ink font-mono overflow-hidden">
      {/* Zone A: Top Bar */}
      <TopNav
        searchInputRef={searchInputRef}
        onToggleLeftDrawer={() => setIsLeftDrawerOpen((prev) => !prev)}
        onToggleRightDrawer={() => setIsRightDrawerOpen((prev) => !prev)}
      />

      {/* Main Workspace (Zones B, C, D) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Zone B: Left Sidebar (Desktop) */}
        <Sidebar className="hidden lg:flex shrink-0" />

        {/* Zone B: Left Drawer (Mobile / Tablet) */}
        {isLeftDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsLeftDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-50 h-full max-w-xs shadow-2xl">
              <Sidebar onCloseDrawer={() => setIsLeftDrawerOpen(false)} />
            </div>
          </div>
        )}

        {/* Zone C: Center Column */}
        <CenterColumn />

        {/* Zone D: Right StepPanel (Desktop) */}
        <StepPanel className="hidden xl:flex shrink-0" />

        {/* Zone D: Right Drawer (Mobile / Tablet) */}
        {isRightDrawerOpen && (
          <div className="xl:hidden fixed inset-0 z-40 flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsRightDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-50 h-full max-w-sm shadow-2xl">
              <StepPanel onCloseDrawer={() => setIsRightDrawerOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
