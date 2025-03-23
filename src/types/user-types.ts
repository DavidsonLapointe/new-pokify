
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
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  lastAccess?: string;  
  permissions?: { 
    [key: string]: boolean;
  };
  logs?: UserLog[]; // Changed from required to optional
  avatar?: string | null;
  organization?: Organization;
  company_leadly_id?: string;
  area?: string;
}

// Import the Organization type from organization-types.ts to avoid duplication
import { Organization } from './organization-types';
