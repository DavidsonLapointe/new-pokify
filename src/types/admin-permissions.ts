
export const ADMIN_DEFAULT_PERMISSIONS = {
  leadly_employee: {
    dashboard: true,
    "dashboard.analytics": true,
    "dashboard.organizations": true,
    registrations: true,
    "registrations-two": true,
    management: true,
    "management.financial": true, // Added this permission for the financial tab in management
    organizations: true,
    "organizations.manage": true,
    users: true,
    modules: true,
    "modules.manage": true,
    plans: true,
    "credit-packages": true,
    "credit-packages.manage": true,
    integrations: true,
    prompt: true,
    settings: true,
    "settings.alerts": true,
    profile: true,
    "ai-costs": true,
    testimonials: true
  },
  leadly_master: {
    dashboard: true,
    "dashboard.analytics": true,
    "dashboard.organizations": true,
    "dashboard.financial": true,
    registrations: true,
    "registrations-two": true,
    management: true,
    "management.financial": true, // Added this permission for the financial tab in management
    organizations: true,
    "organizations.manage": true,
    "organizations.support": true,
    users: true,
    modules: true,
    "modules.manage": true,
    "modules.setups": true,
    plans: true,
    "credit-packages": true,
    "credit-packages.manage": true,
    "credit-packages.sales": true,
    integrations: true,
    prompt: true,
    settings: true,
    "settings.alerts": true,
    "settings.analysis": true,
    "settings.retention": true,
    "settings.llm": true,
    "settings.system": true,
    "settings.permissions": true,
    profile: true,
    "analysis-packages": true,
    "ai-costs": true,
    testimonials: true
  },
  admin: {
    dashboard: true,
    registrations: true,
    "registrations-two": true,
    management: true,
    "management.financial": true, // Added this permission for the financial tab in management
    leads: true,
    users: true,
    integrations: true,
    settings: true,
    plan: true,
    profile: true,
    "ai-costs": true,
    testimonials: true
  },
  seller: {
    dashboard: true,
    leads: true,
    profile: true
  },
  manager: {
    dashboard: true,
    leads: true,
    users: true,
    profile: true
  }
};

export const availableAdminRoutePermissions = [
  {
    id: "profile",
    label: "Meu Perfil",
    path: "/admin/profile",
    isDefault: true,
    description: "Acesso às configurações do próprio perfil. Esta permissão não pode ser removida."
  },
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    description: "Visão geral com métricas, KPIs e informações sobre organizações e faturamento"
  },
  {
    id: "registrations",
    label: "Cadastros 1",
    path: "/admin/registrations",
    description: "Gerenciamento de cadastros do sistema"
  },
  {
    id: "registrations-two",
    label: "Cadastros 2",
    path: "/admin/registrations-two",
    description: "Gerenciamento de cadastros secundários do sistema"
  },
  {
    id: "management",
    label: "Gestão",
    path: "/admin/management",
    description: "Funcionalidades de gestão do sistema"
  },
  {
    id: "organizations",
    label: "Empresas",
    path: "/admin/organizations",
    description: "Gerenciamento completo de empresas clientes, incluindo cadastro, edição e suporte"
  },
  {
    id: "users",
    label: "Usuários",
    path: "/admin/users",
    description: "Gerenciamento de funcionários da Leadly e suas permissões"
  },
  {
    id: "modules",
    label: "Módulos",
    path: "/admin/modules",
    description: "Configuração de módulos disponíveis para os clientes"
  },
  {
    id: "plans",
    label: "Planos",
    path: "/admin/plans",
    description: "Gerenciamento de planos de assinatura disponíveis para os clientes"
  },
  {
    id: "credit-packages",
    label: "Pacotes de Créditos",
    path: "/admin/credit-packages",
    description: "Criação e gerenciamento de pacotes de créditos para análise de leads"
  },
  {
    id: "integrations",
    label: "Integrações",
    path: "/admin/integrations",
    description: "Configuração de integrações com sistemas externos (CRMs, ERPs, etc)"
  },
  {
    id: "prompt",
    label: "Prompt",
    path: "/admin/prompt",
    description: "Configuração de prompts para análise de leads com inteligência artificial"
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/admin/settings",
    description: "Configurações gerais do sistema, alertas, análises e políticas de retenção"
  },
  {
    id: "analysis-packages",
    label: "Pacotes de Análise",
    path: "/admin/analysis-packages",
    description: "Gerenciamento de pacotes de análise de leads para os clientes"
  },
  {
    id: "ai-costs",
    label: "Custo de IA",
    path: "/admin/ai-costs",
    description: "Visualização de custos relacionados às execuções de IA e modelos LLM"
  },
  {
    id: "company",
    label: "Minha Empresa",
    path: "/admin/company",
    description: "Informações da empresa"
  },
  {
    id: "testimonials",
    label: "Depoimentos",
    path: "/admin/testimonials",
    description: "Gerenciamento de depoimentos exibidos na landing page"
  },
];
