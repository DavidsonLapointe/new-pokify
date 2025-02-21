
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface UserContextType {
  user: User;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Usuário Admin (Ana Silva)
const mockAdminUser: User = {
  id: 101,
  name: "Ana Silva",
  email: "ana.silva@leadly.com",
  phone: "(11) 98765-4321",
  role: "leadly_employee",
  status: "active",
  createdAt: "2024-02-15T10:00:00.000Z",
  lastAccess: "2024-03-10T15:30:00.000Z",
  permissions: {
    dashboard: ["view", "export"],
    integrations: ["view", "edit"],
    plans: ["view", "edit"],
    organizations: ["view", "edit"],
    settings: ["view", "edit"],
    prompt: ["view", "edit"],
    "analysis-packages": ["view", "edit"],
    financial: ["view", "edit"],
    users: ["view", "edit", "delete"],
    profile: ["contact", "password"]
  },
  logs: [
    {
      id: 1,
      date: "2024-02-15T10:00:00.000Z",
      action: "Usuário criado"
    }
  ],
  avatar: "",
  organization: {
    id: 1,
    name: "Leadly Technologies",
    nomeFantasia: "Leadly",
    plan: "Enterprise",
    users: [],
    status: "active",
    integratedCRM: null,
    integratedLLM: null,
    email: "contato@leadly.com",
    phone: "(11) 3333-4444",
    cnpj: "12.345.678/0001-90",
    adminName: "Admin Leadly",
    adminEmail: "admin@leadly.com",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
};

// Usuário da TechCorp (João Silva)
const mockOrgUser: User = {
  id: 201,
  name: "João Silva",
  email: "joao.silva@techcorp.com",
  phone: "(11) 98765-4321",
  role: "admin",
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastAccess: "2024-03-20T10:30:00.000Z",
  permissions: {
    dashboard: ["view", "export"],
    leads: ["view", "edit", "delete"],
    users: ["view", "edit", "delete"],
    integrations: ["view", "edit"],
    settings: ["view", "edit"],
    plan: ["view", "upgrade"],  // Adicionando permissão explícita para "plan"
    profile: ["contact", "password"]
  },
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

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    const path = window.location.pathname;
    const isAdminRoute = path.startsWith('/admin');
    const defaultUser = isAdminRoute ? mockAdminUser : mockOrgUser;
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

  useEffect(() => {
    const path = window.location.pathname;
    const isAdminRoute = path.startsWith('/admin');
    const defaultUser = isAdminRoute ? mockAdminUser : mockOrgUser;
    setUser(defaultUser);
  }, [window.location.pathname]);

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
