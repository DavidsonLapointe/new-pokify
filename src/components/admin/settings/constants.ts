
import { User, BarChart3, List, Users, Network, Settings, CreditCard, Building2, Bell, Database, Shield } from "lucide-react";

export const organizationRoutes = [
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
    id: "ai-tools",
    label: "Ferramentas de IA",
    icon: Network
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

export const settingsTabs = [
  { id: "alerts", label: "Alertas e Limites", icon: Bell },
  { id: "analysis", label: "Análises", icon: BarChart3 },
  { id: "retention", label: "Retenção", icon: Database },
  { id: "llm", label: "LLM", icon: Network },
  { id: "system", label: "Sistema", icon: Settings },
  { id: "permissions", label: "Permissões", icon: Shield }
];

export const dashboardTabs = [
  { id: "leads", label: "Leads" },
  { id: "uploads", label: "Uploads" },
  { id: "performance", label: "Performance Vendedores" },
  { id: "objections", label: "Objeções" },
  { id: "suggestions", label: "Sugestões" },
  { id: "sellers", label: "Vendedores" }
];
