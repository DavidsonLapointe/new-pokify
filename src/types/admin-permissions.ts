
export const ADMIN_DEFAULT_PERMISSIONS = {
  leadly_employee: {
    dashboard: true,
    organizations: true,
    users: true,
    modules: true,
    plans: true,
    "credit-packages": true,
    financial: true,
    integrations: true,
    prompt: true,
    settings: true,
    profile: true
  },
  leadly_master: {
    dashboard: true,
    organizations: true,
    users: true,
    modules: true,
    plans: true,
    "credit-packages": true,
    financial: true,
    integrations: true,
    prompt: true,
    settings: true,
    profile: true,
    "analysis-packages": true
  },
  admin: {
    dashboard: true,
    leads: true,
    users: true,
    integrations: true,
    settings: true,
    plan: true,
    profile: true
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
    isDefault: true
  },
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin"
  },
  {
    id: "organizations",
    label: "Empresas",
    path: "/admin/organizations"
  },
  {
    id: "users",
    label: "Usuários",
    path: "/admin/users"
  },
  {
    id: "modules",
    label: "Módulos",
    path: "/admin/modules"
  },
  {
    id: "plans",
    label: "Planos",
    path: "/admin/plans"
  },
  {
    id: "credit-packages",
    label: "Pacotes de Créditos",
    path: "/admin/credit-packages"
  },
  {
    id: "financial",
    label: "Financeiro",
    path: "/admin/financial"
  },
  {
    id: "integrations",
    label: "Integrações",
    path: "/admin/integrations"
  },
  {
    id: "prompt",
    label: "Prompt",
    path: "/admin/prompt"
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/admin/settings"
  }
];
