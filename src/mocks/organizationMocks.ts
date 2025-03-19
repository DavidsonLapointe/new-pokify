
import { Organization } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const mockOrganizations: Organization[] = [
  {
    id: uuidv4(),
    name: "Empresa Exemplo",
    status: "active",
    createdAt: "2023-05-15T14:30:00Z",
    updatedAt: "2023-05-15T14:30:00Z",
    cnpj: "12.345.678/0001-90",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Sala 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    adminEmail: "admin@empresa.com",
    adminName: "Administrador",
    adminPhone: "(11) 98765-4321",
    logo: null,
    paymentStatus: "completed",
    registrationStatus: "completed",
    pendingReason: null,
    setupCompleted: true,
    modules: ["calls", "leads"],
    plan: {
      id: uuidv4(),
      name: "Plano Profissional",
      price: 299.90,
      features: ["Análise de chamadas", "Gestão de leads"],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    users: [
      {
        id: uuidv4(),
        name: "Administrador",
        email: "admin@empresa.com",
        role: "admin",
        status: "active",
        createdAt: "2023-05-15T14:30:00Z",
        lastAccess: "2023-05-15T14:30:00Z"
      },
      {
        id: uuidv4(),
        name: "Vendedor Exemplo",
        email: "vendedor@empresa.com",
        role: "seller",
        status: "active",
        createdAt: "2023-05-15T14:30:00Z",
        lastAccess: "2023-05-15T14:30:00Z"
      }
    ]
  },
  {
    id: uuidv4(),
    name: "Startup Tech",
    status: "pending",
    createdAt: "2023-05-20T10:15:00Z",
    updatedAt: "2023-05-20T10:15:00Z",
    cnpj: "98.765.432/0001-10",
    address: {
      street: "Avenida Paulista",
      number: "1500",
      complement: "Andar 10",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-200"
    },
    adminEmail: "admin@startuptech.com",
    adminName: "Gestor Startup",
    adminPhone: "(11) 91234-5678",
    logo: null,
    paymentStatus: "pending",
    registrationStatus: "completed",
    pendingReason: "mensalidade_payment",
    setupCompleted: false,
    modules: ["calls"],
    plan: {
      id: uuidv4(),
      name: "Plano Básico",
      price: 149.90,
      features: ["Análise de chamadas"],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    users: [
      {
        id: uuidv4(),
        name: "Gestor Startup",
        email: "admin@startuptech.com",
        role: "admin",
        status: "active",
        createdAt: "2023-05-20T10:15:00Z",
        lastAccess: "2023-05-20T10:15:00Z"
      }
    ]
  }
];
