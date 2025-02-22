
export interface RoutePermission {
  id: string;
  label: string;
  path: string;
  isDefault?: boolean;
  tabs?: {
    id: string;
    label: string;
    value: string;
  }[];
}

export const availableRoutePermissions: RoutePermission[] = [
  {
    id: "profile",
    label: "Meu Perfil",
    path: "/organization/profile",
    isDefault: true,
    tabs: [
      { id: "contact", label: "Informações de Contato", value: "contact" },
      { id: "password", label: "Alterar Senha", value: "password" }
    ]
  },
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/organization/dashboard",
    tabs: [
      { id: "leads", label: "Leads", value: "leads" },
      { id: "uploads", label: "Uploads", value: "uploads" },
      { id: "performance", label: "Performance Vendedores", value: "performance" },
      { id: "objections", label: "Objeções", value: "objections" },
      { id: "suggestions", label: "Sugestões", value: "suggestions" },
      { id: "sellers", label: "Vendedores", value: "sellers" }
    ]
  },
  {
    id: "leads",
    label: "Análise de Leads",
    path: "/organization/leads",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" },
      { id: "delete", label: "Excluir", value: "delete" }
    ]
  },
  {
    id: "users",
    label: "Usuários",
    path: "/organization/users",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" },
      { id: "delete", label: "Excluir", value: "delete" }
    ]
  },
  {
    id: "integrations",
    label: "Integrações",
    path: "/organization/integrations",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/organization/settings",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  },
  {
    id: "plan",
    label: "Meu Plano",
    path: "/organization/plan",
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "upgrade", label: "Alterar Plano", value: "upgrade" }
    ]
  },
  {
    id: "company",
    label: "Minha Empresa",
    path: "/organization/company",
    isDefault: true,
    tabs: [
      { id: "view", label: "Visualizar", value: "view" },
      { id: "edit", label: "Editar", value: "edit" }
    ]
  }
];
