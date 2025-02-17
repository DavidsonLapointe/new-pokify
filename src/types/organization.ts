
export type UserRole = "admin" | "seller";
export type UserStatus = "active" | "inactive" | "pending";

export interface UserLog {
  id: number;
  date: string;
  action: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastAccess: string;
  permissions: {
    [key: string]: string[];
  };
  logs: UserLog[];
}

export interface OrganizationUser extends User {
  role: UserRole;
  status: UserStatus;
}

export interface Organization {
  id: number;
  name: string;
  nomeFantasia: string;
  plan: string;
  users: User[];
  status: UserStatus;
  integratedCRM: string | null;
  integratedLLM: string | null;
  email: string;
  phone: string;
  cnpj: string;
  adminName: string;
  adminEmail: string;
}

// Mock data for users
export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastAccess: "2024-03-15T14:30:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      calls: ["view", "upload", "delete"],
      leads: ["view", "edit", "delete"],
      integrations: ["view", "edit"],
    },
    logs: [
      {
        id: 1,
        date: "2024-03-15T14:30:00.000Z",
        action: "Acessou o sistema",
      },
      {
        id: 2,
        date: "2024-03-15T15:00:00.000Z",
        action: "Uploadou uma nova chamada",
      },
    ],
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    phone: "(11) 88888-8888",
    role: "seller",
    status: "active",
    createdAt: "2024-02-01T00:00:00.000Z",
    lastAccess: "2024-03-15T13:00:00.000Z",
    permissions: {
      dashboard: ["view"],
      calls: ["view", "upload"],
      leads: ["view", "edit"],
      integrations: ["view", "edit"],
    },
    logs: [
      {
        id: 1,
        date: "2024-03-15T13:00:00.000Z",
        action: "Acessou o sistema",
      },
    ],
  },
];

export const availablePermissions = {
  dashboard: {
    label: "Dashboard",
    permissions: {
      view: "Visualizar dashboard",
      export: "Exportar relatórios",
    },
  },
  calls: {
    label: "Chamadas",
    permissions: {
      view: "Visualizar chamadas",
      upload: "Upload de chamadas",
      delete: "Deletar chamadas",
    },
  },
  leads: {
    label: "Leads",
    permissions: {
      view: "Visualizar leads",
      edit: "Editar leads",
      delete: "Deletar leads",
    },
  },
} as const;
