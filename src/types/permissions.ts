
export type Permission = boolean;

export interface Permissions {
  [key: string]: Permission;
}

export interface RoutePermission {
  id: string;
  label: string;
  path: string;
  isDefault?: boolean;
}

export const availablePermissions = [
  "dashboard",
  "leads",
  "users",
  "integrations",
  "settings",
  "plan",
  "profile",
  "organizations",
  "analysis-packages",
  "financial",
  "prompt"
];
