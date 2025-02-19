
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
    isDefault: true, // Todos os usuários têm acesso
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
      { id: "sellers", label: "Vendedores", value: "sellers" },
      { id: "objections", label: "Objeções", value: "objections" },
      { id: "suggestions", label: "Sugestões", value: "suggestions" }
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
  }
];

// Atualiza a interface User para incluir o novo formato de permissões
export interface UserRoutePermissions {
  routes: string[]; // Array com os IDs das rotas permitidas
  tabs: { [routeId: string]: string[] }; // Mapa de routeId para array de tabIds permitidos
}
