
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

// Rotas disponíveis para usuários da organização
export const availablePermissions = [
  "dashboard",           // Tem subpermissões (abas)
  "leads",              // Análise de Leads
  "users",              // Usuários
  "integrations",       // Integrações
  "settings",           // Configurações
  "plan",              // Meu Plano
  "profile"            // Perfil
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

// Labels em português para as permissões
export const permissionLabels: { [key: string]: string } = {
  dashboard: "Dashboard",
  leads: "Análise de Leads",
  users: "Usuários",
  integrations: "Integrações",
  settings: "Configurações",
  plan: "Meu Plano",
  profile: "Meu Perfil",
  'dashboard.leads': "Leads",
  'dashboard.uploads': "Uploads",
  'dashboard.performance': "Performance",
  'dashboard.objections': "Objeções",
  'dashboard.suggestions': "Sugestões",
  'dashboard.sellers': "Vendedores",
  'settings.alerts': "Alertas",
  'settings.analysis': "Análise",
  'settings.retention': "Retenção",
  'settings.llm': "Modelos de IA",
  'settings.system': "Sistema",
  'settings.permissions': "Permissões"
};
