
import { User } from "./user-types";
import { Organization } from "./organization-types";

const mockOrganization: Organization = {
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
};

// Usuário Leadly Ativo (Principal)
const activeLeadlyEmployee: User = {
  id: 1,
  name: "Maria Silva",
  email: "maria.silva@leadly.com",
  phone: "(11) 98765-4321",
  role: "leadly_employee",
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastAccess: new Date().toISOString(),
  permissions: [
    "dashboard",
    "integrations",
    "plans",
    "organizations",
    "settings",
    "prompt",
    "analysis-packages",
    "financial",
    "users",
    "profile"
  ],
  logs: [],
  avatar: "",
  organization: mockOrganization
};

// Usuário Leadly Inativo
const inactiveLeadlyEmployee: User = {
  id: 2,
  name: "João Santos",
  email: "joao.santos@leadly.com",
  phone: "(11) 98765-1234",
  role: "leadly_employee",
  status: "inactive",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastAccess: "2024-02-15T00:00:00.000Z",
  permissions: [
    "dashboard",
    "integrations",
    "plans",
    "organizations",
    "settings",
    "prompt",
    "analysis-packages",
    "financial",
    "users",
    "profile"
  ],
  logs: [],
  avatar: "",
  organization: mockOrganization
};

// Usuário Leadly Pendente
const pendingLeadlyEmployee: User = {
  id: 3,
  name: "Ana Oliveira",
  email: "ana.oliveira@leadly.com",
  phone: "(11) 98765-5678",
  role: "leadly_employee",
  status: "pending",
  createdAt: "2024-02-20T00:00:00.000Z",
  lastAccess: "2024-02-20T00:00:00.000Z",
  permissions: [
    "dashboard",
    "integrations",
    "plans",
    "organizations",
    "settings",
    "prompt",
    "analysis-packages",
    "financial",
    "users",
    "profile"
  ],
  logs: [],
  avatar: "",
  organization: mockOrganization
};

export const mockUsers: User[] = [
  activeLeadlyEmployee,
  inactiveLeadlyEmployee,
  pendingLeadlyEmployee
];

// Exporta o usuário ativo para ser usado como padrão
export const defaultActiveUser = activeLeadlyEmployee;
