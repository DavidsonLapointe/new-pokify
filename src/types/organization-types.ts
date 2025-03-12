
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "admin" | "seller";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastAccess: string;
  permissions: { [key: string]: boolean }; // Changed from optional to required to match user-types.ts
  logs: {
    id: string;
    timestamp: string;
    activity: string;
  }[];
}

export type OrganizationStatus = "active" | "pending" | "inactive";

export type OrganizationPendingReason = 
  | "contract_signature" 
  | "user_validation" 
  | "mensalidade_payment"
  | "pro_rata_payment" 
  | null;

export interface Address {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Organization {
  id: string;
  name: string;
  nomeFantasia?: string;
  plan: any; // Plan ID
  planName?: string; // Adding plan name property
  users: User[];
  status: OrganizationStatus;
  pendingReason: OrganizationPendingReason;
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
  address?: Address;
}
