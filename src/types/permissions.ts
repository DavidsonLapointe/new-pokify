
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
    isDefault: true
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
    path: "/organization/leads"
  },
  {
    id: "users",
    label: "Usuários",
    path: "/organization/users"
  },
  {
    id: "integrations",
    label: "Integrações",
    path: "/organization/integrations"
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/organization/settings"
  },
  {
    id: "plan",
    label: "Meu Plano",
    path: "/organization/plan"
  },
  {
    id: "company",
    label: "Minha Empresa",
    path: "/organization/company"
  }
];
