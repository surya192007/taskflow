import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
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

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  projects: Project[];
  members: TeamMember[];
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  projects,
  members,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    setNewSubtaskTitle('');
  }, [task?.id]);

  useEffect(() => {
    if (!task) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [task, onClose]);

  if (!task) return null;

  const assignee = members.find((m) => m.id === task.assigneeId);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPct =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleToggleSubtask = (subtaskId: string) => {
    const updated = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask(task.id, { subtasks: updated });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubtaskTitle.trim();
    if (!trimmed) return;
    const next = {
      id: `st-${Date.now()}`,
      title: trimmed,
      completed: false,
    };
    onUpdateTask(task.id, { subtasks: [...task.subtasks, next] });
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    onUpdateTask(task.id, {
      subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-task-code"
    >
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <aside className="relative z-10 w-full max-w-xl bg-white h-full border-l border-[#E2E8F0] modal-shadow flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              id="drawer-task-code"
              className="text-xs font-mono font-semibold text-[#64748B] tracking-[0.02em]"
            >
              {task.code}
            </span>
            <StatusLabel status={task.status} />
            <PriorityTag priority={task.priority} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteTask(task.id);
                    onClose();
                  }}
                  className="h-8 px-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#1E293B]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete task"
                title="Delete task"
                className="p-2 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              >
                <Trash2 className="w-4 h-4 stroke-[1.75]" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close task drawer"
              className="p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Editable Title & Description */}
          <div className="space-y-3">
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
              aria-label="Task title"
              className="w-full text-xl font-semibold text-[#111C2D] tracking-[-0.015em] bg-transparent border border-transparent hover:border-[#E2E8F0] focus:border-[#3B82F6] focus:bg-white rounded-xl px-2.5 py-1.5 -mx-2.5 focus:outline-none focus:ring-[3px] focus:ring-[#3B82F6]/15 transition-all"
            />
            <textarea
              rows={3}
              value={task.description}
              onChange={(e) => onUpdateTask(task.id, { description: e.target.value })}
              placeholder="Add execution context or acceptance criteria…"
              aria-label="Task description"
              className="w-full text-sm leading-relaxed text-[#45464F] bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#3B82F6] rounded-xl p-3.5 focus:outline-none focus:ring-[3px] focus:ring-[#3B82F6]/15 resize-none transition-all"
            />
          </div>

          {/* Structured Properties Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F1F5F9]">
            <div>
              <label
                htmlFor="drawer-status"
                className="block text-xs font-semibold text-[#64748B] mb-1.5"
              >
                Status
              </label>
              <select
                id="drawer-status"
                value={task.status}
                onChange={(e) =>
                  onUpdateTask(task.id, { status: e.target.value as TaskStatus })
                }
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="drawer-priority"
                className="block text-xs font-semibold text-[#64748B] mb-1.5"
              >
                Priority
              </label>
              <select
                id="drawer-priority"
                value={task.priority}
                onChange={(e) =>
                  onUpdateTask(task.id, { priority: e.target.value as TaskPriority })
                }
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="drawer-assignee"
                className="block text-xs font-semibold text-[#64748B] mb-1.5"
              >
                Assignee
              </label>
              <div className="flex items-center gap-2">
                {assignee && (
                  <Avatar src={assignee.avatarUrl} name={assignee.name} size="sm" />
                )}
                <select
                  id="drawer-assignee"
                  value={task.assigneeId}
                  onChange={(e) =>
                    onUpdateTask(task.id, { assigneeId: e.target.value })
                  }
                  className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="drawer-project"
                className="block text-xs font-semibold text-[#64748B] mb-1.5"
              >
                Workstream
              </label>
              <select
                id="drawer-project"
                value={task.projectId}
                onChange={(e) =>
                  onUpdateTask(task.id, { projectId: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="drawer-due"
                className="block text-xs font-semibold text-[#64748B] mb-1.5"
              >
                Target Due Date
              </label>
              <input
                id="drawer-due"
                type="date"
                value={task.dueDate}
                onChange={(e) =>
                  onUpdateTask(task.id, { dueDate: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-mono tabular-nums text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              />
            </div>

            <div>
              <label
                htmlFor="drawer-points"
                className="block text-xs font-semibold text-[#64748B] mb-1.5"
              >
                Effort Estimate
              </label>
              <select
                id="drawer-points"
                value={task.points}
                onChange={(e) =>
                  onUpdateTask(task.id, { points: Number(e.target.value) })
                }
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-mono tabular-nums text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              >
                <option value={1}>1 pt</option>
                <option value={2}>2 pts</option>
                <option value={3}>3 pts</option>
                <option value={5}>5 pts</option>
                <option value={8}>8 pts</option>
              </select>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111C2D]">
                Subtasks
              </h3>
              <span className="text-xs font-mono tabular-nums text-[#64748B]">
                {completedSubtasks}/{totalSubtasks} complete ({progressPct}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#14B8A6] transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Subtask Rows */}
            <div className="divide-y divide-[#F1F5F9]">
              {task.subtasks.length === 0 ? (
                <p className="py-3 text-xs text-[#64748B]">
                  No subtasks logged yet. Break this deliverable into concrete steps below.
                </p>
              ) : (
                task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="group py-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <TaskCheckbox
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(sub.id)}
                        ariaLabel={`Mark subtask ${sub.title} complete`}
                      />
                      <span
                        className={`text-sm truncate ${
                          sub.completed
                            ? 'line-through text-[#94A3B8]'
                            : 'text-[#1E293B]'
                        }`}
                      >
                        {sub.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      aria-label={`Remove subtask ${sub.title}`}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded text-[#94A3B8] hover:text-[#DC2626] transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a subtask…"
                aria-label="New subtask title"
                className="flex-1 h-9 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-xs font-semibold text-[#1E293B] transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3.5 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B] shrink-0">
          <span className="font-mono tabular-nums">
            {task.points} story pts · Due {task.dueDate}
          </span>
          <button
            type="button"
            onClick={() =>
              onUpdateTask(task.id, {
                status: task.status === 'completed' ? 'in_progress' : 'completed',
              })
            }
            className={`h-8 px-3.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
              task.status === 'completed'
                ? 'bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9]'
                : 'bg-[#14B8A6] hover:bg-[#0D9488] text-white'
            }`}
          >
            {task.status === 'completed' ? 'Reopen Task' : 'Mark Complete'}
          </button>
        </div>
      </aside>
    </div>
  );
};
