
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

export const mockUsers: User[] = [];
