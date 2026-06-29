import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ROLE_LEVELS } from '../constants/roles';
import type { UserRole } from '../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, requiredRole }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoleLevel = ROLE_LEVELS[user.role] || 0;
  const requiredRoleLevel = ROLE_LEVELS[requiredRole] || 0;

  if (userRoleLevel < requiredRoleLevel) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
