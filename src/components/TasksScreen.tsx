import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ListChecks,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
  TeamMember,
} from '../types/taskflow';
import { Avatar } from './Avatar';
import { PriorityTag, StatusLabel } from './PriorityTag';
import { TaskCheckbox } from './TaskCheckbox';

interface TasksScreenProps {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  activeSprintId: string;
  activeMemberFilter: string | 'all';
  onChangeMemberFilter: (memberId: string | 'all') => void;
  onToggleComplete: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onQuickAddTask: (title: string) => void;
  onBatchUpdateStatus: (ids: string[], status: TaskStatus) => void;
  onBatchDelete: (ids: string[]) => void;
  onResetFilters: () => void;
  onOpenNewTask: () => void;
}

type StatusFilter = 'all' | TaskStatus;
type SortKey = 'priority' | 'dueDate' | 'title';

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review', label: 'In Review' },
  { id: 'completed', label: 'Completed' },
];

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  projects,
  members,
  activeMemberFilter,
  onChangeMemberFilter,
  onToggleComplete,
  onSelectTask,
  onQuickAddTask,
  onBatchUpdateStatus,
  onBatchDelete,
  onResetFilters,
  onOpenNewTask,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<SortKey>('priority');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickTitle, setQuickTitle] = useState('');

  const filteredTasks = useMemo(() => {
    const priorityRank = { high: 0, medium: 1, low: 2 };
    return tasks
      .filter((t) => (statusFilter === 'all' ? true : t.status === statusFilter))
      .filter((t) =>
        priorityFilter === 'all' ? true : t.priority === priorityFilter
      )
      .filter((t) =>
        activeMemberFilter === 'all' ? true : t.assigneeId === activeMemberFilter
      )
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        if (sortBy === 'dueDate') {
          return a.dueDate.localeCompare(b.dueDate);
        }
        return a.title.localeCompare(b.title);
      });
  }, [tasks, statusFilter, priorityFilter, activeMemberFilter, sortBy]);

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allVisibleSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((t) => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map((t) => t.id));
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed) return;
    onQuickAddTask(trimmed);
    setQuickTitle('');
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Segmented Status Tabs */}
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl overflow-x-auto max-w-full"
        >
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.id;
            const count =
              tab.id === 'all'
                ? tasks.length
                : tasks.filter((t) => t.status === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  active
                    ? 'bg-white text-[#111C2D] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="font-mono tabular-nums text-[11px] opacity-75">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters & Sort */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as 'all' | TaskPriority)
            }
            className="h-9 px-3 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            aria-label="Filter by assignee"
            value={activeMemberFilter}
            onChange={(e) => onChangeMemberFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <div className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#E2E8F0]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              aria-label="Sort tasks"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent text-xs font-medium text-[#1E293B] focus:outline-none"
            >
              <option value="priority">Sort: Priority</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Action Bar when rows are selected */}
      {selectedIds.length > 0 && (
        <div className="bg-[#172554] text-white rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tabular-nums">
              {selectedIds.length} task{selectedIds.length === 1 ? '' : 's'} selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#B7C4FD] hover:text-white inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onBatchUpdateStatus(selectedIds, 'completed');
                setSelectedIds([]);
              }}
              className="h-8 px-3 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-xs font-semibold text-white transition-colors whitespace-nowrap"
            >
              Mark Complete
            </button>
            <button
              type="button"
              onClick={() => {
                onBatchUpdateStatus(selectedIds, 'in_review');
                setSelectedIds([]);
              }}
              className="h-8 px-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-semibold text-white transition-colors whitespace-nowrap"
            >
              Move to Review
            </button>
            <button
              type="button"
              onClick={() => {
                onBatchDelete(selectedIds);
                setSelectedIds([]);
              }}
              className="h-8 px-3 rounded-lg bg-white/10 hover:bg-[#DC2626] text-xs font-semibold text-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Task Table Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        {/* Inline Quick-Capture Input */}
        <form
          onSubmit={handleQuickSubmit}
          className="px-4 md:px-6 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]/60 flex items-center gap-3"
        >
          <Plus className="w-4 h-4 text-[#14B8A6] shrink-0 stroke-[2.25]" />
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick capture: type a task title and press Enter…"
            aria-label="Quick capture task title"
            className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
          />
          {quickTitle.trim() && (
            <button
              type="submit"
              className="h-8 px-3 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-xs font-semibold text-white transition-colors whitespace-nowrap"
            >
              Add Task
            </button>
          )}
        </form>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] tracking-[0.02em]">
          <div className="col-span-6 flex items-center gap-3">
            <TaskCheckbox
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              ariaLabel="Select all visible tasks"
            />
            <span>Task Deliverable</span>
          </div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1 text-right">Due</div>
          <div className="col-span-2 text-right">Assignee</div>
        </div>

        {/* Rows or Empty State */}
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-9 h-9 text-[#CBD5E1] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-[#111C2D]">
              No matching tasks found
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Adjust your active status, workstream, or search filters, or create a new deliverable.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  onResetFilters();
                }}
                className="h-9 px-4 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-semibold text-[#1E293B] transition-colors"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={onOpenNewTask}
                className="h-9 px-4 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-xs font-semibold text-white transition-colors"
              >
                New Task
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {filteredTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const member = members.find((m) => m.id === task.assigneeId);
              const isSelected = selectedIds.includes(task.id);
              const isDone = task.status === 'completed';
              const doneSub = task.subtasks.filter((s) => s.completed).length;
              const totalSub = task.subtasks.length;
              const subPct =
                totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className={`group px-4 md:px-6 py-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#EFF6FF]/60' : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  {/* Title + Selection/Completion + Subtask Metadata */}
                  <div className="md:col-span-6 flex items-start md:items-center gap-3 min-w-0">
                    <div className="flex items-center gap-2 pt-0.5 md:pt-0 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelectRow(task.id)}
                        aria-label={`Select ${task.code}`}
                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                      />
                      <TaskCheckbox
                        checked={isDone}
                        onChange={() => onToggleComplete(task.id)}
                        ariaLabel={`Toggle completion for ${task.title}`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-[#64748B] shrink-0">
                          {task.code}
                        </span>
                        <span
                          className={`text-sm font-medium truncate ${
                            isDone ? 'line-through text-[#94A3B8]' : 'text-[#111C2D]'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
                        <span>{project?.name}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.points} pts</span>
                        {totalSub > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                              <ListChecks className="w-3 h-3 text-[#94A3B8]" />
                              <span>
                                {doneSub}/{totalSub}
                              </span>
                              <span className="w-12 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden inline-block">
                                <span
                                  className="block h-full rounded-full bg-[#14B8A6]"
                                  style={{ width: `${subPct}%` }}
                                />
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-start">
                    <StatusLabel status={task.status} />
                    <span className="md:hidden">
                      <PriorityTag priority={task.priority} />
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="hidden md:flex md:col-span-1 items-center">
                    <PriorityTag priority={task.priority} />
                  </div>

                  {/* Due Date */}
                  <div className="hidden md:flex md:col-span-1 items-center justify-end gap-1 text-xs font-mono tabular-nums text-[#64748B]">
                    <Calendar className="w-3 h-3 text-[#94A3B8]" />
                    <span>{task.dueDate.slice(5)}</span>
                  </div>

                  {/* Assignee */}
                  <div className="hidden md:flex md:col-span-2 items-center justify-end gap-2 min-w-0">
                    {member && (
                      <>
                        <span className="text-xs text-[#45464F] truncate">
                          {member.name}
                        </span>
                        <Avatar
                          src={member.avatarUrl}
                          name={member.name}
                          size="xs"
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
