
export type UserRole = "leadly_employee" | "admin" | "seller";
export type UserStatus = "active" | "inactive" | "pending";
export type OrganizationPendingReason = "contract_signature" | "pro_rata_payment" | null;

export interface UserLog {
  id: string;
  date: string;
  action: string;
}

// Importa apenas o tipo, não a implementação
import type { Organization } from "./organization-types";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastAccess: string;
  permissions: string[];
  logs: UserLog[];
  organization: Organization | null;
  avatar: string;
}
