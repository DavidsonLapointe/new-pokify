
export type UserRole = "admin" | "seller" | "leadly_admin";
export type UserStatus = "active" | "inactive";

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
  lastAccess: string;
  createdAt: string;
  logs: UserLog[];
  permissions: {
    [key: string]: string[];
  };
}

export interface Permission {
  label: string;
  permissions: {
    [key: string]: string;
  };
}

export const availablePermissions: { [key: string]: Permission } = {
  dashboard: {
    label: "Dashboard",
    permissions: {
      view: "Visualizar dashboard",
      export: "Exportar relatórios",
    },
  },
  users: {
    label: "Usuários",
    permissions: {
      view: "Visualizar usuários",
      create: "Criar usuários",
      edit: "Editar usuários",
      delete: "Remover usuários",
    },
  },
  flows: {
    label: "Fluxos",
    permissions: {
      view: "Visualizar fluxos",
      create: "Criar fluxos",
      edit: "Editar fluxos",
      delete: "Remover fluxos",
      execute: "Executar fluxos",
    },
  },
  integrations: {
    label: "Integrações",
    permissions: {
      view: "Visualizar integrações",
      configure: "Configurar integrações",
    },
  },
  organizations: {
    label: "Empresas",
    permissions: {
      view: "Visualizar empresas",
      create: "Criar empresas",
      edit: "Editar empresas",
      delete: "Remover empresas",
      manage: "Gerenciar empresas",
    },
  },
  system: {
    label: "Sistema",
    permissions: {
      manage_integrations: "Gerenciar integrações do sistema",
      manage_settings: "Gerenciar configurações do sistema",
      view_logs: "Visualizar logs do sistema",
      manage_admins: "Gerenciar administradores",
    },
  },
};

export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 98765-4321",
    role: "admin",
    status: "active",
    lastAccess: "2024-02-20T14:30:00.000Z",
    createdAt: "2024-01-15T10:00:00.000Z",
    logs: [
      { id: 1, date: "2024-02-20T14:30:00.000Z", action: "Login" },
      { id: 2, date: "2024-02-19T09:15:00.000Z", action: "Login" },
      { id: 3, date: "2024-02-18T11:20:00.000Z", action: "Login" },
    ],
    permissions: {
      dashboard: ["view", "export"],
      users: ["view", "create", "edit", "delete"],
      flows: ["view", "create", "edit", "delete", "execute"],
      integrations: ["view", "configure"],
    },
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    phone: "(11) 91234-5678",
    role: "seller",
    status: "active",
    lastAccess: "2024-02-20T16:45:00.000Z",
    createdAt: "2024-02-01T14:30:00.000Z",
    logs: [
      { id: 4, date: "2024-02-20T16:45:00.000Z", action: "Login" },
      { id: 5, date: "2024-02-20T08:30:00.000Z", action: "Login" },
    ],
    permissions: {
      dashboard: ["view"],
      users: ["view"],
      flows: ["view", "execute"],
      integrations: ["view"],
    },
  },
  {
    id: 3,
    name: "Maria Silva",
    email: "maria.silva@leadly.com",
    phone: "(11) 97777-8888",
    role: "leadly_admin",
    status: "active",
    lastAccess: "2024-02-20T17:30:00.000Z",
    createdAt: "2024-01-10T09:00:00.000Z",
    logs: [
      { id: 6, date: "2024-02-20T17:30:00.000Z", action: "Login" },
      { id: 7, date: "2024-02-19T10:00:00.000Z", action: "Login" },
      { id: 8, date: "2024-02-18T09:30:00.000Z", action: "Login" },
      { id: 9, date: "2024-02-17T14:15:00.000Z", action: "Login" },
    ],
    permissions: {
      organizations: ["view", "create", "edit", "delete", "manage"],
      system: ["manage_integrations", "manage_settings", "view_logs", "manage_admins"],
      users: ["view", "create", "edit", "delete"],
      integrations: ["view", "configure"],
    },
  },
];
