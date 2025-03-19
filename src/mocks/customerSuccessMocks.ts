
import { Organization, OrgUser, UserRole, UserStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Helper to generate random recent date
const getRandomRecentDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Mock users for organizations
const createMockUsers = (count: number, orgId: string, isAdmin: boolean = false): OrgUser[] => {
  const users: OrgUser[] = [];
  
  // Always create at least one admin if requested
  if (isAdmin) {
    users.push({
      id: uuidv4(),
      name: "Administrador",
      email: "admin@exemplo.com.br",
      phone: "(11) 99999-8888",
      role: "admin" as UserRole,
      status: "active" as UserStatus,
      createdAt: getRandomRecentDate(90),
      lastAccess: getRandomRecentDate(5),
      permissions: {
        dashboard: true,
        calls: true,
        leads: true,
        settings: true
      }
    });
    count--;
  }
  
  const roles: UserRole[] = ["seller", "manager"];
  const statuses: UserStatus[] = ["active", "inactive", "pending"];
  
  for (let i = 0; i < count; i++) {
    users.push({
      id: uuidv4(),
      name: `Usuário ${i + 1}`,
      email: `usuario${i + 1}@exemplo.com.br`,
      phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: getRandomRecentDate(90),
      lastAccess: Math.random() > 0.3 ? getRandomRecentDate(15) : null,
      permissions: {
        dashboard: Math.random() > 0.3,
        calls: Math.random() > 0.3,
        leads: Math.random() > 0.3,
        settings: Math.random() > 0.7
      }
    });
  }
  
  return users;
};

// Mock organization data for customer success page
export const mockCustomerSuccessOrganizations: Organization[] = [
  {
    id: uuidv4(),
    name: "Imobiliária Horizonte",
    nomeFantasia: "Horizonte Imóveis",
    status: "active",
    createdAt: "2023-01-15T14:30:00Z",
    updatedAt: "2023-06-20T10:45:00Z",
    cnpj: "12.345.678/0001-90",
    email: "contato@horizonteimoveis.com.br",
    phone: "(11) 3456-7890",
    adminName: "Marcos Silva",
    adminEmail: "marcos@horizonteimoveis.com.br",
    adminPhone: "(11) 98765-4321",
    logo: "https://via.placeholder.com/150?text=Horizonte",
    address: {
      street: "Avenida Paulista",
      number: "1578",
      complement: "Sala 304",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-200"
    },
    paymentStatus: "completed",
    registrationStatus: "completed",
    contractStatus: "completed",
    pendingReason: null,
    setupCompleted: true,
    modules: ["calls", "leads", "dashboard"],
    plan: {
      id: uuidv4(),
      name: "Premium",
      price: 799.90,
      features: ["Atendimento prioritário", "Número ilimitado de usuários", "API avançada"],
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    users: createMockUsers(8, uuidv4(), true)
  },
  {
    id: uuidv4(),
    name: "Auto Center Silva",
    nomeFantasia: "Silva Motors",
    status: "pending",
    createdAt: "2023-08-05T09:15:00Z",
    updatedAt: "2023-08-10T14:20:00Z",
    cnpj: "98.765.432/0001-10",
    email: "contato@silvamotors.com.br",
    phone: "(21) 3456-7890",
    adminName: "Carla Santos",
    adminEmail: "carla@silvamotors.com.br",
    adminPhone: "(21) 98765-4321",
    logo: "https://via.placeholder.com/150?text=Silva",
    address: {
      street: "Rua das Concessionárias",
      number: "456",
      complement: "",
      neighborhood: "Centro",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "20000-000"
    },
    paymentStatus: "pending",
    registrationStatus: "completed",
    contractStatus: "completed",
    pendingReason: "mensalidade_payment",
    setupCompleted: false,
    modules: ["calls"],
    plan: {
      id: uuidv4(),
      name: "Básico",
      price: 299.90,
      features: ["Até 3 usuários", "Análise básica de chamadas"],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    users: createMockUsers(3, uuidv4(), true)
  }
];

// Function to get customer success organizations
export const getCustomerSuccessOrganizations = () => {
  return mockCustomerSuccessOrganizations;
};

// Function to get a specific organization by ID
export const getOrganizationById = (id: string) => {
  return mockCustomerSuccessOrganizations.find(org => org.id === id) || null;
};
