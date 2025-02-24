
export const ADMIN_DEFAULT_PERMISSIONS = {
  leadly_employee: {
    dashboard: ["view", "export"],
    organizations: ["view", "edit", "delete"],
    users: ["view", "edit", "delete"],
    plans: ["view", "edit"],
    "analysis-packages": ["view", "edit"],
    financial: ["view", "edit"],
    integrations: ["view", "edit"],
    prompt: ["view", "edit"],
    settings: ["view", "edit"],
    profile: ["contact", "password"]
  },
  admin: {
    dashboard: ["view", "export"],
    leads: ["view", "edit", "delete"],
    users: ["view", "edit", "delete"],
    integrations: ["view", "edit"],
    settings: ["view", "edit"],
    plan: ["view", "upgrade"],
    profile: ["contact", "password"]
  },
  seller: {
    dashboard: ["view"],
    leads: ["view", "edit"],
    integrations: ["view"],
    profile: ["contact", "password"]
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
    id: "plans",
    label: "Planos",
    path: "/admin/plans"
  },
  {
    id: "analysis-packages",
    label: "Pacote de Análises",
    path: "/admin/analysis-packages"
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

