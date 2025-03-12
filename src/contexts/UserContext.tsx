
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from './AuthContext';

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for development
const mockAdminUser: User = {
  id: "mock-admin-id",
  name: "Admin User",
  email: "admin@example.com",
  avatar: null,
  role: "admin",
  status: "active",
  createdAt: new Date().toISOString(),
  lastAccess: new Date().toISOString(),
  permissions: {
    canViewDashboard: true,
    canManageUsers: true,
    canManageSettings: true,
    canManageIntegrations: true,
    canManageBilling: true
  },
  logs: [],
  organization: {
    id: "mock-org-id",
    name: "Mock Organization",
    nomeFantasia: "Mock Company",
    plan: "premium",
    planName: "Premium Plan",
    users: [],
    status: "active",
    pendingReason: null,
    contractStatus: "completed",
    paymentStatus: "completed",
    registrationStatus: "completed",
    integratedCRM: "hubspot",
    integratedLLM: "openai",
    email: "contact@mockcompany.com",
    phone: "(11) 1234-5678",
    cnpj: "12.345.678/0001-90",
    adminName: "Admin User",
    adminEmail: "admin@example.com",
    contractSignedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockAdminUser);
  const [loading, setLoading] = useState(false);

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    console.log("Mock logout executed");
    // We don't actually log out in mock mode
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
