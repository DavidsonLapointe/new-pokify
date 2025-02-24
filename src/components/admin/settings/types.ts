
import { UserRole } from "@/types/user-types";
import { LucideIcon } from "lucide-react";

export type PermissionConfig = {
  [key: string]: string[];
};

export type RolePermissions = {
  [K in UserRole]: PermissionConfig;
};

export interface Route {
  id: string;
  label: string;
  icon: LucideIcon;
  isDefault?: boolean;
}

export interface DashboardTab {
  id: string;
  label: string;
}
