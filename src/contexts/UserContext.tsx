
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserContextType {
  user: User | null;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user) {
        console.log("No session found");
        setUser(null);
        return;
      }

      try {
        console.log("Loading user profile for:", session.user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            id,
            name,
            email,
            phone,
            role,
            status,
            permissions,
            created_at,
            last_access
          `)
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading profile:", error);
          throw error;
        }

        if (!profile) {
          console.error("No profile found");
          throw new Error("Perfil não encontrado");
        }

        console.log("Profile loaded:", profile);

        // Ensure permissions is an object, defaulting to empty object if null
        const permissions = profile.permissions as { [key: string]: boolean } || {};

        const userData: User = {
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          role: profile.role || 'leadly_employee',
          status: profile.status || 'active',
          createdAt: profile.created_at,
          lastAccess: profile.last_access,
          permissions: permissions,
          logs: [],
          avatar: ''
        };

        console.log("Setting user data:", userData);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user profile:', error);
        toast.error('Erro ao carregar perfil do usuário');
        // Em caso de erro, faça logout e redirecione para a página inicial
        await supabase.auth.signOut();
        setUser(null);
        navigate('/', { replace: true });
      }
    };

    loadUserProfile();
  }, [session, navigate]);

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
      navigate('/', { replace: true });
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
