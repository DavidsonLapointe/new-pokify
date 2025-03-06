
import type { User } from "./user-types";
import type { UserStatus, OrganizationPendingReason } from "./user-types";

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
  nomeFantasia: string;
  plan: string;
  users: User[];
  status: UserStatus;
  pendingReason?: OrganizationPendingReason;
  contractStatus?: 'pending' | 'completed';
  paymentStatus?: 'pending' | 'completed';
  registrationStatus?: 'pending' | 'completed';
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
  address?: Address;
}
