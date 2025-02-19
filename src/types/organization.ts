
export type UserRole = "leadly_employee" | "admin" | "seller";
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

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alexandre Rodrigues",
    email: "alexandre.rodrigues@empresa.com",
    phone: "(11) 98765-4321",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastAccess: "2024-03-18T10:30:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      leads: ["view", "edit", "delete"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      plan: ["view", "edit"],
      users: ["view", "edit", "delete"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-18T10:30:00.000Z",
        action: "Acessou o sistema",
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Tech Solutions Ltda",
      nomeFantasia: "Tech Solutions",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: "HubSpot",
      integratedLLM: "GPT-4",
      email: "contato@techsolutions.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Alexandre Rodrigues",
      adminEmail: "alexandre.rodrigues@empresa.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
  },
  {
    id: 2,
    name: "Patricia Mendes",
    email: "patricia.mendes@empresa.com",
    phone: "(11) 98888-7777",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15T00:00:00.000Z",
    lastAccess: "2024-03-18T09:45:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      leads: ["view", "edit", "delete"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      plan: ["view", "edit"],
      users: ["view", "edit", "delete"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-18T09:45:00.000Z",
        action: "Atualizou configurações do sistema",
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Tech Solutions Ltda",
      nomeFantasia: "Tech Solutions",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: "HubSpot",
      integratedLLM: "GPT-4",
      email: "contato@techsolutions.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Alexandre Rodrigues",
      adminEmail: "alexandre.rodrigues@empresa.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
  },
  {
    id: 3,
    name: "Fernando Costa",
    email: "fernando.costa@empresa.com",
    phone: "(11) 97777-6666",
    role: "admin",
    status: "active",
    createdAt: "2024-02-01T00:00:00.000Z",
    lastAccess: "2024-03-18T11:15:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      leads: ["view", "edit", "delete"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      plan: ["view", "edit"],
      users: ["view", "edit", "delete"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-18T11:15:00.000Z",
        action: "Adicionou novo usuário",
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Tech Solutions Ltda",
      nomeFantasia: "Tech Solutions",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: "HubSpot",
      integratedLLM: "GPT-4",
      email: "contato@techsolutions.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Alexandre Rodrigues",
      adminEmail: "alexandre.rodrigues@empresa.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
  },
  {
    id: 4,
    name: "Julia Costa",
    email: "julia.costa@empresa.com",
    phone: "(11) 96666-5555",
    role: "seller",
    status: "active",
    createdAt: "2024-02-15T00:00:00.000Z",
    lastAccess: "2024-03-18T10:00:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-18T10:00:00.000Z",
        action: "Atualizou informações de lead",
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Tech Solutions Ltda",
      nomeFantasia: "Tech Solutions",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: "HubSpot",
      integratedLLM: "GPT-4",
      email: "contato@techsolutions.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Alexandre Rodrigues",
      adminEmail: "alexandre.rodrigues@empresa.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
  },
  {
    id: 5,
    name: "Marcos Santos",
    email: "marcos.santos@empresa.com",
    phone: "(11) 95555-4444",
    role: "seller",
    status: "active",
    createdAt: "2024-02-20T00:00:00.000Z",
    lastAccess: "2024-03-18T14:30:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-18T14:30:00.000Z",
        action: "Registrou novo lead",
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Tech Solutions Ltda",
      nomeFantasia: "Tech Solutions",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: "HubSpot",
      integratedLLM: "GPT-4",
      email: "contato@techsolutions.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Alexandre Rodrigues",
      adminEmail: "alexandre.rodrigues@empresa.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
  },
  {
    id: 6,
    name: "Ana Paula Silva",
    email: "ana.silva@empresa.com",
    phone: "(11) 94444-3333",
    role: "seller",
    status: "active",
    createdAt: "2024-03-01T00:00:00.000Z",
    lastAccess: "2024-03-18T15:45:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-18T15:45:00.000Z",
        action: "Acessou o sistema",
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Tech Solutions Ltda",
      nomeFantasia: "Tech Solutions",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: "HubSpot",
      integratedLLM: "GPT-4",
      email: "contato@techsolutions.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Alexandre Rodrigues",
      adminEmail: "alexandre.rodrigues@empresa.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
  }
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

