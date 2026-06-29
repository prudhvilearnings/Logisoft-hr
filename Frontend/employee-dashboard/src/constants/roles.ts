import type { UserRole } from '../types/auth';

export const ROLE_LEVELS: Record<UserRole, number> = {
  employee: 1,
  lead: 2,
  manager: 3,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  employee: 'Employee',
  lead: 'Team Lead',
  manager: 'HR Manager',
};
