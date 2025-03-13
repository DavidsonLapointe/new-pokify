
import { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '@/types';
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
  // Garantir que o usuário autenticado tenha a organização associada
  const initialUser: User = {
    ...mockAuthenticatedUser,
    organization: mockOrganizations[0]
  };
  
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const updateUser = (newUser: User) => {
    setUser(newUser);
    console.log("Usuário atualizado:", newUser);
  };

  const logout = () => {
    console.log("Mock logout executado");
    // Não fazemos logout real no modo mock
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
