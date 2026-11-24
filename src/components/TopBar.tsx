import React, { useEffect, useRef } from 'react';
import { Menu, Plus, Search, X } from 'lucide-react';
import { Project, ScreenView } from '../types/taskflow';

interface TopBarProps {
  activeScreen: ScreenView;
  activeProject: Project | null;
  onClearProject: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenNewTask: () => void;
  onOpenMobileMenu: () => void;
}

const SCREEN_TITLES: Record<ScreenView, string> = {
  overview: 'Executive Overview',
  tasks: 'Task List',
  board: 'Kanban Board',
  sprints: 'Sprint & Roadmap',
  team: 'Team Workload',
};

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  activeProject,
  onClearProject,
  searchQuery,
  onSearchChange,
  onOpenNewTask,
  onOpenMobileMenu,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between gap-4 md:gap-8">
      {/* Zone 1: Contextual Breadcrumb & Mobile Menu Trigger */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="md:hidden p-2 -ml-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
        >
          <Menu className="w-5 h-5 stroke-[1.75]" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-[#64748B] font-medium whitespace-nowrap hidden sm:inline">
            TaskFlow
          </span>
          <span className="text-[#CBD5E1] hidden sm:inline" aria-hidden="true">
            /
          </span>
          <h1 className="font-semibold text-[#111C2D] tracking-[-0.015em] whitespace-nowrap truncate">
            {SCREEN_TITLES[activeScreen]}
          </h1>
          {activeProject && (
            <>
              <span className="text-[#CBD5E1] hidden lg:inline" aria-hidden="true">
                /
              </span>
              <button
                type="button"
                onClick={onClearProject}
                title="Clear workstream filter"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-[#0058BE] hover:text-[#172554] whitespace-nowrap shrink-0"
              >
                <span>{activeProject.name}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] stroke-[1.75] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, codes, or assignees…"
            aria-label="Search tasks"
            className="w-full h-10 pl-10 pr-14 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all focus:bg-white focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4 stroke-[2.25]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
