
import { createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { useAuth } from './AuthContext';
import { useLoadUserProfile } from '@/hooks/useLoadUserProfile';
import { useUserOperations } from '@/hooks/useUserOperations';

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const { user, setUser, loading } = useLoadUserProfile(session?.user?.id);
  const { updateUser, logout } = useUserOperations(setUser);

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
