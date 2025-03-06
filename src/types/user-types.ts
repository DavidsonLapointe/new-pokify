
export type UserRole = "admin" | "seller" | "leadly_employee";
export type UserStatus = "active" | "inactive" | "pending";

/**
 * Reasons why an organization might be in pending status:
 * - contract_signature: The contract hasn't been signed yet
 * - pro_rata_payment: The pro-rata payment hasn't been made
 * - user_validation: The admin user hasn't validated their data and created a password
 * - null: No pending issues
 */
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
  permissions: { [key: string]: boolean };
  logs: UserLog[];
  avatar?: string;
  organization?: Organization;
  company_leadly_id?: string;
}

// Import the Organization type from organization-types.ts to avoid duplication
import { Organization } from './organization-types';
