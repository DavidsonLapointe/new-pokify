import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from './AuthContext';
import { getCurrentUser } from '@/services/mockAuthService';
import { mockAuthenticatedUser } from '@/mocks/userMocks';
import { mockOrganizations } from '@/mocks/organizationMocks';

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Estado inicial com usuário mockado
  const initialUser: User = {
    ...mockAuthenticatedUser,
    organization: mockOrganizations[0]
  };
  
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(true);
  const { session, logout: authLogout } = useAuth();

  useEffect(() => {
    // Carrega o usuário quando a sessão mudar
    async function loadUser() {
      if (session) {
        try {
          setLoading(true);
          const { user: currentUser } = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    }

    loadUser();
  }, [session]);

  const updateUser = (newUser: User) => {
    setUser(newUser);
    console.log("Usuário atualizado:", newUser);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    console.log("Logout executado");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
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
