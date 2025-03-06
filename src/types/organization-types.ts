
import type { User } from "./user-types";
import type { UserStatus } from "./user-types";

/**
 * Reasons why an organization might be in pending status:
 * - contract_signature: The contract hasn't been signed yet
 * - pro_rata_payment: The pro-rata payment hasn't been made
 * - user_validation: The admin user hasn't validated their data and created a password
 * - null: No pending issues
 */
export type OrganizationPendingReason = "contract_signature" | "pro_rata_payment" | "user_validation" | null;

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
  contractStatus: 'pending' | 'completed';
  paymentStatus: 'pending' | 'completed';
  registrationStatus: 'pending' | 'completed';
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
