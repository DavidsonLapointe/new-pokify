import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers, defaultActiveUser } from '@/types/mock-users';

interface UserContextType {
  user: User;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Usuário Admin padrão para ambiente administrativo (agora usando o usuário ativo criado)
  const defaultAdminUser: User = defaultActiveUser;
  
  // Usuário padrão para ambiente da organização
  const defaultOrgUser: User = {
    id: 4,
    name: "Admin Organização",
    email: "admin@organizacao.com",
    phone: "(11) 99999-9999",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastAccess: new Date().toISOString(),
    permissions: [
      "dashboard",
      "dashboard.leads",
      "dashboard.uploads",
      "dashboard.performance",
      "dashboard.objections",
      "dashboard.suggestions",
      "dashboard.sellers",
      "leads",
      "users",
      "integrations",
      "settings",
      "plan",
      "company",
      "profile"
    ],
    logs: [],
    avatar: "",
    organization: {
      id: 2,
      name: "Organização Demo",
      nomeFantasia: "Organização Demo",
      plan: "Professional",
      users: [],
      status: "active",
      integratedCRM: null,
      integratedLLM: null,
      email: "contato@organizacao.com",
      phone: "(11) 99999-9999",
      cnpj: "00.000.000/0000-01",
      adminName: "Admin Organização",
      adminEmail: "admin@organizacao.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  };
  
  const [user, setUser] = useState<User>(() => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const storageKey = isAdminRoute ? 'adminUser' : 'orgUser';
    
    // Limpa o localStorage para forçar o uso dos usuários padrão
    localStorage.removeItem(storageKey);
    
    return isAdminRoute ? defaultAdminUser : defaultOrgUser;
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
