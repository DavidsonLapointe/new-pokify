
export type Permission = boolean;

export interface Permissions {
  [key: string]: Permission;
}

export interface RoutePermission {
  id: string;
  label: string;
  path: string;
  isDefault?: boolean;
  hasTabs?: boolean;
}

// Rotas básicas disponíveis
export const availablePermissions = [
  "dashboard",           // Tem subpermissões (abas)
  "leads",
  "users",
  "integrations",
  "settings",           // Tem subpermissões (abas)
  "plan",
  "profile",
  "organizations",
  "analysis-packages",
  "financial",
  "prompt"
];

// Subpermissões para páginas com abas
export const dashboardTabPermissions = [
  'dashboard.leads',
  'dashboard.uploads',
  'dashboard.performance',
  'dashboard.objections',
  'dashboard.suggestions',
  'dashboard.sellers'
];

export const settingsTabPermissions = [
  'settings.alerts',
  'settings.analysis',
  'settings.retention',
  'settings.llm',
  'settings.system',
  'settings.permissions'
];
