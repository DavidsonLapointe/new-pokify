
export type UserRole = "admin" | "seller" | "leadly_employee" | "manager" | "leadly_master";
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
  status: UserStatus; // Changed from optional to required to match OrgUser
  createdAt: string;
  updatedAt?: string;
  lastAccess?: string;  
  permissions?: { 
    [key: string]: boolean;
  };
  logs?: UserLog[];
  avatar?: string | null;
  organization?: Organization;
  company_leadly_id?: string;
}

// Import the Organization type from organization-types.ts to avoid duplication
import { Organization } from './organization-types';
