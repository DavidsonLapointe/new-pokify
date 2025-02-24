
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/auth', '/confirm-registration', '/contract'];

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const isPublicRoute = publicRoutes.includes(currentPath);

    // Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Melhorando os logs para debug
      if (!isPublicRoute) {
        if (!session) {
          console.log("No session found, will redirect to auth page");
        } else {
          console.log("Session found:", session.user.id);
        }
      }
    });

    // Escuta mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}
