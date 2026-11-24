import React from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Minus } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../types/taskflow';

interface PriorityTagProps {
  priority: TaskPriority;
}

export const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
  if (priority === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC2626] whitespace-nowrap shrink-0">
        <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] stroke-[2]" />
        <span>High</span>
      </span>
    );
  }
  if (priority === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] whitespace-nowrap shrink-0">
        <ArrowUpRight className="w-3.5 h-3.5 text-[#F59E0B] stroke-[2]" />
        <span>Medium</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A] whitespace-nowrap shrink-0">
      <Minus className="w-3.5 h-3.5 text-[#22C55E] stroke-[2]" />
      <span>Low</span>
    </span>
  );
};

interface StatusLabelProps {
  status: TaskStatus;
}

export const STATUS_META: Record<
  TaskStatus,
  { label: string; textClass: string; bgClass: string }
> = {
  backlog: {
    label: 'Backlog',
    textClass: 'text-[#64748B]',
    bgClass: 'bg-[#F1F5F9]',
  },
  in_progress: {
    label: 'In Progress',
    textClass: 'text-[#0058BE]',
    bgClass: 'bg-[#EFF6FF]',
  },
  in_review: {
    label: 'In Review',
    textClass: 'text-[#0F766E]',
    bgClass: 'bg-[#F0FDFA]',
  },
  completed: {
    label: 'Completed',
    textClass: 'text-[#16A34A]',
    bgClass: 'bg-[#F0FDF4]',
  },
};

export const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 ${meta.bgClass} ${meta.textClass}`}
    >
      {status === 'completed' ? (
        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
      ) : (
        <Clock className="w-3.5 h-3.5 stroke-[2]" />
      )}
      <span>{meta.label}</span>
    </span>
  );
};
