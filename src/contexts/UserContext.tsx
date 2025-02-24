
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/types/mock-users';

interface UserContextType {
  user: User;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Usando a Ana Silva para ambiente administrativo
  const mockAdminUser: User = mockUsers.find(u => u.id === 101) || mockUsers[0];
  
  // Usando o João Silva para ambiente da organização
  const mockOrgUser: User = {
    id: 201,
    name: "João Silva",
    email: "joao.silva@techcorp.com",
    phone: "(11) 98765-4321",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastAccess: "2024-03-20T10:30:00.000Z",
    permissions: [
      "dashboard",
      "leads",
      "users",
      "integrations",
      "settings",
      "plan",
      "profile"
    ],
    logs: [
      {
        id: 1,
        date: "2024-03-20T10:30:00.000Z",
        action: "Acessou o sistema"
      }
    ],
    avatar: "",
    organization: {
      id: 2,
      name: "TechCorp Brasil",
      nomeFantasia: "TechCorp",
      plan: "Professional",
      users: [],
      status: "active",
      integratedCRM: "Salesforce",
      integratedLLM: "GPT-4",
      email: "contato@techcorp.com.br",
      phone: "(11) 99999-9999",
      cnpj: "00.000.000/0000-01",
      adminName: "João Silva",
      adminEmail: "joao.silva@techcorp.com.br",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  };
  
  const [user, setUser] = useState<User>(() => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const storageKey = isAdminRoute ? 'adminUser' : 'orgUser';
    const storedUser = localStorage.getItem(storageKey);
    
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    return isAdminRoute ? mockAdminUser : mockOrgUser;
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
    
    setUser(newUser);
    localStorage.setItem(storageKey, JSON.stringify(newUser));
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
