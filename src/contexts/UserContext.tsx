
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { defaultActiveUser, defaultActiveOrgUser } from '@/types/mock-users';

interface UserContextType {
  user: User;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Usuário Admin padrão para ambiente administrativo (usando o usuário Leadly ativo)
  const defaultAdminUser: User = defaultActiveUser;
  
  // Usuário padrão para ambiente da organização (usando o admin ativo)
  const defaultOrgUser: User = defaultActiveOrgUser;
  
  const [user, setUser] = useState<User>(() => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const storageKey = isAdminRoute ? 'adminUser' : 'orgUser';
    
    // Tenta recuperar o usuário do localStorage
    const storedUser = localStorage.getItem(storageKey);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verifica se o usuário armazenado tem o formato correto
        if (parsedUser && parsedUser.permissions) {
          return parsedUser;
        }
      } catch (e) {
        console.error('Erro ao parsear usuário do localStorage:', e);
      }
    }
    
    // Se não houver usuário válido no localStorage, usa o padrão
    const defaultUser = isAdminRoute ? defaultAdminUser : defaultOrgUser;
    localStorage.setItem(storageKey, JSON.stringify(defaultUser));
    return defaultUser;
  });

  const updateUser = (newUser: User) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const storageKey = isAdminRoute ? 'adminUser' : 'orgUser';
    
    if (isAdminRoute && newUser.role !== 'leadly_employee') {
      console.error('Tentativa inválida de atualizar usuário admin com usuário não-Leadly');
      return;
    }
    if (!isAdminRoute && newUser.role === 'leadly_employee') {
      console.error('Tentativa inválida de atualizar usuário da organização com usuário Leadly');
      return;
    }
    
    // Garante que as permissões estão em formato de array
    const permissions = Array.isArray(newUser.permissions) 
      ? newUser.permissions 
      : Object.keys(newUser.permissions);
    
    const userWithArrayPermissions = {
      ...newUser,
      permissions
    };
    
    setUser(userWithArrayPermissions);
    localStorage.setItem(storageKey, JSON.stringify(userWithArrayPermissions));
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('orgUser');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('mockLoggedUser');
    
    window.location.href = '/';
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
