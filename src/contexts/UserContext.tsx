
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockLoggedUser } from '@/components/organization/profile/useProfileForm';

interface UserContextType {
  user: User;
  updateUser: (newUser: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockLoggedUser);

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('mockLoggedUser', JSON.stringify(newUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('mockLoggedUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
