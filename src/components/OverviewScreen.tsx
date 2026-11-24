import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import {
  Project,
  ScreenView,
  Sprint,
  Task,
  TeamMember,
} from '../types/taskflow';
import { Avatar } from './Avatar';
import { PriorityTag, StatusLabel } from './PriorityTag';
import { TaskCheckbox } from './TaskCheckbox';

interface OverviewScreenProps {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  activeSprint: Sprint;
  onToggleComplete: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onNavigate: (screen: ScreenView) => void;
  onFilterByMember: (memberId: string) => void;
  onCompleteSprint: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  tasks,
  projects,
  members,
  activeSprint,
  onToggleComplete,
  onSelectTask,
  onNavigate,
  onFilterByMember,
  onCompleteSprint,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  const metrics = useMemo(() => {
    const sprintTasks = tasks.filter((t) => t.sprintId === activeSprint.id);
    const totalCount = sprintTasks.length;
    const completedCount = sprintTasks.filter((t) => t.status === 'completed').length;
    const inReviewCount = sprintTasks.filter((t) => t.status === 'in_review').length;
    const activeCount = sprintTasks.filter((t) => t.status !== 'completed').length;
    const highPriorityOpen = sprintTasks.filter(
      (t) => t.priority === 'high' && t.status !== 'completed'
    ).length;

    const totalPoints = sprintTasks.reduce((acc, t) => acc + t.points, 0);
    const completedPoints = sprintTasks
      .filter((t) => t.status === 'completed')
      .reduce((acc, t) => acc + t.points, 0);
    const completionPct =
      totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

    return {
      totalCount,
      completedCount,
      inReviewCount,
      activeCount,
      highPriorityOpen,
      totalPoints,
      completedPoints,
      completionPct,
    };
  }, [tasks, activeSprint.id]);

  // Focus queue: active tasks sorted by priority (high -> medium -> low) then due date
  const priorityQueue = useMemo(() => {
    const rank = { high: 0, medium: 1, low: 2 };
    return [...tasks]
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => {
        if (rank[a.priority] !== rank[b.priority]) {
          return rank[a.priority] - rank[b.priority];
        }
        return a.dueDate.localeCompare(b.dueDate);
      })
      .slice(0, 6);
  }, [tasks]);

  // Burndown series across 10 sprint workdays anchored to live total & remaining points
  const burndownSeries = useMemo(() => {
    const total = Math.max(metrics.totalPoints, 10);
    const remaining = Math.max(metrics.totalPoints - metrics.completedPoints, 0);
    const days = [
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
    ];
    // Actual trajectory converges onto live remaining points on Day 9 (Nov 24)
    const ratios = [1, 0.94, 0.88, 0.78, 0.72, 0.62, 0.56, 0.48];
    return days.map((label, idx) => {
      const ideal = Math.round(total * (1 - idx / 9));
      let actual: number | null = null;
      if (idx < ratios.length) {
        actual = Math.max(remaining, Math.round(total * ratios[idx]));
      } else if (idx === 8) {
        actual = remaining;
      }
      return { label, ideal, actual };
    });
  }, [metrics.totalPoints, metrics.completedPoints]);

  const chartWidth = 600;
  const chartHeight = 190;
  const padX = 34;
  const padY = 20;
  const plotW = chartWidth - padX * 2;
  const plotH = chartHeight - padY * 2;
  const maxVal = Math.max(metrics.totalPoints, 10);

  const getX = (idx: number) => padX + (idx / 9) * plotW;
  const getY = (val: number) => padY + plotH - (val / maxVal) * plotH;

  const idealPath = burndownSeries
    .map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(d.ideal)}`)
    .join(' ');

  const actualPoints = burndownSeries.filter((d) => d.actual !== null);
  const actualPath = actualPoints
    .map(
      (d, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(d.actual as number)}`
    )
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Executive Headline & Quick Sprint Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0058BE] tracking-[0.02em] mb-1">
            {activeSprint.name}
          </p>
          <h2 className="text-2xl md:text-[28px] font-semibold text-[#111C2D] tracking-[-0.025em] leading-tight">
            Sprint Execution & Priority Queue
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('board')}
            className="h-10 px-4 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-sm font-medium text-[#1E293B] transition-colors whitespace-nowrap"
          >
            Open Kanban Board
          </button>
          <button
            type="button"
            onClick={onCompleteSprint}
            className="h-10 px-4 rounded-xl bg-[#172554] hover:bg-[#1E3A8A] active:scale-[0.98] text-sm font-semibold text-white transition-all whitespace-nowrap"
          >
            Complete Sprint
          </button>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <button
          type="button"
          onClick={() => onNavigate('sprints')}
          className="text-left bg-white border border-[#E2E8F0] rounded-2xl p-5 card-hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <p className="text-xs font-semibold text-[#64748B]">Sprint Completion</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-[28px] font-bold text-[#111C2D] tracking-[-0.03em] tabular-nums">
              {metrics.completionPct}%
            </span>
            <span className="text-xs font-mono tabular-nums text-[#16A34A] font-medium">
              {metrics.completedPoints}/{metrics.totalPoints} pts
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#14B8A6] transition-all duration-300"
              style={{ width: `${metrics.completionPct}%` }}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tasks')}
          className="text-left bg-white border border-[#E2E8F0] rounded-2xl p-5 card-hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <p className="text-xs font-semibold text-[#64748B]">Active Tasks</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-[28px] font-bold text-[#111C2D] tracking-[-0.03em] tabular-nums">
              {metrics.activeCount}
            </span>
            <span className="text-xs font-medium text-[#DC2626] tabular-nums">
              {metrics.highPriorityOpen} high priority
            </span>
          </div>
          <p className="mt-3 text-xs text-[#64748B] tabular-nums">
            {metrics.completedCount} of {metrics.totalCount} deliverables done
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('board')}
          className="text-left bg-white border border-[#E2E8F0] rounded-2xl p-5 card-hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <p className="text-xs font-semibold text-[#64748B]">In Review Queue</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-[28px] font-bold text-[#111C2D] tracking-[-0.03em] tabular-nums">
              {metrics.inReviewCount}
            </span>
            <span className="text-xs font-medium text-[#0058BE]">
              Awaiting sign-off
            </span>
          </div>
          <p className="mt-3 text-xs text-[#64748B]">
            Ready for architecture & QA check
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('team')}
          className="text-left bg-white border border-[#E2E8F0] rounded-2xl p-5 card-hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <p className="text-xs font-semibold text-[#64748B]">Sprint Window</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-[28px] font-bold text-[#111C2D] tracking-[-0.03em] tabular-nums">
              5d
            </span>
            <span className="text-xs font-mono tabular-nums text-[#64748B]">
              Ends Nov 29
            </span>
          </div>
          <p className="mt-3 text-xs text-[#64748B]">
            4 engineers · 74 pts weekly cap
          </p>
        </button>
      </div>

      {/* Main 12-Column Asymmetric Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Priority Focus Queue + Sprint Burndown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Priority Focus Queue */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#111C2D] tracking-[-0.01em]">
                  Priority Focus Queue
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Highest-urgency open deliverables ranked by priority and target date
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('tasks')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0058BE] hover:text-[#172554] whitespace-nowrap shrink-0"
              >
                <span>View all tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {priorityQueue.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#14B8A6] mx-auto mb-2 stroke-[1.75]" />
                <p className="text-sm font-semibold text-[#111C2D]">
                  All active tasks completed
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  Your priority queue is clear for this workstream.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {priorityQueue.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const member = members.find((m) => m.id === task.assigneeId);
                  const doneSub = task.subtasks.filter((s) => s.completed).length;
                  const totalSub = task.subtasks.length;
                  const isDone = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="group px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <TaskCheckbox
                          checked={isDone}
                          onChange={() => onToggleComplete(task.id)}
                          ariaLabel={`Toggle completion for ${task.title}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-mono text-[#64748B] shrink-0">
                              {task.code}
                            </span>
                            <p
                              className={`text-sm font-medium truncate ${
                                isDone
                                  ? 'line-through text-[#94A3B8]'
                                  : 'text-[#111C2D]'
                              }`}
                            >
                              {task.title}
                            </p>
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
                            <span>{project?.name ?? 'General'}</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                              <Calendar className="w-3 h-3 text-[#94A3B8]" />
                              {task.dueDate}
                            </span>
                            {totalSub > 0 && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                                  <ListChecks className="w-3 h-3 text-[#94A3B8]" />
                                  {doneSub}/{totalSub} subtasks
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:block">
                          <StatusLabel status={task.status} />
                        </div>
                        <PriorityTag priority={task.priority} />
                        {member && (
                          <Avatar
                            src={member.avatarUrl}
                            name={member.name}
                            size="sm"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sprint Burndown Chart */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#111C2D] tracking-[-0.01em]">
                  Sprint Burndown Trajectory
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Remaining story points across the 10-day active sprint cycle
                </p>
              </div>
              <div className="flex items-center gap-5 text-xs font-medium text-[#45464F]">
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#CBD5E1] inline-block" />
                  Ideal Pace
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#14B8A6] inline-block" />
                  Actual Remaining
                </span>
              </div>
            </div>

            <div className="relative w-full">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-48 overflow-visible"
                role="img"
                aria-label="Sprint burndown line chart"
              >
                {/* Horizontal gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                  const val = Math.round(maxVal * t);
                  const y = getY(val);
                  return (
                    <g key={t}>
                      <line
                        x1={padX}
                        y1={y}
                        x2={chartWidth - padX}
                        y2={y}
                        stroke="#F1F5F9"
                        strokeWidth={1}
                      />
                      <text
                        x={padX - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-[#94A3B8] text-[10px] font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Ideal Line */}
                <path
                  d={idealPath}
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />

                {/* Actual Line */}
                <path
                  d={actualPath}
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Data Points */}
                {burndownSeries.map((d, idx) => {
                  const x = getX(idx);
                  const isHovered = hoveredDayIndex === idx;
                  return (
                    <g key={d.label}>
                      {isHovered && (
                        <line
                          x1={x}
                          y1={padY}
                          x2={x}
                          y2={chartHeight - padY}
                          stroke="#E2E8F0"
                          strokeWidth={1}
                        />
                      )}
                      {d.actual !== null && (
                        <circle
                          cx={x}
                          cy={getY(d.actual)}
                          r={isHovered ? 5 : 3.5}
                          fill={isHovered ? '#172554' : '#14B8A6'}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                        />
                      )}
                      <text
                        x={x}
                        y={chartHeight - 2}
                        textAnchor="middle"
                        className={`text-[10px] font-mono ${
                          isHovered ? 'fill-[#111C2D] font-semibold' : 'fill-[#94A3B8]'
                        }`}
                      >
                        {idx % 2 === 0 || isHovered ? d.label : ''}
                      </text>
                      {/* Invisible hover hit target */}
                      <rect
                        x={x - plotW / 20}
                        y={padY}
                        width={plotW / 10}
                        height={plotH}
                        fill="transparent"
                        className="cursor-crosshair"
                        onMouseEnter={() => setHoveredDayIndex(idx)}
                        onMouseLeave={() => setHoveredDayIndex(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hover Readout Bar */}
              <div className="mt-2 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                {hoveredDayIndex !== null ? (
                  <>
                    <span className="font-semibold text-[#111C2D]">
                      {burndownSeries[hoveredDayIndex].label}
                    </span>
                    <span className="font-mono tabular-nums">
                      Ideal: {burndownSeries[hoveredDayIndex].ideal} pts · Actual:{' '}
                      {burndownSeries[hoveredDayIndex].actual !== null
                        ? `${burndownSeries[hoveredDayIndex].actual} pts`
                        : 'Projected'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Sprint Day 9 of 10</span>
                    <span className="font-mono tabular-nums">
                      {metrics.totalPoints - metrics.completedPoints} pts remaining
                    </span>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right 4 Columns: Sprint Goal & Team Capacity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Sprint Summary */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#0F766E]">
                Active Sprint Goal
              </span>
              <h3 className="text-base font-semibold text-[#111C2D] mt-1">
                {activeSprint.name}
              </h3>
              <p className="text-sm text-[#45464F] mt-1.5 leading-relaxed">
                {activeSprint.goal}
              </p>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#64748B]">Points Burned</span>
                <span className="font-mono font-semibold tabular-nums text-[#111C2D]">
                  {metrics.completedPoints} / {metrics.totalPoints} pts
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#14B8A6] transition-all duration-300"
                  style={{ width: `${metrics.completionPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#64748B] font-mono tabular-nums">
                <span>{activeSprint.startDate}</span>
                <span>{activeSprint.endDate}</span>
              </div>
            </div>
          </section>

          {/* Team Workload Snapshot */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#111C2D]">
                Team Allocation
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('team')}
                className="text-xs font-semibold text-[#0058BE] hover:text-[#172554]"
              >
                Capacity View
              </button>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {members.map((member) => {
                const memberOpenTasks = tasks.filter(
                  (t) => t.assigneeId === member.id && t.status !== 'completed'
                );
                const openPoints = memberOpenTasks.reduce((s, t) => s + t.points, 0);
                const loadPct = Math.min(
                  100,
                  Math.round((openPoints / member.weeklyCapacityPts) * 100)
                );

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => onFilterByMember(member.id)}
                    className="w-full px-6 py-3.5 flex items-center gap-3.5 hover:bg-[#F8FAFC] text-left transition-colors"
                  >
                    <Avatar src={member.avatarUrl} name={member.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[#111C2D] truncate">
                          {member.name}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-[#64748B] shrink-0">
                          {memberOpenTasks.length} active · {openPoints} pts
                        </span>
                      </div>
                      <div className="mt-2 w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            loadPct >= 85 ? 'bg-[#F59E0B]' : 'bg-[#14B8A6]'
                          }`}
                          style={{ width: `${loadPct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
