
import { ReactNode } from 'react';
import { UserType } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  user?: UserType;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Always allow access to all routes without authentication
  return <>{children}</>;
}
