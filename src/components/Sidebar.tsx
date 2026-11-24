import React from 'react';
import {
  CalendarRange,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Users,
  X,
} from 'lucide-react';
import { Project, ScreenView, TeamMember } from '../types/taskflow';
import { Avatar } from './Avatar';

interface SidebarProps {
  activeScreen: ScreenView;
  onSelectScreen: (screen: ScreenView) => void;
  projects: Project[];
  activeProjectId: string | 'all';
  onSelectProject: (projectId: string | 'all') => void;
  taskCountsByProject: Record<string, number>;
  totalOpenCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser: TeamMember;
  onResetDemoData: () => void;
}

const NAV_ITEMS: { id: ScreenView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Task List', icon: CheckSquare },
  { id: 'board', label: 'Kanban Board', icon: FolderKanban },
  { id: 'sprints', label: 'Sprints', icon: CalendarRange },
  { id: 'team', label: 'Team Workload', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onSelectScreen,
  projects,
  activeProjectId,
  onSelectProject,
  taskCountsByProject,
  totalOpenCount,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  currentUser,
  onResetDemoData,
}) => {
  const renderSidebarContent = (isMobileDrawer: boolean) => {
    const isRail = collapsed && !isMobileDrawer;

    return (
      <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] select-none">
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center border-b border-[#F1F5F9] shrink-0 ${
            isRail ? 'justify-center px-2' : 'justify-between px-5'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onSelectScreen('overview');
              if (isMobileDrawer) onCloseMobile();
            }}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-lg"
          >
            <span className="w-8 h-8 rounded-xl bg-[#172554] text-white flex items-center justify-center font-bold text-sm tracking-tight shrink-0">
              TF
            </span>
            {!isRail && (
              <span className="text-[17px] font-bold tracking-[-0.025em] text-[#111C2D] whitespace-nowrap">
                TaskFlow
              </span>
            )}
          </button>

          {isMobileDrawer ? (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>
          ) : (
            !isRail && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
              >
                <PanelLeftClose className="w-4 h-4 stroke-[1.75]" />
              </button>
            )
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <nav aria-label="Primary navigation" className="space-y-1">
            {isRail && (
              <div className="flex justify-center mb-2">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                  className="p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
                >
                  <PanelLeftOpen className="w-4 h-4 stroke-[1.75]" />
                </button>
              </div>
            )}

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectScreen(item.id);
                    if (isMobileDrawer) onCloseMobile();
                  }}
                  title={isRail ? item.label : undefined}
                  className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
                    isRail ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#172554] text-white'
                      : 'text-[#45464F] hover:bg-[#F1F5F9] hover:text-[#111C2D]'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] stroke-[1.75] shrink-0 ${
                      isActive ? 'text-white' : 'text-[#64748B]'
                    }`}
                  />
                  {!isRail && (
                    <span className="truncate whitespace-nowrap">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Workstreams / Projects Filter */}
          {!isRail && (
            <div className="pt-4 border-t border-[#F1F5F9]">
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B] tracking-[0.02em]">
                  Workstreams
                </span>
                <span className="text-xs font-mono tabular-nums text-[#64748B]">
                  {totalOpenCount} open
                </span>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectProject('all');
                    if (isMobileDrawer) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                    activeProjectId === 'all'
                      ? 'bg-[#F0F3FF] text-[#172554] font-semibold'
                      : 'text-[#45464F] hover:bg-[#F8FAFC] hover:text-[#111C2D]'
                  }`}
                >
                  <span className="truncate whitespace-nowrap">All Workstreams</span>
                  <span className="text-xs font-mono tabular-nums text-[#64748B]">
                    {totalOpenCount}
                  </span>
                </button>

                {projects.map((proj) => {
                  const isSelected = activeProjectId === proj.id;
                  const count = taskCountsByProject[proj.id] ?? 0;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => {
                        onSelectProject(proj.id);
                        if (isMobileDrawer) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                        isSelected
                          ? 'bg-[#F0F3FF] text-[#172554] font-semibold'
                          : 'text-[#45464F] hover:bg-[#F8FAFC] hover:text-[#111C2D]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-[2px] shrink-0"
                          style={{ backgroundColor: proj.accentHex }}
                        />
                        <span className="truncate whitespace-nowrap">{proj.name}</span>
                      </span>
                      <span className="text-xs font-mono tabular-nums text-[#64748B] ml-2">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer User Profile + Reset Workspace */}
        <div className="p-3 border-t border-[#F1F5F9] shrink-0 space-y-2">
          {!isRail && (
            <button
              type="button"
              onClick={onResetDemoData}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[1.75]" />
              <span className="whitespace-nowrap">Reset Demo Data</span>
            </button>
          )}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] ${
              isRail ? 'justify-center' : ''
            }`}
          >
            <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" />
            {!isRail && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#111C2D] truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">{currentUser.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop / Tablet Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-[width] duration-200 ease-out ${
          collapsed ? 'w-[72px]' : 'w-[268px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{renderSidebarContent(false)}</div>
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[4px]"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[280px] max-w-[85vw] h-full z-10 modal-shadow">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
