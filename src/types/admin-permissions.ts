
export const ADMIN_DEFAULT_PERMISSIONS = {
  leadly_employee: {
    dashboard: ["view"],
    organizations: ["view", "edit", "delete"],
    users: ["view", "edit", "delete"],
    plans: ["view", "edit"],
    "analysis-packages": ["view", "edit"],
    financial: ["view"],
    integrations: ["view", "edit"],
    prompt: ["view", "edit"],
    settings: ["view", "edit"],
    profile: ["contact", "password"]
  }
};

export const availableAdminRoutePermissions = [
  {
    id: "profile",
    label: "Meu Perfil",
    path: "/admin/profile",
    isDefault: true,
    tabs: [
      { id: "contact", label: "Informações de Contato", value: "contact" },
      { id: "password", label: "Alterar Senha", value: "password" }
    ]
  },
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" }
    ]
  },
  {
    id: "organizations",
    label: "Empresas",
    path: "/admin/organizations",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" },
      { id: "delete", label: "Excluir", value: "delete" }
    ]
  },
  {
    id: "users",
    label: "Usuários",
    path: "/admin/users",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" },
      { id: "delete", label: "Excluir", value: "delete" }
    ]
  },
  {
    id: "plans",
    label: "Planos",
    path: "/admin/plans",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  },
  {
    id: "analysis-packages",
    label: "Pacote de Análises",
    path: "/admin/analysis-packages",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  },
  {
    id: "financial",
    label: "Financeiro",
    path: "/admin/financial",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" }
    ]
  },
  {
    id: "integrations",
    label: "Integrações",
    path: "/admin/integrations",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  },
  {
    id: "prompt",
    label: "Prompt",
    path: "/admin/prompt",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/admin/settings",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  }
];
