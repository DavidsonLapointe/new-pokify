import { User } from "./user-types";
import { Organization } from "./organization-types";

const mockOrganization: Organization = {
  id: 1,
  name: "TechCorp Brasil",
  nomeFantasia: "TechCorp",
  plan: "Professional",
  users: [],
  status: "active",
  integratedCRM: "Salesforce",
  integratedLLM: "GPT-4",
  email: "contato@techcorp.com.br",
  phone: "(11) 99999-9999",
  cnpj: "00.000.000/0000-01",
  adminName: "João Silva",
  adminEmail: "joao.silva@techcorp.com.br",
  createdAt: "2024-01-01T00:00:00.000Z"
};

export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@techcorp.com.br",
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
      users: ["view", "edit", "delete"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-20T10:30:00.000Z",
        action: "Acessou o sistema"
      }
    ],
    avatar: "",
    organization: mockOrganization
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@techcorp.com.br",
    phone: "(11) 98888-7777",
    role: "admin",
    status: "inactive",
    createdAt: "2024-01-15T00:00:00.000Z",
    lastAccess: "2024-03-20T09:45:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      leads: ["view", "edit", "delete"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      users: ["view", "edit", "delete"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-20T09:45:00.000Z",
        action: "Usuário desativado"
      }
    ],
    avatar: "",
    organization: mockOrganization
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos.oliveira@techcorp.com.br",
    phone: "(11) 97777-6666",
    role: "admin",
    status: "pending",
    createdAt: "2024-02-01T00:00:00.000Z",
    lastAccess: "2024-03-20T11:15:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      leads: ["view", "edit", "delete"],
      integrations: ["view", "edit"],
      settings: ["view", "edit"],
      users: ["view", "edit", "delete"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-20T11:15:00.000Z",
        action: "Usuário criado"
      }
    ],
    avatar: "",
    organization: mockOrganization
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@techcorp.com.br",
    phone: "(11) 96666-5555",
    role: "seller",
    status: "active",
    createdAt: "2024-02-15T00:00:00.000Z",
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
        action: "Acessou o sistema"
      }
    ],
    avatar: "",
    organization: mockOrganization
  },
  {
    id: 5,
    name: "Pedro Souza",
    email: "pedro.souza@techcorp.com.br",
    phone: "(11) 95555-4444",
    role: "seller",
    status: "inactive",
    createdAt: "2024-02-20T00:00:00.000Z",
    lastAccess: "2024-03-20T14:30:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-20T14:30:00.000Z",
        action: "Usuário desativado"
      }
    ],
    avatar: "",
    organization: mockOrganization
  },
  {
    id: 6,
    name: "Julia Lima",
    email: "julia.lima@techcorp.com.br",
    phone: "(11) 94444-3333",
    role: "seller",
    status: "pending",
    createdAt: "2024-03-01T00:00:00.000Z",
    lastAccess: "2024-03-20T15:45:00.000Z",
    permissions: {
      dashboard: ["view"],
      leads: ["view", "edit"],
      integrations: ["view"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-20T15:45:00.000Z",
        action: "Usuário criado"
      }
    ],
    avatar: "",
    organization: mockOrganization
  },
  {
    id: 101,
    name: "Ana Silva",
    email: "ana.silva@leadly.com",
    phone: "(11) 98765-4321",
    role: "leadly_employee",
    status: "active",
    createdAt: "2024-02-15T10:00:00.000Z",
    lastAccess: "2024-03-10T15:30:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      integrations: ["view", "edit"],
      plans: ["view", "edit"],
      organizations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-02-15T10:00:00.000Z",
        action: "Usuário criado"
      },
      {
        id: 2,
        date: "2024-03-10T15:30:00.000Z",
        action: "Login realizado"
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Leadly Technologies",
      nomeFantasia: "Leadly",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: null,
      integratedLLM: null,
      email: "contato@leadly.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Admin Leadly",
      adminEmail: "admin@leadly.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  },
  {
    id: 102,
    name: "Pedro Santos",
    email: "pedro.santos@leadly.com",
    phone: "(11) 97654-3210",
    role: "leadly_employee",
    status: "active",
    createdAt: "2024-02-20T09:00:00.000Z",
    lastAccess: "2024-03-11T14:20:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      integrations: ["view", "edit"],
      plans: ["view", "edit"],
      organizations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-02-20T09:00:00.000Z",
        action: "Usuário criado"
      },
      {
        id: 2,
        date: "2024-03-11T14:20:00.000Z",
        action: "Login realizado"
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Leadly Technologies",
      nomeFantasia: "Leadly",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: null,
      integratedLLM: null,
      email: "contato@leadly.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Admin Leadly",
      adminEmail: "admin@leadly.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  },
  {
    id: 103,
    name: "Mariana Costa",
    email: "mariana.costa@leadly.com",
    phone: "(11) 96543-2109",
    role: "leadly_employee",
    status: "inactive",
    createdAt: "2024-02-25T11:00:00.000Z",
    lastAccess: "2024-03-01T16:45:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      integrations: ["view", "edit"],
      plans: ["view", "edit"],
      organizations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-02-25T11:00:00.000Z",
        action: "Usuário criado"
      },
      {
        id: 2,
        date: "2024-03-01T16:45:00.000Z",
        action: "Status alterado para inativo"
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Leadly Technologies",
      nomeFantasia: "Leadly",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: null,
      integratedLLM: null,
      email: "contato@leadly.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Admin Leadly",
      adminEmail: "admin@leadly.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  },
  {
    id: 104,
    name: "Lucas Oliveira",
    email: "lucas.oliveira@leadly.com",
    phone: "(11) 95432-1098",
    role: "leadly_employee",
    status: "pending",
    createdAt: "2024-03-10T08:00:00.000Z",
    lastAccess: "2024-03-10T08:00:00.000Z",
    permissions: {
      dashboard: ["view", "export"],
      integrations: ["view", "edit"],
      plans: ["view", "edit"],
      organizations: ["view", "edit"],
      settings: ["view", "edit"],
      prompt: ["view", "edit"],
      analysis_packages: ["view", "edit"],
      financial: ["view", "edit"]
    },
    logs: [
      {
        id: 1,
        date: "2024-03-10T08:00:00.000Z",
        action: "Usuário criado"
      }
    ],
    avatar: "",
    organization: {
      id: 1,
      name: "Leadly Technologies",
      nomeFantasia: "Leadly",
      plan: "Enterprise",
      users: [],
      status: "active",
      integratedCRM: null,
      integratedLLM: null,
      email: "contato@leadly.com",
      phone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      adminName: "Admin Leadly",
      adminEmail: "admin@leadly.com",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  }
];
