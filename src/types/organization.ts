
export type UserRole = "admin" | "seller";
export type UserStatus = "active" | "inactive";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
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
};

export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 98765-4321",
    role: "admin",
    status: "active",
    lastAccess: "2024-02-20T14:30:00",
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
    lastAccess: "2024-02-20T16:45:00",
    permissions: {
      dashboard: ["view"],
      users: ["view"],
      flows: ["view", "execute"],
      integrations: ["view"],
    },
  },
];
