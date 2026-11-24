export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'completed';

export type TaskPriority = 'high' | 'medium' | 'low';

export type ScreenView = 'overview' | 'tasks' | 'board' | 'sprints' | 'team';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string;
  dueDate: string; // YYYY-MM-DD
  startDayOffset: number; // 0..13 in sprint window
  durationDays: number; // 1..14
  points: number;
  sprintId: string;
  subtasks: Subtask[];
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatarUrl: string;
  weeklyCapacityPts: number;
}

export interface Project {
  id: string;
  name: string;
  leadId: string;
  accentHex: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  completedPointsArchive?: number;
  totalPointsArchive?: number;
}
