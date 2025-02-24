
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const publicRoutes = ['/', '/auth', '/confirm-registration', '/contract'];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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
