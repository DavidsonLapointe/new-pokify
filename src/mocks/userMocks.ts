
import { User, UserRole, UserStatus } from "@/types";

export const mockLeadlyEmployees: User[] = [
  {
    id: "l1",
    name: "Administrador Leadly",
    email: "admin@leadly.ai",
    phone: "+5511999887766",
    role: "leadly_master",
    status: "active",
    createdAt: "2023-01-15T10:00:00.000Z",
    lastAccess: "2023-08-10T14:30:00.000Z",
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
        id: "log1",
        date: "2023-08-10T14:30:00.000Z",
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    company_leadly_id: "leadly1"
  },
  {
    id: "l2",
    name: "Funcionário Leadly",
    email: "employee@leadly.ai",
    phone: "+5511987654321",
    role: "leadly_employee",
    status: "active",
    createdAt: "2023-02-20T11:15:00.000Z",
    lastAccess: "2023-08-09T16:45:00.000Z",
    permissions: {
      dashboard: true,
      "dashboard.analytics": true,
      organizations: false,
      settings: true,
      "settings.alerts": true,
      profile: true
    },
    logs: [
      {
        id: "log2",
        date: "2023-08-09T16:45:00.000Z",
        action: "Usuário fez login"
      }
    ],
    avatar: null,
    company_leadly_id: "leadly1"
  }
];

// Create a mock authenticated user for the UserContext
export const mockAuthenticatedUser: User = {
  id: "auth1",
  name: "Usuário Autenticado",
  email: "user@example.com",
  phone: "+5511999999999",
  role: "admin",
  status: "active",
  createdAt: "2023-01-01T10:00:00.000Z",
  lastAccess: "2023-08-15T14:30:00.000Z",
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
      id: "log-auth1",
      date: "2023-08-15T14:30:00.000Z",
      action: "Usuário fez login"
    }
  ],
  avatar: null
};

export const getStatusLabel = (status: UserStatus): string => {
  switch (status) {
    case "active":
      return "Ativo";
    case "inactive":
      return "Inativo";
    case "pending":
      return "Pendente";
    default:
      return status;
  }
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case "leadly_master":
      return "Administrador Master";
    case "leadly_employee":
      return "Funcionário";
    case "admin":
      return "Administrador";
    case "manager":
      return "Gerente";
    case "seller":
      return "Vendedor";
    default:
      return role;
  }
};
