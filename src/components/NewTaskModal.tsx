import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
  TeamMember,
} from '../types/taskflow';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id' | 'code' | 'updatedAt'>) => void;
  projects: Project[];
  members: TeamMember[];
  activeSprintId: string;
  defaultStatus?: TaskStatus;
  defaultProjectId?: string;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  projects,
  members,
  activeSprintId,
  defaultStatus = 'backlog',
  defaultProjectId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState(
    defaultProjectId && defaultProjectId !== 'all'
      ? defaultProjectId
      : projects[0]?.id ?? 'p-core'
  );
  const [assigneeId, setAssigneeId] = useState(members[0]?.id ?? 'm-elena');
  const [dueDate, setDueDate] = useState('2026-11-28');
  const [points, setPoints] = useState(3);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus(defaultStatus);
      if (defaultProjectId && defaultProjectId !== 'all') {
        setProjectId(defaultProjectId);
      }
      setError('');
    }
  }, [isOpen, defaultStatus, defaultProjectId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a task title.');
      return;
    }

    onCreate({
      title: trimmed,
      description: description.trim(),
      status,
      priority,
      projectId,
      assigneeId,
      dueDate,
      startDayOffset: 6,
      durationDays: 3,
      points,
      sprintId: activeSprintId,
      subtasks: [],
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setPoints(3);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-task-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] modal-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h2
            id="new-task-modal-title"
            className="text-lg font-semibold text-[#111C2D] tracking-[-0.015em]"
          >
            Create Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.75]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="task-title-input"
              className="block text-xs font-semibold text-[#45464F] mb-1.5"
            >
              Task Title
            </label>
            <input
              id="task-title-input"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Implement webhook signature verification"
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
            />
            {error && (
              <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{error}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="task-desc-input"
              className="block text-xs font-semibold text-[#45464F] mb-1.5"
            >
              Description
            </label>
            <textarea
              id="task-desc-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope, acceptance criteria, or technical notes…"
              className="w-full p-3.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-project-select"
                className="block text-xs font-semibold text-[#45464F] mb-1.5"
              >
                Workstream
              </label>
              <select
                id="task-project-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
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
                htmlFor="task-assignee-select"
                className="block text-xs font-semibold text-[#45464F] mb-1.5"
              >
                Assignee
              </label>
              <select
                id="task-assignee-select"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority-select"
                className="block text-xs font-semibold text-[#45464F] mb-1.5"
              >
                Priority
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-status-select"
                className="block text-xs font-semibold text-[#45464F] mb-1.5"
              >
                Status
              </label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-due-input"
                className="block text-xs font-semibold text-[#45464F] mb-1.5"
              >
                Due Date
              </label>
              <input
                id="task-due-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-mono tabular-nums text-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-[3px] focus:ring-[#3B82F6]/15"
              />
            </div>

            <div>
              <label
                htmlFor="task-points-select"
                className="block text-xs font-semibold text-[#45464F] mb-1.5"
              >
                Effort Estimate
              </label>
              <select
                id="task-points-select"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
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

          <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-sm font-medium text-[#1E293B] transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#172554] hover:bg-[#1E3A8A] active:scale-[0.98] text-sm font-semibold text-white transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
