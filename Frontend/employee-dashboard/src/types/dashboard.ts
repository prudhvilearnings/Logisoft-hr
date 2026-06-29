export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  projectName?: string;
  isArchived?: boolean;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string;
  progress: number; // 0 to 100
  status: ProjectStatus;
  dueDate: string;
  teamSize: number;
  manager: string;
  description: string;
  isArchived?: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  type: 'sick' | 'vacation' | 'casual' | 'maternity';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface DepartmentStats {
  name: string;
  budget: number;
  spent: number;
  headcount: number;
  performance: number; // 0 to 100
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  role: string;
}

export interface EmployeeOverview {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'on_leave' | 'remote';
  workload: number; // number of tasks
  performanceScore: number;
  teamLeaderId?: string;
  isTeamLeader?: boolean;
}
