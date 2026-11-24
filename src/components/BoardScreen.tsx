import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ListChecks, Plus } from 'lucide-react';
import {
  Project,
  Task,
  TaskStatus,
  TeamMember,
} from '../types/taskflow';
import { Avatar } from './Avatar';
import { PriorityTag } from './PriorityTag';

interface BoardScreenProps {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
  onOpenNewTaskForColumn: (status: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; title: string; accent: string }[] = [
  { id: 'backlog', title: 'Backlog', accent: '#64748B' },
  { id: 'in_progress', title: 'In Progress', accent: '#3B82F6' },
  { id: 'in_review', title: 'In Review', accent: '#14B8A6' },
  { id: 'completed', title: 'Completed', accent: '#22C55E' },
];

export const BoardScreen: React.FC<BoardScreenProps> = ({
  tasks,
  projects,
  members,
  onMoveTask,
  onSelectTask,
  onOpenNewTaskForColumn,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      onMoveTask(id, targetStatus);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          Drag cards between stages or use quick-move arrows to update workflow state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col, colIdx) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const colPoints = colTasks.reduce((sum, t) => sum + t.points, 0);
          const isDropTarget = dragOverColumn === col.id;

          return (
            <section
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverColumn !== col.id) setDragOverColumn(col.id);
              }}
              onDragLeave={() => {
                if (dragOverColumn === col.id) setDragOverColumn(null);
              }}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl p-3.5 transition-colors min-h-[420px] flex flex-col ${
                isDropTarget
                  ? 'bg-[#EFF6FF] ring-2 ring-[#3B82F6]/40'
                  : 'bg-[#F1F5F9]/75'
              }`}
            >
              {/* Column Header */}
              <div className="px-1.5 pb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-[2px] shrink-0"
                    style={{ backgroundColor: col.accent }}
                  />
                  <h3 className="text-sm font-semibold text-[#111C2D] truncate">
                    {col.title}
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-[#64748B]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono tabular-nums text-[#64748B]">
                    {colPoints} pts
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenNewTaskForColumn(col.id)}
                    aria-label={`Add task to ${col.title}`}
                    title={`Add task to ${col.title}`}
                    className="p-1 rounded-lg text-[#64748B] hover:text-[#111C2D] hover:bg-white transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="border border-dashed border-[#CBD5E1] rounded-xl p-6 text-center text-xs text-[#64748B]">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const member = members.find((m) => m.id === task.assigneeId);
                    const doneSub = task.subtasks.filter((s) => s.completed).length;
                    const totalSub = task.subtasks.length;
                    const subPct =
                      totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

                    return (
                      <article
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedTaskId(task.id);
                          e.dataTransfer.setData('text/plain', task.id);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverColumn(null);
                        }}
                        onClick={() => onSelectTask(task)}
                        className="group bg-white border border-[#E2E8F0] rounded-xl p-4 cursor-pointer card-hover-lift space-y-3"
                      >
                        {/* Kicker line: Code + Project + Priority */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-mono text-[#64748B] truncate">
                            {task.code} · {project?.name}
                          </span>
                          <PriorityTag priority={task.priority} />
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-semibold text-[#111C2D] leading-snug">
                          {task.title}
                        </h4>

                        {/* Subtasks Progress Bar */}
                        {totalSub > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#64748B]">
                              <span className="inline-flex items-center gap-1">
                                <ListChecks className="w-3 h-3" />
                                Subtasks
                              </span>
                              <span>
                                {doneSub}/{totalSub}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#14B8A6] transition-all duration-200"
                                style={{ width: `${subPct}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Card Footer: Due Date + Quick Stage Move + Avatar */}
                        <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-[#64748B]">
                            <Calendar className="w-3 h-3 text-[#94A3B8]" />
                            <span>{task.dueDate.slice(5)}</span>
                            <span aria-hidden="true">·</span>
                            <span>{task.points}p</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Quick move buttons for keyboard/touch accessibility */}
                            {colIdx > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMoveTask(task.id, COLUMNS[colIdx - 1].id);
                                }}
                                aria-label={`Move ${task.code} back to ${COLUMNS[colIdx - 1].title}`}
                                title={`Move to ${COLUMNS[colIdx - 1].title}`}
                                className="opacity-70 group-hover:opacity-100 p-1 rounded-md hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#111C2D] transition-colors"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {colIdx < COLUMNS.length - 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMoveTask(task.id, COLUMNS[colIdx + 1].id);
                                }}
                                aria-label={`Move ${task.code} forward to ${COLUMNS[colIdx + 1].title}`}
                                title={`Move to ${COLUMNS[colIdx + 1].title}`}
                                className="opacity-70 group-hover:opacity-100 p-1 rounded-md hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#111C2D] transition-colors"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {member && (
                              <Avatar
                                src={member.avatarUrl}
                                name={member.name}
                                size="xs"
                              />
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
