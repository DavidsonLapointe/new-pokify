
import { ReactNode } from 'react';
import { User } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  user?: User;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Always allow access to all routes without authentication
  return <>{children}</>;
}
