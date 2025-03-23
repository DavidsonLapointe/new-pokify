
// Permission Labels for UI display
export const permissionLabels: Record<string, string> = {
  // Main Sections
  profile: "Meu Perfil",
  dashboard: "Dashboard",
  users: "Usuários",
  organizations: "Empresas",
  modules: "Módulos",
  plans: "Planos",
  integrations: "Integrações",
  "credit-packages": "Pacotes de Créditos",
  financial: "Financeiro",
  settings: "Configurações",
  prompt: "Prompts",
  
  // Dashboard Tabs
  "dashboard.analytics": "Analytics",
  "dashboard.organizations": "Empresas",
  "dashboard.financial": "Financeiro",
  
  // Settings Tabs
  "settings.alerts": "Alertas",
  "settings.analysis": "Análise",
  "settings.retention": "Retenção",
  "settings.llm": "LLM",
  "settings.system": "Sistema",
  "settings.permissions": "Permissões",
  
  // CRM Tabs
  "crm.integration": "Integração",
  "crm.fields": "Campos",
  
  // Financial Tabs
  "financial.invoices": "Faturas",
  "financial.reports": "Relatórios",
  
  // Credit Packages Tabs
  "credit-packages.manage": "Gerenciar",
  "credit-packages.sales": "Vendas",
  
  // Organizations Tabs
  "organizations.manage": "Gerenciar",
  "organizations.support": "Suporte",
  
  // Modules Tabs
  "modules.manage": "Gerenciar",
  "modules.setups": "Setups"
};

// Define dashboard tabs for permission checks
export const dashboardTabPermissions = [
  "dashboard.analytics",
  "dashboard.organizations",
  "dashboard.financial"
];

// Define settings tabs for permission checks
export const settingsTabPermissions = [
  "settings.alerts",
  "settings.analysis",
  "settings.retention",
  "settings.llm",
  "settings.system",
  "settings.permissions"
];

// Define CRM tabs for permission checks
export const crmTabPermissions = [
  "crm.integration",
  "crm.fields"
];
