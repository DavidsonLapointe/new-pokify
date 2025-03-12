
export type UserRole = "admin" | "seller" | "leadly_employee";
export type UserStatus = "active" | "inactive" | "pending";

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
  lastAccess: string;  // Made this required to match organization-types
  permissions: { [key: string]: boolean };
  logs: UserLog[];
  avatar?: string;
  organization?: Organization;
  company_leadly_id?: string;
}

// Import the Organization type from organization-types.ts to avoid duplication
import { Organization } from './organization-types';
