import React from 'react';
import {
  CalendarRange,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { ScreenView } from '../types/taskflow';

interface MobileBottomBarProps {
  activeScreen: ScreenView;
  onSelectScreen: (screen: ScreenView) => void;
}

const MOBILE_ITEMS: {
  id: ScreenView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'board', label: 'Board', icon: FolderKanban },
  { id: 'sprints', label: 'Sprints', icon: CalendarRange },
  { id: 'team', label: 'Team', icon: Users },
];

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-white/95 backdrop-blur-sm border-t border-[#E2E8F0] px-2 flex items-center justify-around"
    >
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectScreen(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-lg text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#172554] font-semibold' : 'text-[#64748B]'
            }`}
          >
            <Icon className="w-[18px] h-[18px] stroke-[1.75]" />
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
