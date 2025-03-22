
import { useState, useEffect } from "react";
import {
  Settings,
  Users,
  Headphones,
  BarChart3,
  Network,
  UserCircle,
  CreditCard,
  Building,
  List,
  Sparkles,
  Layers,
  Book,
  ClipboardCheck,
  Package,
  Wallet,
  Building2,
  Shield,
  Clipboard
} from "lucide-react";
import { User } from "@/types";

export const useMenuItems = (user: User) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const allMenuItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/organization/dashboard",
      permissionId: "dashboard"
    },
    {
      icon: Clipboard,
      label: "Cadastros",
      path: "/organization/registrations",
      permissionId: "registrations"
    },
    {
      icon: Book,
      label: "Base de Conhecimento",
      path: "/organization/knowledge-base",
      permissionId: "knowledge-base"
    },
    { 
      icon: List, 
      label: "Leads", 
      path: "/organization/leads",
      permissionId: "leads"
    },
    { 
      icon: Sparkles, 
      label: "Ferramentas de IA", 
      path: "/organization/ai-tools",
      permissionId: "ai-tools"
    },
    { 
      icon: Users, 
      label: "Usuários", 
      path: "/organization/users",
      permissionId: "users"
    },
    {
      icon: Shield,
      label: "Funções sem Usuários",
      path: "/organization/unused-permissions",
      permissionId: "users"
    },
    {
      icon: Network,
      label: "Integrações",
      path: "/organization/integrations",
      permissionId: "integrations"
    },
    {
      icon: Settings,
      label: "Configurações",
      path: "/organization/settings",
      permissionId: "settings"
    },
    {
      icon: Building2,
      label: "Cadastro de Áreas",
      path: "/organization/areas",
      permissionId: "areas"
    },
    {
      icon: Package,
      label: "Módulos do Sistema",
      path: "/organization/modules",
      permissionId: "plan"
    },
    {
      icon: Building,
      label: "Minha Empresa",
      path: "/organization/company",
      permissionId: "company"
    },
    {
      icon: Wallet,
      label: "Meus Créditos",
      path: "/organization/credits",
      permissionId: "credits"
    },
    {
      icon: UserCircle,
      label: "Meu Perfil",
      path: "/organization/profile",
      permissionId: "profile"
    },
  ];

  useEffect(() => {
    // Always show all menu items for development
    console.log('Development mode: Showing all menu items');
    setMenuItems(allMenuItems);
  }, [user]);

  return menuItems;
};
