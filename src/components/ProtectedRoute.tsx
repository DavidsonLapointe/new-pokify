
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user-types';

interface ProtectedRouteProps {
  children: ReactNode;
  user?: User;
}

export default function ProtectedRoute({ children, user }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicRoute = ['/', '/auth', '/confirm-registration', '/contract'].includes(location.pathname);

  useEffect(() => {
    if (!loading && !session && !isPublicRoute) {
      navigate('/auth', { replace: true });
    }
  }, [session, loading, isPublicRoute, navigate]);

  // Se estiver carregando, mostra nada
  if (loading) {
    return null;
  }

  // Se for rota pública, renderiza normalmente
  if (isPublicRoute) {
    // Se tiver sessão e estiver tentando acessar /auth, redireciona
    if (session && location.pathname === '/auth') {
      return <Navigate to="/organization/profile" replace />;
    }
    return <>{children}</>;
  }

  // Se não tiver sessão e não for rota pública, redireciona para /auth
  if (!session && !isPublicRoute) {
    return <Navigate to="/auth" replace />;
  }

  // Se tiver sessão ou for rota pública, renderiza normalmente
  return <>{children}</>;
}
