import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Check authentication - redirect if not logged in
  if (!user || !token) {
    // Navigate synchronously (TanStack Router handles async navigation)
    navigate({ to: '/login', replace: true });
    return null;
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to login if insufficient permissions
    navigate({ to: '/login', replace: true });
    return null;
  }

  return <>{children}</>;
}
