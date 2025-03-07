export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "admin" | "seller";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastAccess: string;
  logs: {
    id: string;
    timestamp: string;
    activity: string;
  }[];
}

export type OrganizationStatus = "active" | "pending" | "inactive";

export interface Organization {
  id: string;
  name: string;
  nomeFantasia?: string;
  plan: any; // Plan ID
  planName?: string; // Adding plan name property
  users: User[];
  status: OrganizationStatus;
  pendingReason: string | null;
  contractStatus: "pending" | "completed";
  paymentStatus: "pending" | "completed";
  registrationStatus: "pending" | "completed";
  integratedCRM: string | null;
  integratedLLM: string | null;
  email: string;
  phone: string;
  cnpj: string;
  adminName: string;
  adminEmail: string;
  contractSignedAt: string | null;
  createdAt: string;
  logo?: string;
  address?: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}
