
import { createContext, useContext, ReactNode } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/auth', '/confirm-registration', '/contract'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { session, loading } = useAuthSession();
  const currentPath = window.location.pathname;
  const isPublicRoute = publicRoutes.includes(currentPath);

  // Se estiver em uma rota pública, renderiza normalmente independente da sessão
  if (isPublicRoute) {
    return (
      <AuthContext.Provider value={{ session, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Para rotas protegidas, redireciona se não houver sessão
  if (!loading && !session && !isPublicRoute) {
    // Redireciona para a página de autenticação ao invés da raiz
    window.location.href = '/auth';
    return null;
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
