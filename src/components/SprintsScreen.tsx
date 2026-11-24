import React, { useMemo, useState } from 'react';
import { CalendarRange, CheckCircle2 } from 'lucide-react';
import { Project, Sprint, Task, TeamMember } from '../types/taskflow';
import { Avatar } from './Avatar';
import { StatusLabel } from './PriorityTag';

interface SprintsScreenProps {
  sprints: Sprint[];
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  onSelectTask: (task: Task) => void;
  onCompleteSprint: () => void;
}

const SPRINT_DAYS = [
  'Nov 16',
  'Nov 17',
  'Nov 18',
  'Nov 19',
  'Nov 20',
  'Nov 21',
  'Nov 22',
  'Nov 23',
  'Nov 24',
  'Nov 25',
  'Nov 26',
  'Nov 27',
  'Nov 28',
  'Nov 29',
];

export const SprintsScreen: React.FC<SprintsScreenProps> = ({
  sprints,
  tasks,
  projects,
  members,
  onSelectTask,
  onCompleteSprint,
}) => {
  const [confirmComplete, setConfirmComplete] = useState(false);

  const activeSprint =
    sprints.find((s) => s.status === 'active') ?? sprints[0];

  const activeTasks = useMemo(
    () => tasks.filter((t) => t.sprintId === activeSprint?.id),
    [tasks, activeSprint?.id]
  );

  const totalPoints = activeTasks.reduce((sum, t) => sum + t.points, 0);
  const completedPoints = activeTasks
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.points, 0);
  const progressPct =
    totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Active Sprint Banner */}
      {activeSprint && (
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#0F766E]">
              <CalendarRange className="w-4 h-4 stroke-[1.75]" />
              <span>Active Execution Cycle</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#64748B]">
                {activeSprint.startDate} to {activeSprint.endDate}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#111C2D] tracking-[-0.02em]">
              {activeSprint.name}
            </h2>
            <p className="text-sm text-[#45464F]">{activeSprint.goal}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 shrink-0">
            <div className="min-w-[190px] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Sprint Progress</span>
                <span className="font-mono font-semibold tabular-nums text-[#111C2D]">
                  {progressPct}% ({completedPoints}/{totalPoints} pts)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#14B8A6] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {confirmComplete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onCompleteSprint();
                    setConfirmComplete(false);
                  }}
                  className="h-10 px-4 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-xs font-semibold text-white transition-colors whitespace-nowrap"
                >
                  Confirm & Roll Over Open Tasks
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmComplete(false)}
                  className="h-10 px-3 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#1E293B]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmComplete(true)}
                className="h-10 px-4 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-sm font-semibold text-white transition-all whitespace-nowrap"
              >
                Complete Sprint
              </button>
            )}
          </div>
        </section>
      )}

      {/* 14-Day Sprint Schedule / Timeline */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#111C2D]">
              Sprint Deliverable Timeline
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Click any schedule bar to inspect subtasks, owners, or target date
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#0058BE] font-semibold">
            Today: Nov 24
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            {/* Timeline Day Header */}
            <div className="grid grid-cols-12 border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11px] font-mono tabular-nums text-[#64748B]">
              <div className="col-span-4 px-6 py-2.5 font-sans font-semibold">
                Deliverable
              </div>
              <div className="col-span-8 grid grid-cols-14">
                {SPRINT_DAYS.map((day, i) => (
                  <div
                    key={day}
                    className={`py-2.5 text-center border-l border-[#F1F5F9] ${
                      i === 8
                        ? 'bg-[#EFF6FF] text-[#0058BE] font-semibold'
                        : ''
                    }`}
                  >
                    {day.replace('Nov ', 'N')}
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverable Rows */}
            {activeTasks.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#64748B]">
                No tasks scheduled in this sprint yet.
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {activeTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const member = members.find((m) => m.id === task.assigneeId);
                  const startCol = Math.max(0, Math.min(13, task.startDayOffset));
                  const spanCols = Math.max(
                    1,
                    Math.min(14 - startCol, task.durationDays)
                  );
                  const leftPct = (startCol / 14) * 100;
                  const widthPct = (spanCols / 14) * 100;
                  const isDone = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="grid grid-cols-12 items-center hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <div className="col-span-4 px-6 py-3 flex items-center gap-3 min-w-0">
                        {member && (
                          <Avatar
                            src={member.avatarUrl}
                            name={member.name}
                            size="xs"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#111C2D] truncate">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] truncate">
                            {task.code} · {project?.name}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-8 relative h-12 flex items-center px-1">
                        {/* Vertical day gridlines */}
                        <div className="absolute inset-0 grid grid-cols-14 pointer-events-none">
                          {SPRINT_DAYS.map((d, idx) => (
                            <div
                              key={d}
                              className={`border-l border-[#F1F5F9] h-full ${
                                idx === 8 ? 'bg-[#EFF6FF]/40' : ''
                              }`}
                            />
                          ))}
                        </div>

                        {/* Bar */}
                        <div
                          className="relative z-10 h-7 rounded-lg px-2.5 flex items-center justify-between gap-2 text-[11px] font-medium text-white truncate transition-opacity hover:opacity-95"
                          style={{
                            marginLeft: `${leftPct}%`,
                            width: `${widthPct}%`,
                            backgroundColor: isDone
                              ? '#14B8A6'
                              : project?.accentHex ?? '#172554',
                          }}
                        >
                          <span className="truncate font-mono">{task.code}</span>
                          <span className="font-mono tabular-nums opacity-85 shrink-0">
                            {task.points}p
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sprint Cadence History & Upcoming */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="text-base font-semibold text-[#111C2D]">
            Sprint Cadence & Archive
          </h3>
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {sprints.map((sp) => {
            const spTasks = tasks.filter((t) => t.sprintId === sp.id);
            const spTotal =
              sp.totalPointsArchive ??
              spTasks.reduce((acc, t) => acc + t.points, 0);
            const spDone =
              sp.completedPointsArchive ??
              spTasks
                .filter((t) => t.status === 'completed')
                .reduce((acc, t) => acc + t.points, 0);

            return (
              <div
                key={sp.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-[#111C2D]">
                      {sp.name}
                    </span>
                    {sp.status === 'completed' ? (
                      <StatusLabel status="completed" />
                    ) : sp.status === 'active' ? (
                      <StatusLabel status="in_progress" />
                    ) : (
                      <StatusLabel status="backlog" />
                    )}
                  </div>
                  <p className="text-xs text-[#64748B]">{sp.goal}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-[#64748B] shrink-0">
                  <span>
                    {sp.startDate} – {sp.endDate}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#111C2D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6]" />
                    {spDone}/{spTotal} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
