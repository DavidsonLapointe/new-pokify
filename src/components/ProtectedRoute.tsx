
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user-types';

interface ProtectedRouteProps {
  children: ReactNode;
  user?: User;
}

const publicRoutes = ['/', '/auth', '/confirm-registration', '/contract'];

export default function ProtectedRoute({ children, user }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const pathname = window.location.pathname;
  const isPublicRoute = publicRoutes.includes(pathname);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session && !isPublicRoute) {
      navigate('/auth', { replace: true });
    }
  }, [session, loading, isPublicRoute, navigate]);

  // Se estiver carregando, não renderiza nada
  if (loading) {
    return null;
  }

  // Se for rota pública, renderiza normalmente
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Se não tiver sessão e não for rota pública, não renderiza nada enquanto redireciona
  if (!session && !isPublicRoute) {
    return null;
  }

  // Se tiver sessão ou for rota pública, renderiza normalmente
  return <>{children}</>;
}
