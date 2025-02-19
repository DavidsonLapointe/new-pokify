export type UserRole = "leadly_employee" | "company_admin" | "seller";
export type UserStatus = "active" | "inactive" | "pending";

export type OrganizationPendingReason = "contract_signature" | "pro_rata_payment" | null;

export interface UserLog {
  id: number;
  date: string;
  action: string;
}

export interface Organization {
  id: number;
  name: string;
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
  organization: Organization;
  avatar: string;
}

export interface Organization {
  id: number;
  name: string;
  nomeFantasia: string;
  plan: string;
  users: User[];
  status: UserStatus;
  pendingReason?: OrganizationPendingReason;
  integratedCRM: string | null;
  integratedLLM: string | null;
  email: string;
  phone: string;
  cnpj: string;
  adminName: string;
  adminEmail: string;
  contractSignedAt?: string;
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    role: "company_admin",
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
    avatar: "",
    organization: {
      id: 1,
      name: "Tech Solutions Ltda",
    },
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
    avatar: "",
    organization: {
      id: 2,
      name: "Tech Solutions Ltda",
    },
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@leadly.com",
    phone: "(11) 77777-7777",
    role: "leadly_employee",
    status: "active",
    createdAt: "2024-01-15T00:00:00.000Z",
    lastAccess: "2024-02-28T16:45:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      calls: ["view", "upload", "delete"],
      leads: ["view", "edit", "delete"],
      integrations: ["view", "edit"],
    },
    logs: [
      {
        id: 1,
        date: "2024-02-28T16:45:00.000Z",
        action: "Último acesso ao sistema",
      },
    ],
    avatar: "",
    organization: {
      id: 3,
      name: "Tech Solutions Ltda",
    },
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
