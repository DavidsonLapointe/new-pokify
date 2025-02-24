
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserContextType {
  user: User | null;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*, organizations (*)')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (profile) {
          const userData: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone || '',
            role: profile.role,
            status: profile.status,
            createdAt: new Date(profile.created_at).getTime(),
            lastAccess: new Date(profile.last_access).getTime(),
            permissions: [], // Inicializado como array vazio
            logs: [],
            organization: {
              id: profile.organizations.id,
              name: profile.organizations.name,
              status: profile.organizations.status,
              nomeFantasia: profile.organizations.nome_fantasia || '',
              users: [],
              integratedCRM: null,
              integratedLLM: null,
              subscriptionStatus: 'inactive',
              nextPayment: null,
              currentPlan: null,
              credits: 0
            },
            avatar: profile.avatar || '',
          };

          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        toast.error('Erro ao carregar perfil do usuário');
      }
    };

    loadUserProfile();
  }, [session]);

  const updateUser = async (newUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar,
          role: newUser.role,
        })
        .eq('id', newUser.id);

      if (error) throw error;

      setUser(newUser);
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
