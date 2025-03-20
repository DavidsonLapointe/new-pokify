
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
  "dashboard",        // Tem subpermissões (abas)
  "leads",            // Análise de Leads
  "users",            // Usuários
  "integrations",     // Integrações
  "reports",          // Relatórios
  "settings",         // Configurações (com abas)
  "plan",             // Meu Plano
  "profile",          // Perfil
  "products",         // Produtos
  "calendar",         // Calendário
  "crm",              // CRM (com abas)
  "notifications",    // Notificações
  "support"           // Suporte
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

export const crmTabPermissions = [
  'crm.contacts',
  'crm.opportunities',
  'crm.pipeline',
  'crm.activities'
];

// Labels em português para as permissões
export const permissionLabels: { [key: string]: string } = {
  dashboard: "Dashboard",
  leads: "Análise de Leads",
  users: "Usuários",
  integrations: "Integrações",
  reports: "Relatórios",
  settings: "Configurações",
  plan: "Meu Plano",
  profile: "Meu Perfil",
  products: "Produtos",
  calendar: "Calendário",
  crm: "CRM",
  notifications: "Notificações",
  support: "Suporte",
  
  // Dashboard tabs
  'dashboard.leads': "Leads",
  'dashboard.uploads': "Uploads",
  'dashboard.performance': "Performance",
  'dashboard.objections': "Objeções",
  'dashboard.suggestions': "Sugestões",
  'dashboard.sellers': "Vendedores",
  
  // Settings tabs
  'settings.alerts': "Alertas",
  'settings.analysis': "Análise",
  'settings.retention': "Retenção",
  'settings.llm': "Modelos de IA",
  'settings.system': "Sistema",
  'settings.permissions': "Permissões",
  
  // CRM tabs
  'crm.contacts': "Contatos",
  'crm.opportunities': "Oportunidades",
  'crm.pipeline': "Pipeline",
  'crm.activities': "Atividades"
};
