
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

// Organização para usuários admin
const orgDemo: Organization = {
  id: 2,
  name: "Organização Demo",
  nomeFantasia: "Organização Demo",
  plan: "Professional",
  users: [],
  status: "active",
  integratedCRM: null,
  integratedLLM: null,
  email: "contato@organizacao.com",
  phone: "(11) 99999-9999",
  cnpj: "00.000.000/0000-01",
  adminName: "Admin Organização",
  adminEmail: "admin@organizacao.com",
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

// Admin Ativo (Principal)
const activeAdmin: User = {
  id: 4,
  name: "Ricardo Souza",
  email: "ricardo.souza@organizacao.com",
  phone: "(11) 97777-8888",
  role: "admin",
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastAccess: new Date().toISOString(),
  permissions: [
    "dashboard",
    "dashboard.leads",
    "dashboard.uploads",
    "dashboard.performance",
    "dashboard.objections",
    "dashboard.suggestions",
    "dashboard.sellers",
    "leads",
    "users",
    "integrations",
    "settings",
    "plan",
    "company",
    "profile"
  ],
  logs: [],
  avatar: "",
  organization: orgDemo
};

// Admin Inativo
const inactiveAdmin: User = {
  id: 5,
  name: "Paula Costa",
  email: "paula.costa@organizacao.com",
  phone: "(11) 96666-7777",
  role: "admin",
  status: "inactive",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastAccess: "2024-02-10T00:00:00.000Z",
  permissions: [
    "dashboard",
    "dashboard.leads",
    "dashboard.uploads",
    "dashboard.performance",
    "dashboard.objections",
    "dashboard.suggestions",
    "dashboard.sellers",
    "leads",
    "users",
    "integrations",
    "settings",
    "plan",
    "company",
    "profile"
  ],
  logs: [],
  avatar: "",
  organization: orgDemo
};

// Admin Pendente
const pendingAdmin: User = {
  id: 6,
  name: "Lucas Mendes",
  email: "lucas.mendes@organizacao.com",
  phone: "(11) 95555-6666",
  role: "admin",
  status: "pending",
  createdAt: "2024-02-20T00:00:00.000Z",
  lastAccess: "2024-02-20T00:00:00.000Z",
  permissions: [
    "dashboard",
    "dashboard.leads",
    "dashboard.uploads",
    "dashboard.performance",
    "dashboard.objections",
    "dashboard.suggestions",
    "dashboard.sellers",
    "leads",
    "users",
    "integrations",
    "settings",
    "plan",
    "company",
    "profile"
  ],
  logs: [],
  avatar: "",
  organization: orgDemo
};

export const mockUsers: User[] = [
  activeLeadlyEmployee,
  inactiveLeadlyEmployee,
  pendingLeadlyEmployee,
  activeAdmin,
  inactiveAdmin,
  pendingAdmin
];

// Exporta os usuários ativos para serem usados como padrão
export const defaultActiveUser = activeLeadlyEmployee;
export const defaultActiveOrgUser = activeAdmin;
