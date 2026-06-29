import type { Task, Project, LeaveRequest, DepartmentStats, ActivityLog, EmployeeOverview } from '../types/dashboard';

// --- MOCK DATABASE ---

export let MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_01',
    name: 'Logisoft Core HR Portal',
    progress: 75,
    status: 'active',
    dueDate: '2026-07-20',
    teamSize: 8,
    manager: 'Jane Doe',
    description: 'Re-engineering the central internal portal for staff administration and automated sprint reporting.',
  },
  {
    id: 'proj_02',
    name: 'Cloud Infrastructure Migration',
    progress: 90,
    status: 'active',
    dueDate: '2026-07-05',
    teamSize: 4,
    manager: 'John Smith',
    description: 'Migrating storage pipelines and DB instances from legacy servers to highly scalable AWS instances.',
  },
  {
    id: 'proj_03',
    name: 'Customer Billing Integration',
    progress: 35,
    status: 'active',
    dueDate: '2026-08-15',
    teamSize: 6,
    manager: 'Jane Doe',
    description: 'Building modern Stripe billing system integrations and automated PDF invoicing generators.',
  },
  {
    id: 'proj_04',
    name: 'Legacy Code Audit & Refactoring',
    progress: 100,
    status: 'completed',
    dueDate: '2026-06-25',
    teamSize: 3,
    manager: 'John Smith',
    description: 'Refactoring old frontend code to modern React 19 rules, reducing build bundle footprint.',
  },
  {
    id: 'proj_05',
    name: 'HR Chatbot Assistant AI',
    progress: 15,
    status: 'planning',
    dueDate: '2026-09-30',
    teamSize: 5,
    manager: 'Jane Doe',
    description: 'Developing LLM-based intelligent response agent to automatically address staff policy questions.',
  },
];

export let MOCK_TASKS: Task[] = [
  // Employee tasks (Alice Cooper)
  {
    id: 'tsk_01',
    title: 'Design high-fidelity user login screen mockup',
    priority: 'high',
    status: 'done',
    dueDate: '2026-06-28',
    assigneeId: 'emp_01',
    assigneeName: 'Alice Cooper',
    projectName: 'Logisoft Core HR Portal',
  },
  {
    id: 'tsk_02',
    title: 'Code Zustand stores and session token refresh mechanics',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-07-02',
    assigneeId: 'emp_01',
    assigneeName: 'Alice Cooper',
    projectName: 'Logisoft Core HR Portal',
  },
  {
    id: 'tsk_03',
    title: 'Implement floating chatbot widget CSS alignments',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-07-08',
    assigneeId: 'emp_01',
    assigneeName: 'Alice Cooper',
    projectName: 'HR Chatbot Assistant AI',
  },
  {
    id: 'tsk_04',
    title: 'Optimize dashboard Recharts SVGs for layout re-rendering',
    priority: 'low',
    status: 'todo',
    dueDate: '2026-07-14',
    assigneeId: 'emp_01',
    assigneeName: 'Alice Cooper',
    projectName: 'Logisoft Core HR Portal',
  },

  // Team Lead tasks (John Smith)
  {
    id: 'tsk_05',
    title: 'Review pull request for login page schema validation rules',
    priority: 'high',
    status: 'review',
    dueDate: '2026-06-30',
    assigneeId: 'lead_01',
    assigneeName: 'John Smith',
    projectName: 'Logisoft Core HR Portal',
  },
  {
    id: 'tsk_06',
    title: 'Define security access guard layers inside router rules',
    priority: 'high',
    status: 'done',
    dueDate: '2026-06-27',
    assigneeId: 'lead_01',
    assigneeName: 'John Smith',
    projectName: 'Logisoft Core HR Portal',
  },

  // Other tasks
  {
    id: 'tsk_07',
    title: 'Configure automated Docker build environments',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-07-06',
    assigneeId: 'emp_02',
    assigneeName: 'David Miller',
    projectName: 'Cloud Infrastructure Migration',
  },
  {
    id: 'tsk_08',
    title: 'Draft weekly database backup policy documentation',
    priority: 'low',
    status: 'todo',
    dueDate: '2026-07-10',
    assigneeId: 'emp_03',
    assigneeName: 'Sarah Jenkins',
    projectName: 'Cloud Infrastructure Migration',
  },
];

export let MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv_01',
    employeeId: 'emp_02',
    employeeName: 'David Miller',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    department: 'Software Engineering',
    type: 'vacation',
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    status: 'pending',
    reason: 'Family summer road trip to the Grand Canyon.',
  },
  {
    id: 'lv_02',
    employeeId: 'emp_03',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    department: 'Software Engineering',
    type: 'sick',
    startDate: '2026-07-01',
    endDate: '2026-07-02',
    status: 'approved',
    reason: 'Severe dental surgery recovery procedures.',
  },
  {
    id: 'lv_03',
    employeeId: 'emp_04',
    employeeName: 'Thomas Wright',
    employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    department: 'Marketing',
    type: 'casual',
    startDate: '2026-07-06',
    endDate: '2026-07-07',
    status: 'pending',
    reason: 'Urgent family personal affairs to attend.',
  },
];

export let MOCK_DEPARTMENTS: DepartmentStats[] = [
  { name: 'Software Engineering', budget: 150000, spent: 112000, headcount: 14, performance: 88 },
  { name: 'Human Resources', budget: 50000, spent: 41000, headcount: 4, performance: 92 },
  { name: 'Product Management', budget: 80000, spent: 63000, headcount: 5, performance: 85 },
  { name: 'Marketing & Sales', budget: 110000, spent: 94000, headcount: 8, performance: 80 },
];

export let MOCK_ACTIVITIES: ActivityLog[] = [
  { id: 'act_01', user: 'Alice Cooper', action: 'completed task', target: 'Design login screen mockup', time: '10 minutes ago', role: 'employee' },
  { id: 'act_02', user: 'John Smith', action: 're-routed route', target: 'Auth role guard configurations', time: '1 hour ago', role: 'lead' },
  { id: 'act_03', user: 'Jane Doe', action: 'approved leave request', target: 'Sarah Jenkins (Sick Leave)', time: '3 hours ago', role: 'manager' },
  { id: 'act_04', user: 'Alice Cooper', action: 'started working on', target: 'Zod validation definitions', time: '4 hours ago', role: 'employee' },
];

export let MOCK_EMPLOYEES: EmployeeOverview[] = [
  { id: 'emp_01', name: 'Alice Cooper', role: 'Frontend Engineer', department: 'Software Engineering', status: 'active', workload: 4, performanceScore: 94, teamLeaderId: 'lead_01' },
  { id: 'emp_02', name: 'David Miller', role: 'DevOps Engineer', department: 'Software Engineering', status: 'active', workload: 3, performanceScore: 86, teamLeaderId: 'lead_01' },
  { id: 'emp_03', name: 'Sarah Jenkins', role: 'QA Engineer', department: 'Software Engineering', status: 'on_leave', workload: 1, performanceScore: 89, teamLeaderId: 'lead_01' },
  { id: 'lead_01', name: 'John Smith', role: 'Tech Lead', department: 'Software Engineering', status: 'active', workload: 2, performanceScore: 91, isTeamLeader: true },
  { id: 'emp_04', name: 'Thomas Wright', role: 'Marketing Manager', department: 'Marketing', status: 'active', workload: 2, performanceScore: 82 },
];

// --- CHARTS METRICS PREVIEWS ---

export const WEEKLY_PROGRESS_MOCK = [
  { name: 'Mon', tasks: 2 },
  { name: 'Tue', tasks: 4 },
  { name: 'Wed', tasks: 3 },
  { name: 'Thu', tasks: 6 },
  { name: 'Fri', tasks: 5 },
  { name: 'Sat', tasks: 1 },
  { name: 'Sun', tasks: 0 },
];

export const SPRINT_VELOCITY_MOCK = [
  { sprint: 'Sprint 20', planned: 30, completed: 28 },
  { sprint: 'Sprint 21', planned: 35, completed: 32 },
  { sprint: 'Sprint 22', planned: 40, completed: 42 },
  { sprint: 'Sprint 23', planned: 38, completed: 35 },
  { sprint: 'Sprint 24', planned: 45, completed: 40 },
];

export const MONTHLY_GROWTH_MOCK = [
  { month: 'Jan', revenue: 24000, expenses: 18000 },
  { month: 'Feb', revenue: 28000, expenses: 19000 },
  { month: 'Mar', revenue: 32000, expenses: 22000 },
  { month: 'Apr', revenue: 35000, expenses: 24000 },
  { month: 'May', revenue: 39000, expenses: 25000 },
  { month: 'Jun', revenue: 48000, expenses: 28000 },
];

export const hrService = {
  // --- PROJECTS API MOCKS ---
  async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PROJECTS]), 500));
  },

  async createProject(project: Omit<Project, 'id' | 'progress'>): Promise<Project> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProj: Project = {
          ...project,
          id: `proj_${Date.now()}`,
          progress: 0,
        };
        MOCK_PROJECTS = [newProj, ...MOCK_PROJECTS];
        resolve(newProj);
      }, 500);
    });
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = MOCK_PROJECTS.findIndex((p) => p.id === id);
        if (idx === -1) return reject(new Error('Project not found'));
        MOCK_PROJECTS[idx] = { ...MOCK_PROJECTS[idx], ...updates };
        resolve(MOCK_PROJECTS[idx]);
      }, 500);
    });
  },

  async deleteProject(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_PROJECTS = MOCK_PROJECTS.filter((p) => p.id !== id);
        resolve(true);
      }, 400);
    });
  },

  // --- TASKS API MOCKS ---
  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_TASKS]), 500));
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTsk: Task = {
          ...task,
          id: `tsk_${Date.now()}`,
        };
        MOCK_TASKS = [newTsk, ...MOCK_TASKS];
        resolve(newTsk);
      }, 500);
    });
  },

  async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = MOCK_TASKS.findIndex((t) => t.id === id);
        if (idx === -1) return reject(new Error('Task not found'));
        MOCK_TASKS[idx].status = status;
        resolve(MOCK_TASKS[idx]);
      }, 400);
    });
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = MOCK_TASKS.findIndex((t) => t.id === id);
        if (idx === -1) return reject(new Error('Task not found'));
        MOCK_TASKS[idx] = { ...MOCK_TASKS[idx], ...updates };
        resolve(MOCK_TASKS[idx]);
      }, 400);
    });
  },

  // --- LEAVE REQUESTS (Manager approvals) ---
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_LEAVE_REQUESTS]), 500));
  },

  async updateLeaveStatus(id: string, status: LeaveRequest['status']): Promise<LeaveRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = MOCK_LEAVE_REQUESTS.findIndex((l) => l.id === id);
        if (idx === -1) return reject(new Error('Leave request not found'));
        MOCK_LEAVE_REQUESTS[idx].status = status;
        resolve(MOCK_LEAVE_REQUESTS[idx]);
      }, 400);
    });
  },

  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReq: LeaveRequest = {
          ...request,
          id: `lv_${Date.now()}`,
          status: 'pending',
        };
        MOCK_LEAVE_REQUESTS = [newReq, ...MOCK_LEAVE_REQUESTS];
        resolve(newReq);
      }, 500);
    });
  },

  // --- EMPLOYEES API (Manager only) ---
  async getEmployees(): Promise<EmployeeOverview[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_EMPLOYEES]), 500));
  },

  async createEmployee(employee: Omit<EmployeeOverview, 'id' | 'workload' | 'performanceScore'>): Promise<EmployeeOverview> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEmp: EmployeeOverview = {
          ...employee,
          id: `emp_${Date.now()}`,
          workload: 0,
          performanceScore: 85,
        };
        MOCK_EMPLOYEES = [...MOCK_EMPLOYEES, newEmp];
        resolve(newEmp);
      }, 500);
    });
  },

  async updateEmployee(id: string, updates: Partial<EmployeeOverview>): Promise<EmployeeOverview> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = MOCK_EMPLOYEES.findIndex((e) => e.id === id);
        if (idx === -1) return reject(new Error('Employee not found'));
        MOCK_EMPLOYEES[idx] = { ...MOCK_EMPLOYEES[idx], ...updates };
        resolve(MOCK_EMPLOYEES[idx]);
      }, 500);
    });
  },

  async deleteEmployee(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_EMPLOYEES = MOCK_EMPLOYEES.filter((e) => e.id !== id);
        resolve(true);
      }, 400);
    });
  },

  // --- OTHER UTILITIES ---
  async getDepartments(): Promise<DepartmentStats[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_DEPARTMENTS]), 400));
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_ACTIVITIES]), 400));
  },
};

export default hrService;
