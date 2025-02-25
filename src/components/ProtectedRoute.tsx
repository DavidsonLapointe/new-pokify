
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
    // Só redireciona se não estiver carregando e não for uma rota pública
    if (!loading && !session && !isPublicRoute) {
      navigate('/auth', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [session, loading, isPublicRoute, navigate, location]);

  // Se estiver carregando, mostra uma tela de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Se for rota pública, renderiza normalmente
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Se não tiver sessão e não for rota pública, redireciona para /auth
  if (!session && !isPublicRoute) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // Se tiver sessão ou for rota pública, renderiza normalmente
  return <>{children}</>;
}
