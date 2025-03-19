
import { User, UserRole, UserStatus } from "@/types/user-types";
import { v4 as uuidv4 } from 'uuid';

// Create mock authenticated user
export const mockAuthenticatedUser: User = {
  id: "1",
  name: "John Admin",
  email: "admin@example.com",
  phone: "+5511999999999",
  role: "admin" as UserRole,
  status: "active" as UserStatus,
  createdAt: "2023-01-01T00:00:00.000Z",
  lastAccess: "2023-08-15T14:30:00.000Z",
  permissions: {
    dashboard: true,
    leads: true,
    users: true,
    integrations: true,
    settings: true,
    plan: true,
    profile: true
  },
  logs: [
    {
      id: "1",
      date: "2023-08-15T14:30:00.000Z",
      action: "Usuário fez login"
    }
  ],
  avatar: null
};

// Create mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@example.com",
    phone: "+5511999999999",
    role: "admin" as UserRole,
    status: "active" as UserStatus,
    createdAt: "2023-01-01T00:00:00.000Z",
    lastAccess: "2023-08-15T14:30:00.000Z",
    permissions: {
      dashboard: true,
      leads: true,
      users: true,
      integrations: true,
      settings: true,
      plan: true,
      profile: true
    },
    logs: [
      {
        id: "1",
        date: "2023-08-15T14:30:00.000Z",
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    organization: {
      id: "org1",
      name: "Exemplo Empresa",
      status: "active",
      createdAt: "2022-12-01T00:00:00.000Z",
      plan: "premium"
    }
  },
  {
    id: "2",
    name: "Jane Seller",
    email: "seller@example.com",
    phone: "+5511988888888",
    role: "seller" as UserRole,
    status: "active" as UserStatus,
    createdAt: "2023-02-01T00:00:00.000Z",
    lastAccess: "2023-08-14T10:15:00.000Z",
    permissions: {
      dashboard: true,
      leads: true,
      profile: true
    },
    logs: [
      {
        id: "1",
        date: "2023-08-14T10:15:00.000Z",
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    organization: {
      id: "org1",
      name: "Exemplo Empresa",
      status: "active",
      createdAt: "2022-12-01T00:00:00.000Z",
      plan: "premium"
    }
  },
  {
    id: "3",
    name: "Mark Manager",
    email: "manager@example.com",
    phone: "+5511977777777",
    role: "manager" as UserRole,
    status: "active" as UserStatus,
    createdAt: "2023-03-01T00:00:00.000Z",
    lastAccess: "2023-08-13T16:45:00.000Z",
    permissions: {
      dashboard: true,
      leads: true,
      users: true,
      profile: true
    },
    logs: [
      {
        id: "1",
        date: "2023-08-13T16:45:00.000Z",
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    organization: {
      id: "org1",
      name: "Exemplo Empresa",
      status: "active",
      createdAt: "2022-12-01T00:00:00.000Z",
      plan: "premium"
    }
  }
];

// Create a function to generate a random user
export const generateRandomUser = (role: UserRole = "seller", organizationId: string = "org1"): User => {
  return {
    id: uuidv4(),
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    phone: `+551199999${Math.floor(Math.random() * 10000)}`,
    role: role,
    status: "active" as UserStatus,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
    lastAccess: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    permissions: role === "admin" 
      ? {
          dashboard: true,
          leads: true,
          users: true,
          integrations: true,
          settings: true,
          plan: true,
          profile: true
        }
      : role === "manager"
      ? {
          dashboard: true,
          leads: true,
          users: true,
          profile: true
        }
      : {
          dashboard: true,
          leads: true,
          profile: true
        },
    logs: [
      {
        id: "1",
        date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    organization: {
      id: organizationId,
      name: "Exemplo Empresa",
      status: "active",
      createdAt: "2022-12-01T00:00:00.000Z",
      plan: "premium"
    }
  };
};

// Create mock leadly employees
export const mockLeadlyEmployees: User[] = [
  {
    id: "l1",
    name: "Admin Leadly",
    email: "admin@leadly.ai",
    phone: "+5511999999999",
    role: "leadly_employee" as UserRole,
    status: "active" as UserStatus,
    createdAt: "2022-01-01T00:00:00.000Z",
    lastAccess: "2023-08-15T09:30:00.000Z",
    permissions: {
      dashboard: true,
      organizations: true,
      users: true,
      modules: true,
      plans: true,
      "credit-packages": true,
      financial: true,
      integrations: true,
      prompt: true,
      settings: true,
      profile: true
    },
    logs: [
      {
        id: "1",
        date: "2023-08-15T09:30:00.000Z",
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    company_leadly_id: "leadly1"
  }
];
