
export type UserRole = "leadly_employee" | "admin" | "seller";
export type UserStatus = "active" | "inactive" | "pending";
export type OrganizationPendingReason = "contract_signature" | "pro_rata_payment" | null;

export interface UserLog {
  id: number;
  date: string;
  action: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastAccess: string;
  permissions: {
    [key: string]: string[];
  };
  logs: UserLog[];
  organization: Organization;
  avatar: string;
}

import type { Organization } from "./organization-types";
