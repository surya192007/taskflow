/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import {
  INITIAL_SPRINTS,
  INITIAL_TASKS,
  PROJECTS,
  TEAM_MEMBERS,
} from './data/seedData';
import { ScreenView, Sprint, Task, TaskStatus } from './types/taskflow';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { OverviewScreen } from './components/OverviewScreen';
import { TasksScreen } from './components/TasksScreen';
import { BoardScreen } from './components/BoardScreen';
import { SprintsScreen } from './components/SprintsScreen';
import { TeamScreen } from './components/TeamScreen';
import { TaskDrawer } from './components/TaskDrawer';
import { NewTaskModal } from './components/NewTaskModal';

const STORAGE_KEY = 'taskflow_executive_workspace_v1';

interface PersistedWorkspace {
  tasks: Task[];
  sprints: Sprint[];
}

function loadInitialWorkspace(): PersistedWorkspace {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedWorkspace;
      if (Array.isArray(parsed.tasks) && Array.isArray(parsed.sprints)) {
        return parsed;
      }
    }
  } catch {
    // Fallback cleanly to seed data
  }
  return {
    tasks: INITIAL_TASKS,
    sprints: INITIAL_SPRINTS,
  };
}

export default function App() {
  const [workspace, setWorkspace] = useState<PersistedWorkspace>(loadInitialWorkspace);
  const [activeScreen, setActiveScreen] = useState<ScreenView>('overview');
  const [activeProjectId, setActiveProjectId] = useState<string | 'all'>('all');
  const [activeMemberFilter, setActiveMemberFilter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTaskDefaultStatus, setNewTaskDefaultStatus] =
    useState<TaskStatus>('backlog');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch {
      // Ignore storage quota errors
    }
  }, [workspace]);

  const activeSprint = useMemo(
    () =>
      workspace.sprints.find((s) => s.status === 'active') ??
      workspace.sprints[0],
    [workspace.sprints]
  );

  // Scoped tasks by global search + sidebar workstream filter
  const scopedTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return workspace.tasks.filter((t) => {
      if (activeProjectId !== 'all' && t.projectId !== activeProjectId) {
        return false;
      }
      if (!q) return true;
      const assignee = TEAM_MEMBERS.find((m) => m.id === t.assigneeId);
      const project = PROJECTS.find((p) => p.id === t.projectId);
      return (
        t.title.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (assignee?.name.toLowerCase().includes(q) ?? false) ||
        (project?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [workspace.tasks, activeProjectId, searchQuery]);

  const taskCountsByProject = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const proj of PROJECTS) {
      counts[proj.id] = workspace.tasks.filter(
        (t) => t.projectId === proj.id && t.status !== 'completed'
      ).length;
    }
    return counts;
  }, [workspace.tasks]);

  const totalOpenCount = useMemo(
    () => workspace.tasks.filter((t) => t.status !== 'completed').length,
    [workspace.tasks]
  );

  const selectedTask = useMemo(
    () => workspace.tasks.find((t) => t.id === selectedTaskId) ?? null,
    [workspace.tasks, selectedTaskId]
  );

  const activeProject = useMemo(
    () => PROJECTS.find((p) => p.id === activeProjectId) ?? null,
    [activeProjectId]
  );

  const handleToggleComplete = (taskId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === 'completed' ? 'in_progress' : 'completed',
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }));
  };

  const handleUpdateTask = (taskId: string, patch: Partial<Task>) => {
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? { ...t, ...patch, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleCreateTask = (input: Omit<Task, 'id' | 'code' | 'updatedAt'>) => {
    const nextNumber =
      workspace.tasks.reduce((max, t) => {
        const num = parseInt(t.code.replace('TF-', ''), 10);
        return Number.isNaN(num) ? max : Math.max(max, num);
      }, 440) + 1;

    const newTask: Task = {
      ...input,
      id: `t-${Date.now()}`,
      code: `TF-${nextNumber}`,
      updatedAt: new Date().toISOString(),
    };

    setWorkspace((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const handleQuickAddTask = (title: string) => {
    handleCreateTask({
      title,
      description: '',
      status: 'backlog',
      priority: 'medium',
      projectId:
        activeProjectId !== 'all' ? activeProjectId : PROJECTS[0].id,
      assigneeId:
        activeMemberFilter !== 'all'
          ? activeMemberFilter
          : TEAM_MEMBERS[0].id,
      dueDate: '2026-11-28',
      startDayOffset: 8,
      durationDays: 3,
      points: 3,
      sprintId: activeSprint.id,
      subtasks: [],
    });
  };

  const handleBatchUpdateStatus = (ids: string[], status: TaskStatus) => {
    const idSet = new Set(ids);
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        idSet.has(t.id)
          ? { ...t, status, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  };

  const handleBatchDelete = (ids: string[]) => {
    const idSet = new Set(ids);
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => !idSet.has(t.id)),
    }));
  };

  const handleCompleteSprint = () => {
    setWorkspace((prev) => {
      const currentIdx = prev.sprints.findIndex((s) => s.status === 'active');
      if (currentIdx === -1) return prev;

      const currentSprint = prev.sprints[currentIdx];
      const sprintTasks = prev.tasks.filter(
        (t) => t.sprintId === currentSprint.id
      );
      const totalPts = sprintTasks.reduce((s, t) => s + t.points, 0);
      const donePts = sprintTasks
        .filter((t) => t.status === 'completed')
        .reduce((s, t) => s + t.points, 0);

      let nextSprint = prev.sprints.find((s) => s.status === 'upcoming');
      let updatedSprints = prev.sprints.map((s) => {
        if (s.id === currentSprint.id) {
          return {
            ...s,
            status: 'completed' as const,
            completedPointsArchive: donePts,
            totalPointsArchive: totalPts,
          };
        }
        if (nextSprint && s.id === nextSprint.id) {
          return { ...s, status: 'active' as const };
        }
        return s;
      });

      if (!nextSprint) {
        const nextNum = prev.sprints.length + 41;
        nextSprint = {
          id: `sp-${nextNum}`,
          name: `Sprint ${nextNum} — Q1 Execution Cycle`,
          goal: 'Maintain delivery cadence across Core Platform, Billing, and Security.',
          startDate: '2026-12-14',
          endDate: '2026-12-27',
          status: 'active',
        };
        updatedSprints = [...updatedSprints, nextSprint];
      }

      const targetSprintId = nextSprint.id;
      const updatedTasks = prev.tasks.map((t) =>
        t.sprintId === currentSprint.id && t.status !== 'completed'
          ? { ...t, sprintId: targetSprintId }
          : t
      );

      return {
        sprints: updatedSprints,
        tasks: updatedTasks,
      };
    });
  };

  const handleResetDemoData = () => {
    setWorkspace({
      tasks: INITIAL_TASKS,
      sprints: INITIAL_SPRINTS,
    });
    setActiveProjectId('all');
    setActiveMemberFilter('all');
    setSearchQuery('');
    setSelectedTaskId(null);
  };

  const handleFilterByMemberAndOpenTasks = (memberId: string) => {
    setActiveMemberFilter(memberId);
    setActiveScreen('tasks');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        projects={PROJECTS}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        taskCountsByProject={taskCountsByProject}
        totalOpenCount={totalOpenCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        currentUser={TEAM_MEMBERS[0]}
        onResetDemoData={handleResetDemoData}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeScreen={activeScreen}
          activeProject={activeProject}
          onClearProject={() => setActiveProjectId('all')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewTask={() => {
            setNewTaskDefaultStatus('backlog');
            setNewTaskModalOpen(true);
          }}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-[1440px] w-full mx-auto">
          {activeScreen === 'overview' && (
            <OverviewScreen
              tasks={scopedTasks}
              projects={PROJECTS}
              members={TEAM_MEMBERS}
              activeSprint={activeSprint}
              onToggleComplete={handleToggleComplete}
              onSelectTask={(t) => setSelectedTaskId(t.id)}
              onNavigate={setActiveScreen}
              onFilterByMember={handleFilterByMemberAndOpenTasks}
              onCompleteSprint={() => setActiveScreen('sprints')}
            />
          )}

          {activeScreen === 'tasks' && (
            <TasksScreen
              tasks={scopedTasks}
              projects={PROJECTS}
              members={TEAM_MEMBERS}
              activeSprintId={activeSprint.id}
              activeMemberFilter={activeMemberFilter}
              onChangeMemberFilter={setActiveMemberFilter}
              onToggleComplete={handleToggleComplete}
              onSelectTask={(t) => setSelectedTaskId(t.id)}
              onQuickAddTask={handleQuickAddTask}
              onBatchUpdateStatus={handleBatchUpdateStatus}
              onBatchDelete={handleBatchDelete}
              onResetFilters={() => {
                setActiveProjectId('all');
                setActiveMemberFilter('all');
                setSearchQuery('');
              }}
              onOpenNewTask={() => {
                setNewTaskDefaultStatus('backlog');
                setNewTaskModalOpen(true);
              }}
            />
          )}

          {activeScreen === 'board' && (
            <BoardScreen
              tasks={scopedTasks}
              projects={PROJECTS}
              members={TEAM_MEMBERS}
              onMoveTask={(taskId, newStatus) =>
                handleUpdateTask(taskId, { status: newStatus })
              }
              onSelectTask={(t) => setSelectedTaskId(t.id)}
              onOpenNewTaskForColumn={(status) => {
                setNewTaskDefaultStatus(status);
                setNewTaskModalOpen(true);
              }}
            />
          )}

          {activeScreen === 'sprints' && (
            <SprintsScreen
              sprints={workspace.sprints}
              tasks={scopedTasks}
              projects={PROJECTS}
              members={TEAM_MEMBERS}
              onSelectTask={(t) => setSelectedTaskId(t.id)}
              onCompleteSprint={handleCompleteSprint}
            />
          )}

          {activeScreen === 'team' && (
            <TeamScreen
              members={TEAM_MEMBERS}
              tasks={scopedTasks}
              projects={PROJECTS}
              onSelectTask={(t) => setSelectedTaskId(t.id)}
              onViewMemberTasks={handleFilterByMemberAndOpenTasks}
            />
          )}
        </main>
      </div>

      <MobileBottomBar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        projects={PROJECTS}
        members={TEAM_MEMBERS}
      />

      <NewTaskModal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        onCreate={handleCreateTask}
        projects={PROJECTS}
        members={TEAM_MEMBERS}
        activeSprintId={activeSprint.id}
        defaultStatus={newTaskDefaultStatus}
        defaultProjectId={activeProjectId}
      />
    </div>
  );
}
