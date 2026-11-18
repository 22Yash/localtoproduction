import React, { useRef } from 'react';
import {
  Server,
  BookOpen,
  Code2,
  Layers,
  FileText,
  Search,
  Globe,
  Sun,
  Moon,
  Menu,
  PanelRight,
} from 'lucide-react';
import { useCourseStore } from '../../store/useCourseStore';

interface TopNavProps {
  onToggleLeftDrawer?: () => void;
  onToggleRightDrawer?: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export function TopNav({
  onToggleLeftDrawer,
  onToggleRightDrawer,
  searchInputRef,
}: TopNavProps): React.JSX.Element {
  const localInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = searchInputRef ?? localInputRef;

  const theme = useCourseStore((s) => s.theme);
  const toggleTheme = useCourseStore((s) => s.toggleTheme);

  return (
    <header className="h-14 border-b border-divider bg-surface px-3 sm:px-4 flex items-center justify-between gap-2 select-none z-20">
      {/* Left: Mobile Drawer Trigger + Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleLeftDrawer}
          className="lg:hidden p-1.5 rounded-lg border border-divider hover:bg-tint text-ink"
          aria-label="Toggle course menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-tight text-ink">
          <div className="w-7 h-7 rounded border border-ink bg-accent flex items-center justify-center shadow-hard-sm">
            <Server className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">ShipToProd</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 ml-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-accent text-ink border border-ink shadow-hard"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learn</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg text-ink/70 hover:text-ink hover:bg-tint border border-transparent transition-colors"
            title="Practice mode (coming soon)"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Practice</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg text-ink/70 hover:text-ink hover:bg-tint border border-transparent transition-colors"
            title="Design Lab (coming soon)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Design Lab</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg text-ink/70 hover:text-ink hover:bg-tint border border-transparent transition-colors"
            title="Cheatsheets (coming soon)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cheatsheets</span>
          </button>
        </nav>
      </div>

      {/* Right: Search + Language + Theme Toggle + Mobile Step Drawer */}
      <div className="flex items-center gap-2">
        {/* Search Input Box */}
        <div className="relative hidden sm:block w-44 md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/50 pointer-events-none" />
          <input
            ref={activeInputRef}
            type="text"
            placeholder="Search lessons"
            className="w-full bg-bg border border-divider focus:border-ink rounded-lg pl-8 pr-3 md:pr-14 py-1 text-xs font-mono text-ink placeholder:text-ink/40 outline-none transition-colors"
          />
          <kbd className="hidden md:inline-block absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono border border-divider bg-surface px-1.5 py-0.5 rounded text-ink/60 pointer-events-none">
            Ctrl K
          </kbd>
        </div>

        {/* Language Placeholder */}
        <div className="flex items-center gap-1 px-2 py-1 text-xs font-mono border border-divider rounded-lg text-ink bg-bg">
          <Globe className="w-3.5 h-3.5 text-ink/70" />
          <span>EN</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 border border-divider hover:border-ink rounded-lg bg-bg text-ink hover:bg-tint transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-accent" />
          ) : (
            <Moon className="w-4 h-4 text-ink" />
          )}
        </button>

        {/* Right Drawer Trigger for Mobile */}
        <button
          type="button"
          onClick={onToggleRightDrawer}
          className="xl:hidden p-1.5 rounded-lg border border-divider hover:bg-tint text-ink"
          aria-label="Toggle step details"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
