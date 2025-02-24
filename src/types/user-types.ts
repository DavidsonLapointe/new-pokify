export type UserRole = "admin" | "seller" | "leadly_employee";
export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastAccess?: string;
  permissions?: { [key: string]: any };
  logs: Array<{
    id: string;
    date: string;
    action: string;
  }>;
  avatar?: string;
  organization?: {
    id: string;
    name: string;
  };
  company_leadly_id?: string;
}
