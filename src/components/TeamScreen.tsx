import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Project, Task, TeamMember } from '../types/taskflow';
import { Avatar } from './Avatar';
import { PriorityTag, StatusLabel } from './PriorityTag';

interface TeamScreenProps {
  members: TeamMember[];
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
  onViewMemberTasks: (memberId: string) => void;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({
  members,
  tasks,
  projects,
  onSelectTask,
  onViewMemberTasks,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold text-[#111C2D] tracking-[-0.02em]">
            Engineering & Product Capacity
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Monitor active sprint story-point allocation and review member queues.
          </p>
        </div>
      </div>

      {/* 4-Column Member Capacity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {members.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          const openTasks = memberTasks.filter((t) => t.status !== 'completed');
          const doneTasks = memberTasks.filter((t) => t.status === 'completed');
          const openPoints = openTasks.reduce((sum, t) => sum + t.points, 0);
          const donePoints = doneTasks.reduce((sum, t) => sum + t.points, 0);
          const loadPct = Math.min(
            100,
            Math.round((openPoints / member.weeklyCapacityPts) * 100)
          );

          return (
            <section
              key={member.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={member.avatarUrl}
                    name={member.name}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[#111C2D] truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#64748B] truncate">{member.role}</p>
                    <p className="text-[11px] font-medium text-[#0058BE] truncate mt-0.5">
                      {member.department}
                    </p>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1.5 pt-3 border-t border-[#F1F5F9]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B] font-medium">Active Load</span>
                    <span className="font-mono font-semibold tabular-nums text-[#111C2D]">
                      {openPoints} / {member.weeklyCapacityPts} pts ({loadPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        loadPct >= 85 ? 'bg-[#F59E0B]' : 'bg-[#14B8A6]'
                      }`}
                      style={{ width: `${loadPct}%` }}
                    />
                  </div>
                </div>

                {/* Quick Metric Pair */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="py-2 px-3 rounded-xl bg-[#F8FAFC]">
                    <p className="text-[#64748B]">Open Tasks</p>
                    <p className="mt-0.5 text-base font-bold text-[#111C2D] tabular-nums">
                      {openTasks.length}
                    </p>
                  </div>
                  <div className="py-2 px-3 rounded-xl bg-[#F8FAFC]">
                    <p className="text-[#64748B]">Burned</p>
                    <p className="mt-0.5 text-base font-bold text-[#16A34A] tabular-nums">
                      {donePoints} pts
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onViewMemberTasks(member.id)}
                className="w-full h-9 px-3 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-xs font-semibold text-[#1E293B] inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inspect Assigned Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </section>
          );
        })}
      </div>

      {/* Detailed Assignment Roster Table */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="text-base font-semibold text-[#111C2D]">
            Active Deliverables by Owner
          </h3>
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {tasks
            .filter((t) => t.status !== 'completed')
            .map((task) => {
              const member = members.find((m) => m.id === task.assigneeId);
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {member && (
                      <Avatar
                        src={member.avatarUrl}
                        name={member.name}
                        size="sm"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-[#64748B] shrink-0">
                          {task.code}
                        </span>
                        <p className="text-sm font-medium text-[#111C2D] truncate">
                          {task.title}
                        </p>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {member?.name} · {project?.name} ·{' '}
                        <span className="font-mono tabular-nums">{task.points} pts</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono tabular-nums text-[#64748B]">
                      <Calendar className="w-3 h-3 text-[#94A3B8]" />
                      {task.dueDate.slice(5)}
                    </span>
                    <StatusLabel status={task.status} />
                    <PriorityTag priority={task.priority} />
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
};
