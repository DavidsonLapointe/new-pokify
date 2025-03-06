
export type UserRole = "admin" | "seller" | "leadly_employee";
export type UserStatus = "active" | "inactive" | "pending";
export type OrganizationPendingReason = "contract_signature" | "pro_rata_payment" | "user_validation" | null;

export interface UserLog {
  id: string;
  date: string;
  action: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastAccess?: string;
  permissions: { [key: string]: boolean };  // Changed from string[] to object
  logs: UserLog[];
  avatar?: string;
  organization?: Organization;  // Atualizamos para incluir todos os campos necessários
  company_leadly_id?: string;
}

export interface Organization {
  id: string;
  name: string;
  nomeFantasia: string;
  plan: string;
  users: User[];
  status: UserStatus;
  pendingReason?: OrganizationPendingReason;
  integratedCRM: string | null;
  integratedLLM: string | null;
  email: string;
  phone: string;
  cnpj: string;
  adminName: string;
  adminEmail: string;
  contractSignedAt?: string;
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
