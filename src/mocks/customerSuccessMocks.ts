
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
        "dashboard.leads": true,
        "dashboard.performance": true,
        "dashboard.objections": true,
        "dashboard.suggestions": true,
        "dashboard.uploads": true,
        "dashboard.sellers": true,
        leads: true,
        users: true,
        integrations: true,
        reports: true,
        settings: true,
        "settings.alerts": true,
        "settings.analysis": true,
        "settings.retention": true,
        "settings.llm": true,
        "settings.system": true,
        "settings.permissions": true,
        plan: true,
        profile: true,
        products: true,
        calendar: true,
        crm: true,
        "crm.contacts": true,
        "crm.opportunities": true,
        "crm.pipeline": true,
        "crm.activities": true,
        notifications: true,
        support: true
      }
    });
    count--;
  }
  
  // Create a variety of permission templates
  const permissionTemplates = [
    // Manager with access to most modules and specific tabs
    {
      role: "manager" as UserRole,
      status: "active" as UserStatus,
      permissions: {
        dashboard: false,
        "dashboard.leads": true,
        "dashboard.performance": true,
        leads: true,
        users: true,
        settings: true,
        "settings.analysis": true,
        "settings.permissions": true,
        calendar: true,
        products: true,
        crm: false,
        "crm.contacts": true,
        "crm.opportunities": true
      }
    },
    // Seller with basic permissions
    {
      role: "seller" as UserRole,
      status: "active" as UserStatus,
      permissions: {
        dashboard: true,
        "dashboard.leads": true,
        leads: true,
        calendar: true,
        crm: true,
        "crm.contacts": true,
        notifications: true
      }
    },
    // Support representative
    {
      role: "seller" as UserRole,
      status: "active" as UserStatus,
      permissions: {
        dashboard: false,
        "dashboard.leads": false,
        leads: false,
        support: true,
        notifications: true,
        profile: true
      }
    },
    // Finance user
    {
      role: "manager" as UserRole,
      status: "active" as UserStatus,
      permissions: {
        reports: true,
        products: true,
        plan: true,
        settings: false,
        "settings.system": true
      }
    },
    // Marketing user
    {
      role: "seller" as UserRole,
      status: "active" as UserStatus,
      permissions: {
        reports: true,
        products: true,
        calendar: true,
        dashboard: true,
        "dashboard.performance": true
      }
    },
    // Inactive user with various permissions
    {
      role: "seller" as UserRole,
      status: "inactive" as UserStatus,
      permissions: {
        dashboard: true,
        "dashboard.leads": true,
        leads: true,
        crm: true,
        "crm.contacts": true
      }
    }
  ];
  
  for (let i = 0; i < count; i++) {
    const template = permissionTemplates[i % permissionTemplates.length];
    
    users.push({
      id: uuidv4(),
      name: `Usuário ${i + 1}`,
      email: `usuario${i + 1}@exemplo.com.br`,
      phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      role: template.role,
      status: template.status,
      createdAt: getRandomRecentDate(90),
      lastAccess: template.status === "active" ? getRandomRecentDate(15) : null,
      permissions: template.permissions
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
    plan: "enterprise",
    features: {
      calls: true,
      leads: true,
      dashboard: true,
      crm: true,
      scoring: true,
      moduleStatus: {
        "call-analysis": "configured",
        "crm-integration": "setup",
        "lead-scoring": "contracted",
        "sales-coaching": "not_contracted"
      }
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
    plan: "basic",
    features: {
      calls: true,
      leads: false,
      dashboard: false,
      crm: false,
      scoring: false,
      moduleStatus: {
        "call-analysis": "contracted",
        "crm-integration": "not_contracted"
      }
    },
    users: createMockUsers(3, uuidv4(), true)
  },
  {
    id: uuidv4(),
    name: "TechSolutions Software",
    nomeFantasia: "TechSolutions",
    status: "active",
    createdAt: "2023-04-10T11:20:00Z",
    updatedAt: "2023-09-15T16:30:00Z",
    cnpj: "45.678.901/0001-23",
    email: "contato@techsolutions.com.br",
    phone: "(31) 3333-4444",
    adminName: "Rafael Mendes",
    adminEmail: "rafael@techsolutions.com.br",
    adminPhone: "(31) 98888-7777",
    logo: "https://via.placeholder.com/150?text=TechSolutions",
    address: {
      street: "Avenida Tecnológica",
      number: "789",
      complement: "Andar 5",
      neighborhood: "Distrito Tech",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30000-000"
    },
    paymentStatus: "completed",
    registrationStatus: "completed",
    contractStatus: "completed",
    pendingReason: null,
    setupCompleted: true,
    modules: ["calls", "leads", "dashboard"],
    plan: "premium",
    features: {
      calls: true,
      leads: true,
      dashboard: true,
      crm: true,
      scoring: false,
      moduleStatus: {
        "call-analysis": "setup",
        "crm-integration": "configured"
      }
    },
    users: createMockUsers(5, uuidv4(), true)
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
