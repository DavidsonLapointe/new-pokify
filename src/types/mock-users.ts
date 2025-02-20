import { User } from "@/types";

// Permissões padrão para administradores
const adminPermissions = {
  dashboard: ["leads", "uploads", "performance", "objections", "suggestions", "sellers"],
  leads: ["view", "edit", "delete"],
  users: ["view", "edit", "delete"],
  integrations: ["view", "edit"],
  settings: ["view", "edit"],
  plan: ["view", "upgrade"],
  profile: ["contact", "password"]
};

export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@empresa.com",
    phone: "(11) 99999-9999",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T10:00:00.000Z",
    lastAccess: "2024-01-01T10:00:00.000Z",
    permissions: adminPermissions,
    logs: [],
    avatar: "",
    organization: {} as any,
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@empresa.com",
    phone: "(11) 98888-8888",
    role: "seller",
    status: "active",
    createdAt: "2024-01-02T10:00:00.000Z",
    lastAccess: "2024-01-02T10:00:00.000Z",
    permissions: {
      dashboard: ["leads", "uploads"],
      leads: ["view"],
      profile: ["contact", "password"]
    },
    logs: [],
    avatar: "",
    organization: {} as any,
  },
  {
    id: 3,
    name: "Renato Dleizer",
    email: "renato.dleizer@empresa.com",
    phone: "(11) 98765-4321",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    lastAccess: new Date().toISOString(),
    permissions: adminPermissions,
    logs: [{
      id: 1,
      date: new Date().toISOString(),
      action: "Usuário criado"
    }],
    avatar: "",
    organization: {} as any,
  },
];
