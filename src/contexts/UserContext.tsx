
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface UserContextType {
  user: User;
  updateUser: (newUser: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Criando usuário Ana Silva como mockLoggedUser
const mockLoggedUser: User = {
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
    analysis_packages: ["view", "edit"],
    financial: ["view", "edit"],
    profile: ["contact", "password"]
  },
  logs: [
    {
      id: 1,
      date: "2024-02-15T10:00:00.000Z",
      action: "Usuário criado"
    },
    {
      id: 2,
      date: "2024-03-10T15:30:00.000Z",
      action: "Login realizado"
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

export function UserProvider({ children }: { children: ReactNode }) {
  // Limpar dados antigos do localStorage ao inicializar
  useEffect(() => {
    localStorage.clear(); // Limpa todos os dados antigos
    localStorage.setItem('mockLoggedUser', JSON.stringify(mockLoggedUser));
  }, []);

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
