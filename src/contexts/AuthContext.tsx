
import { createContext, useContext, ReactNode } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Session } from '@supabase/supabase-js';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/auth', '/confirm-registration', '/contract'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { session, loading } = useAuthSession();
  const location = useLocation();
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Se estiver carregando, mostra nada até terminar
  if (loading) {
    return null;
  }

  // Se estiver em uma rota pública, renderiza normalmente independente da sessão
  if (isPublicRoute) {
    return (
      <AuthContext.Provider value={{ session, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Para rotas protegidas, redireciona se não houver sessão
  if (!session && !isPublicRoute) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
