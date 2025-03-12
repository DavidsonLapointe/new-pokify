
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  user?: User;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading } = useAuth();
  const location = useLocation();
  
  // If loading, show the loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Always render the children (allowing access without authentication)
  return <>{children}</>;
}
