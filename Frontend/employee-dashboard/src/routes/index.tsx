import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import RoleGuard from './RoleGuard';
import useAuthStore from '../store/authStore';

// Lazy loading Layout & Error Pages
const DashboardLayout = lazy(() => import('../layout/DashboardLayout'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('../pages/ForbiddenPage'));

// Lazy loading Dashboard Pages
const EmployeeDashboard = lazy(() => import('../features/dashboard/pages/EmployeeDashboard'));
const TeamLeadDashboard = lazy(() => import('../features/dashboard/pages/TeamLeadDashboard'));
const ManagerDashboard = lazy(() => import('../features/dashboard/pages/ManagerDashboard'));

// Lazy loading Feature Modules
const ProjectListPage = lazy(() => import('../features/projects/pages/ProjectListPage'));
const TaskListPage = lazy(() => import('../features/tasks/pages/TaskListPage'));
const CalendarPage = lazy(() => import('../features/calendar/pages/CalendarPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));

const TeamMembersPage = lazy(() => import('../features/team/pages/TeamMembersPage'));
const SprintBoardPage = lazy(() => import('../features/sprints/pages/SprintBoardPage'));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage'));

const EmployeesAdminPage = lazy(() => import('../features/employees/pages/EmployeesAdminPage'));
const FinancePage = lazy(() => import('../features/finance/pages/FinancePage'));
const ApprovalsPage = lazy(() => import('../features/approvals/pages/ApprovalsPage'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage'));

// Component to dynamically forward authenticated index route
const DashboardRoot: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Forward to their dashboard
  if (user.role === 'manager') {
    return <Navigate to="/manager/dashboard" replace />;
  }
  if (user.role === 'lead') {
    return <Navigate to="/lead/dashboard" replace />;
  }
  return <Navigate to="/employee/dashboard" replace />;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-slate-550 mt-4 text-xs font-semibold font-sans animate-pulse">Loading workspace modules...</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardLayout />
        </Suspense>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardRoot />,
      },
      // Employee views (Available to level 1, 2, 3)
      {
        path: 'employee/dashboard',
        element: (
          <RoleGuard requiredRole="employee">
            <EmployeeDashboard />
          </RoleGuard>
        ),
      },
      {
        path: 'employee/projects',
        element: (
          <RoleGuard requiredRole="employee">
            <ProjectListPage />
          </RoleGuard>
        ),
      },
      {
        path: 'employee/tasks',
        element: (
          <RoleGuard requiredRole="employee">
            <TaskListPage />
          </RoleGuard>
        ),
      },
      {
        path: 'employee/calendar',
        element: (
          <RoleGuard requiredRole="employee">
            <CalendarPage />
          </RoleGuard>
        ),
      },
      {
        path: 'employee/profile',
        element: (
          <RoleGuard requiredRole="employee">
            <ProfilePage />
          </RoleGuard>
        ),
      },
      // Team Lead views (Available to level 2, 3)
      {
        path: 'lead/dashboard',
        element: (
          <RoleGuard requiredRole="lead">
            <TeamLeadDashboard />
          </RoleGuard>
        ),
      },
      {
        path: 'lead/team',
        element: (
          <RoleGuard requiredRole="lead">
            <TeamMembersPage />
          </RoleGuard>
        ),
      },
      {
        path: 'lead/sprints',
        element: (
          <RoleGuard requiredRole="lead">
            <SprintBoardPage />
          </RoleGuard>
        ),
      },
      {
        path: 'lead/reports',
        element: (
          <RoleGuard requiredRole="lead">
            <ReportsPage />
          </RoleGuard>
        ),
      },
      // Manager views (Available to level 3 only)
      {
        path: 'manager/dashboard',
        element: (
          <RoleGuard requiredRole="manager">
            <ManagerDashboard />
          </RoleGuard>
        ),
      },
      {
        path: 'manager/employees',
        element: (
          <RoleGuard requiredRole="manager">
            <EmployeesAdminPage />
          </RoleGuard>
        ),
      },
      {
        path: 'manager/departments',
        element: (
          <RoleGuard requiredRole="manager">
            <FinancePage />
          </RoleGuard>
        ),
      },
      {
        path: 'manager/finance',
        element: (
          <RoleGuard requiredRole="manager">
            <FinancePage />
          </RoleGuard>
        ),
      },
      {
        path: 'manager/approvals',
        element: (
          <RoleGuard requiredRole="manager">
            <ApprovalsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'manager/analytics',
        element: (
          <RoleGuard requiredRole="manager">
            <ReportsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'manager/settings',
        element: (
          <RoleGuard requiredRole="manager">
            <SettingsPage />
          </RoleGuard>
        ),
      },
    ],
  },
  {
    path: '/403',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ForbiddenPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
