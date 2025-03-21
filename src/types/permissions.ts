
// Define permission label mappings
export const permissionLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "dashboard.analytics": "Analytics",
  "dashboard.organizations": "Organizações",
  "dashboard.financial": "Financeiro",
  organizations: "Empresas",
  "organizations.manage": "Gerenciar",
  "organizations.support": "Suporte",
  users: "Usuários",
  modules: "Módulos",
  "modules.manage": "Gerenciar",
  "modules.setups": "Setups",
  plans: "Planos",
  "credit-packages": "Pacotes de Créditos",
  "credit-packages.manage": "Gerenciar",
  "credit-packages.sales": "Vendas",
  financial: "Financeiro",
  "financial.invoices": "Faturas",
  "financial.reports": "Relatórios",
  integrations: "Integrações",
  prompt: "Prompt",
  settings: "Configurações",
  "settings.alerts": "Alertas",
  "settings.analysis": "Análise",
  "settings.retention": "Retenção",
  "settings.llm": "LLM",
  "settings.system": "Sistema",
  "settings.permissions": "Permissões",
  profile: "Meu Perfil",
  "analysis-packages": "Pacotes de Análise",
  leads: "Análise de Leads",
  company: "Empresa",
  "dashboard.leads": "Leads",
  "dashboard.uploads": "Uploads",
  "dashboard.performance": "Performance",
  "dashboard.objections": "Objeções",
  "dashboard.suggestions": "Sugestões",
  "dashboard.sellers": "Vendedores",
  crm: "CRM",
  "crm.integration": "Integração",
  "crm.fields": "Campos",
};

// Define the Permission type that was missing
export type Permission = boolean;

// Define tab permissions
export const dashboardTabPermissions = [
  "dashboard.analytics",
  "dashboard.organizations",
  "dashboard.financial"
];

export const settingsTabPermissions = [
  "settings.alerts",
  "settings.analysis",
  "settings.retention",
  "settings.llm",
  "settings.system",
  "settings.permissions"
];

export const crmTabPermissions = [
  "crm.integration",
  "crm.fields"
];

// Add the availablePermissions export needed by AddLeadlyEmployeeDialog
export const availablePermissions = {
  dashboard: {
    label: "Dashboard",
    permissions: {
      view: "Visualizar dashboard",
      export: "Exportar relatórios",
    },
  },
  calls: {
    label: "Chamadas",
    permissions: {
      view: "Visualizar chamadas",
      upload: "Upload de chamadas",
      delete: "Deletar chamadas",
    },
  },
  leads: {
    label: "Leads",
    permissions: {
      view: "Visualizar leads",
      edit: "Editar leads",
      delete: "Deletar leads",
    },
  },
} as const;
