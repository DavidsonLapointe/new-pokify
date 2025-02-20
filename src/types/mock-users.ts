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
    organization: mockOrganization,
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
    organization: mockOrganization,
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
    organization: mockOrganization,
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
    organization: mockOrganization,
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
    organization: mockOrganization,
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
    organization: mockOrganization,
  },
  {
    id: 7,
    name: "Marina Silva",
    email: "marina.silva@leadly.com",
    phone: "(11) 97777-8888",
    role: "leadly_employee",
    status: "active",
    createdAt: "2024-02-15T00:00:00.000Z",
    lastAccess: "2024-03-19T14:30:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      organizations: ["view", "edit"],
      plans: ["view", "edit"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-02-15T00:00:00.000Z",
        action: "Usuário criado"
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },
  {
    id: 8,
    name: "Rafael Santos",
    email: "rafael.santos@leadly.com",
    phone: "(11) 96666-7777",
    role: "leadly_employee",
    status: "active",
    createdAt: "2024-02-20T00:00:00.000Z",
    lastAccess: "2024-03-19T15:45:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      organizations: ["view", "edit"],
      plans: ["view", "edit"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-02-20T00:00:00.000Z",
        action: "Usuário criado"
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },
  {
    id: 9,
    name: "Carolina Lima",
    email: "carolina.lima@leadly.com",
    phone: "(11) 95555-6666",
    role: "leadly_employee",
    status: "inactive",
    createdAt: "2024-01-10T00:00:00.000Z",
    lastAccess: "2024-03-15T09:20:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      organizations: ["view", "edit"],
      plans: ["view", "edit"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-01-10T00:00:00.000Z",
        action: "Usuário criado"
      }
    ],
    avatar: "",
    organization: mockOrganization,
  },
  {
    id: 10,
    name: "Lucas Oliveira",
    email: "lucas.oliveira@leadly.com",
    phone: "(11) 94444-5555",
    role: "leadly_employee",
    status: "pending",
    createdAt: "2024-03-18T00:00:00.000Z",
    lastAccess: "2024-03-18T00:00:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      organizations: ["view", "edit"],
      plans: ["view", "edit"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-18T00:00:00.000Z",
        action: "Usuário criado"
      }
    ],
    avatar: "",
    organization: mockOrganization,
  }
];
