
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
  const isPublicRoute = ['/', '/auth', '/confirm-registration', '/contract'].includes(location.pathname);

  useEffect(() => {
    if (!loading && !session && !isPublicRoute) {
      navigate('/auth', { replace: true });
    }
  }, [session, loading, isPublicRoute, navigate]);

  // Se estiver carregando, mostra uma div vazia com altura total para evitar flash
  if (loading) {
    return <div className="min-h-screen" />;
  }

  // Se for rota pública, renderiza normalmente
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Se não tiver sessão e não for rota pública, redireciona para /auth
  if (!session && !isPublicRoute) {
    return <Navigate to="/auth" replace />;
  }

  // Se tiver sessão ou for rota pública, renderiza normalmente
  return <>{children}</>;
}
