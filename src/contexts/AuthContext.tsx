import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { mockSession, getSession, signInWithEmailAndPassword, signOut } from '@/services/mockAuthService';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega a sessão ao inicializar
    async function loadSession() {
      try {
        const { session: currentSession } = await getSession();
        setSession(currentSession);
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { session: newSession, error } = await signInWithEmailAndPassword(email, password);
      
      if (error) {
        return { error };
      }
      
      setSession(newSession);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      setSession(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, logout }}>
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
