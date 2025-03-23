
export interface AdminRoutePermission {
  id: string;
  label: string;
  description?: string;
}

export const availableAdminRoutePermissions: AdminRoutePermission[] = [
  { 
    id: "profile", 
    label: "Meu Perfil", 
    description: "Acesso ao perfil pessoal e preferências" 
  },
  { 
    id: "dashboard", 
    label: "Dashboard", 
    description: "Acesso ao painel principal administrativo" 
  },
  { 
    id: "organizations", 
    label: "Empresas", 
    description: "Gestão e visualização de empresas" 
  },
  { 
    id: "users", 
    label: "Usuários", 
    description: "Gestão de usuários administrativos" 
  },
  { 
    id: "modules", 
    label: "Módulos", 
    description: "Gestão de módulos e configurações" 
  },
  { 
    id: "plans", 
    label: "Planos", 
    description: "Configuração e visualização de planos" 
  },
  { 
    id: "credit-packages", 
    label: "Pacotes de Créditos", 
    description: "Gestão de pacotes de créditos" 
  },
  { 
    id: "financial", 
    label: "Financeiro", 
    description: "Relatórios e gestão financeira" 
  },
  { 
    id: "integrations", 
    label: "Integrações", 
    description: "Configuração de integrações com sistemas externos" 
  },
  { 
    id: "prompt", 
    label: "Prompts", 
    description: "Configuração de prompts para IA" 
  },
  { 
    id: "settings", 
    label: "Configurações", 
    description: "Configurações gerais do sistema" 
  }
];

export type AdminPermissionRole = "leadly_employee" | "leadly_master" | "admin" | "manager" | "seller";

export const ADMIN_DEFAULT_PERMISSIONS: Record<AdminPermissionRole, Record<string, boolean>> = {
  leadly_employee: {
    profile: true,
    dashboard: true,
    organizations: true,
    users: false,
    modules: true,
    plans: false,
    "credit-packages": false,
    financial: false,
    integrations: true,
    prompt: true,
    settings: true
  },
  leadly_master: {
    profile: true,
    dashboard: true,
    organizations: true,
    users: true,
    modules: true,
    plans: true,
    "credit-packages": true,
    financial: true,
    integrations: true,
    prompt: true,
    settings: true
  },
  admin: {
    profile: true,
    dashboard: true,
    users: true,
    settings: true
  },
  manager: {
    profile: true,
    dashboard: true,
    users: true
  },
  seller: {
    profile: true,
    dashboard: true
  }
};
