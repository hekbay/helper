import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types/index';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { userSession } = useApp();

  if (!userSession.role) {
    return <Navigate to="/login" replace />;
  }

  // If specific role required and user doesn't have it, redirect to their role's page
  if (allowedRole && userSession.role !== allowedRole) {
    const homeByRole: Record<Exclude<UserRole, null>, string> = {
      CLOSER: '/closers',
      RECEPCAO: '/recepcao',
      ADMIN: '/admin'
    };
    return <Navigate to={homeByRole[userSession.role as Exclude<UserRole, null>]} replace />;
  }

  return <>{children}</>;
};
