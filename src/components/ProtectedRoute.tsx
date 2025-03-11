
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  user?: User;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicRoute = ['/', '/auth', '/confirm-registration', '/contract'].some(
    route => location.pathname === route || location.pathname.startsWith(route + '/')
  );

  useEffect(() => {
    // Only redirect if not loading and not a public route
    if (!loading && !session && !isPublicRoute) {
      navigate('/auth', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [session, loading, isPublicRoute, navigate, location]);

  // If loading, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If it's a public route, render normally
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If there's no session and it's not a public route, redirect to /auth
  if (!session && !isPublicRoute) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // If there's a session or it's a public route, render normally
  return <>{children}</>;
}
