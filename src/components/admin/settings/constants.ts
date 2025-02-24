
import { User, BarChart3, List, Users, Network, Settings, CreditCard, Building2 } from "lucide-react";
import { Route, DashboardTab } from "./types";

export const organizationRoutes: Route[] = [
  {
    id: "profile",
    label: "Meu Perfil",
    icon: User,
    isDefault: true
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3
  },
  {
    id: "leads",
    label: "Análise de Leads",
    icon: List
  },
  {
    id: "users",
    label: "Usuários",
    icon: Users
  },
  {
    id: "integrations",
    label: "Integrações",
    icon: Network
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings
  },
  {
    id: "plan",
    label: "Meu Plano",
    icon: CreditCard
  },
  {
    id: "company",
    label: "Minha Empresa",
    icon: Building2
  }
];

export const dashboardTabs: DashboardTab[] = [
  { id: "leads", label: "Leads" },
  { id: "uploads", label: "Uploads" },
  { id: "performance", label: "Performance Vendedores" },
  { id: "objections", label: "Objeções" },
  { id: "suggestions", label: "Sugestões" },
  { id: "sellers", label: "Vendedores" }
];
