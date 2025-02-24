
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user-types';

interface ProtectedRouteProps {
  children: ReactNode;
  user?: User;
}

const publicRoutes = ['/', '/auth', '/confirm-registration', '/contract'];

export default function ProtectedRoute({ children, user }: ProtectedRouteProps) {
  const { session } = useAuth();
  const pathname = window.location.pathname;
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!session && !isPublicRoute) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
