
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
  
  // Usando o João Silva para ambiente da organização com todas as permissões
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
      "company",  // Garantindo que company está incluído
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
    
    // Limpa o localStorage para forçar o uso do mockOrgUser
    localStorage.removeItem(storageKey);
    
    const storedUser = localStorage.getItem(storageKey);
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Garante que as permissões estão em formato de array
      if (parsedUser.permissions && !Array.isArray(parsedUser.permissions)) {
        parsedUser.permissions = Object.keys(parsedUser.permissions);
      }
      // Adiciona 'company' se não existir
      if (!parsedUser.permissions.includes('company')) {
        parsedUser.permissions.push('company');
      }
      return parsedUser;
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
    
    // Garante que as permissões estão em formato de array e inclui 'company'
    const permissions = Array.isArray(newUser.permissions) 
      ? newUser.permissions 
      : Object.keys(newUser.permissions);
    
    if (!permissions.includes('company')) {
      permissions.push('company');
    }
    
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
