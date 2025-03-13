
// Organization status types
export type OrganizationStatus = "active" | "pending" | "suspended" | "canceled" | "inactive";

// Organization pending reason types
export type OrganizationPendingReason = "contract_signature" | "user_validation" | "mensalidade_payment" | "pro_rata_payment" | null;

export interface OrganizationAddress {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Export Address for backward compatibility
export type Address = OrganizationAddress;

export interface OrganizationPlan {
  id: string;
  name: string;
  price: number;
}

export interface Organization {
  id: string;
  name: string;
  nomeFantasia: string;
  plan: string | OrganizationPlan;
  planName?: string;
  users: OrgUser[];
  status: OrganizationStatus;
  pendingReason: OrganizationPendingReason;
  contractStatus: "pending" | "completed";
  paymentStatus: "pending" | "completed";
  registrationStatus: "pending" | "completed";
  integratedCRM?: string;
  integratedLLM?: string;
  email: string;
  phone: string;
  cnpj: string;
  adminName: string;
  adminEmail: string;
  contractSignedAt: string | null;
  createdAt: string;
  logo?: string;
  address?: OrganizationAddress;
}

// Rename to OrgUser to avoid conflicts with User from user-types.ts
export interface OrgUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "seller" | "leadly_employee";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastAccess: string;
  permissions: {
    [key: string]: boolean;
  };
  logs: UserLog[];
  organization: Organization;
  avatar: string;
}

export interface UserLog {
  id: string;
  date: string;
  action: string;
}
