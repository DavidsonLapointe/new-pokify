
import { User } from "./user-types";
import { Organization } from "./organization-types";

const mockOrganization: Organization = {
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
};

export const mockUsers: User[] = [
  // Administradores
  {
    id: 1,
    name: "Roberto Silva",
    email: "roberto.silva@empresa.com",
    phone: "(11) 98765-4321",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastAccess: "2024-03-20T10:30:00.000Z",
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
        date: "2024-03-20T10:30:00.000Z",
        action: "Acessou o sistema",
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },
  {
    id: 2,
    name: "Carla Mendes",
    email: "carla.mendes@empresa.com",
    phone: "(11) 98888-7777",
    role: "admin",
    status: "inactive",
    createdAt: "2024-01-15T00:00:00.000Z",
    lastAccess: "2024-03-19T09:45:00.000Z",
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
        date: "2024-03-19T09:45:00.000Z",
        action: "Atualizou configurações do sistema",
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },
  {
    id: 3,
    name: "Paulo Costa",
    email: "paulo.costa@empresa.com",
    phone: "(11) 97777-6666",
    role: "admin",
    status: "pending",
    createdAt: "2024-03-18T00:00:00.000Z",
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
        action: "Usuário criado",
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },

  // Vendedores
  {
    id: 4,
    name: "Ana Santos",
    email: "ana.santos@empresa.com",
    phone: "(11) 96666-5555",
    role: "seller",
    status: "active",
    createdAt: "2024-02-01T00:00:00.000Z",
    lastAccess: "2024-03-20T10:00:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-20T10:00:00.000Z",
        action: "Atualizou informações de lead",
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },
  {
    id: 5,
    name: "Lucas Oliveira",
    email: "lucas.oliveira@empresa.com",
    phone: "(11) 95555-4444",
    role: "seller",
    status: "inactive",
    createdAt: "2024-02-15T00:00:00.000Z",
    lastAccess: "2024-03-19T14:30:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-19T14:30:00.000Z",
        action: "Registrou novo lead",
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },
  {
    id: 6,
    name: "Maria Pereira",
    email: "maria.pereira@empresa.com",
    phone: "(11) 94444-3333",
    role: "seller",
    status: "pending",
    createdAt: "2024-03-15T00:00:00.000Z",
    lastAccess: "2024-03-15T15:45:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-15T15:45:00.000Z",
        action: "Usuário criado",
      }
    ],
    avatar: "",
    organization: mockOrganization,
  }
];
