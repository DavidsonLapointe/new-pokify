import { User, UserRole, UserStatus } from "@/types/user-types";
import { v4 as uuidv4 } from 'uuid';
import { mockOrganizations } from './organizationMocks';

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

// Generate a random date within the past year
const getRandomDate = (months = 12) => {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * months));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date.toISOString();
};

// Generate random permissions based on role
const getRandomPermissions = (role: UserRole) => {
  if (role === "admin") {
    return {
      dashboard: true,
      "dashboard.analytics": Math.random() > 0.3,
      "dashboard.organizations": Math.random() > 0.3,
      "dashboard.financial": Math.random() > 0.4,
      leads: true,
      users: true,
      integrations: Math.random() > 0.2,
      settings: Math.random() > 0.3,
      "settings.alerts": Math.random() > 0.4,
      "settings.analysis": Math.random() > 0.4,
      "settings.retention": Math.random() > 0.5,
      "settings.system": Math.random() > 0.4,
      plan: true,
      profile: true
    };
  } else if (role === "manager") {
    return {
      dashboard: true,
      "dashboard.analytics": Math.random() > 0.3,
      "dashboard.organizations": Math.random() > 0.5,
      leads: true,
      users: true,
      profile: true
    };
  } else {
    // Seller
    return {
      dashboard: true,
      leads: true,
      profile: true
    };
  }
};

// Create mock organization users data - 15 users spread across different organizations
export const mockOrganizationUsers: User[] = Array(15).fill(null).map((_, index) => {
  // Distribute users across organizations
  const orgIndex = index % mockOrganizations.length;
  const organization = mockOrganizations[orgIndex];
  
  // Determine role distribution - 20% admin, 30% manager, 50% seller
  let role: UserRole;
  if (index % 5 === 0) {
    role = "admin";
  } else if (index % 3 === 0) {
    role = "manager";
  } else {
    role = "seller";
  }

  // Random status - 80% active, 10% inactive, 10% pending
  let status: UserStatus;
  const statusRand = Math.random();
  if (statusRand > 0.9) {
    status = "pending";
  } else if (statusRand > 0.8) {
    status = "inactive";
  } else {
    status = "active";
  }

  const createdAt = getRandomDate(12);
  const lastAccess = getRandomDate(1);

  return {
    id: uuidv4(),
    name: `User ${index + 1} ${organization.name}`,
    email: `user${index + 1}@${organization.name.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+551199${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
    role,
    status,
    createdAt,
    lastAccess,
    permissions: getRandomPermissions(role),
    logs: [
      {
        id: uuidv4(),
        date: lastAccess,
        action: "Usuário fez login"
      },
      {
        id: uuidv4(),
        date: getRandomDate(2),
        action: "Alterou configurações"
      }
    ],
    avatar: null,
    organization
  };
});

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

// For backward compatibility, keep the original mockUsers array
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
  },
  {
    id: "l2",
    name: "Master Leadly",
    email: "master@leadly.ai",
    phone: "+5511999999990",
    role: "leadly_master" as UserRole,
    status: "active" as UserStatus,
    createdAt: "2022-01-01T00:00:00.000Z",
    lastAccess: "2023-08-15T10:30:00.000Z",
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
      profile: true,
      "analysis-packages": true
    },
    logs: [
      {
        id: "1",
        date: "2023-08-15T10:30:00.000Z",
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    company_leadly_id: "leadly1"
  }
];
