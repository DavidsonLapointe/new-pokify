
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
      icon: Headphones, 
      label: "Análise de Leads", 
      path: "/organization/leads",
      permissionId: "leads"
    },
    { 
      icon: Users, 
      label: "Usuários", 
      path: "/organization/users",
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
      icon: CreditCard,
      label: "Meu Plano",
      path: "/organization/plan",
      permissionId: "plan"
    },
    {
      icon: Building,
      label: "Minha Empresa",
      path: "/organization/company",
      permissionId: "company"
    },
    {
      icon: UserCircle,
      label: "Meu Perfil",
      path: "/organization/profile",
      permissionId: "profile"
    },
  ];

  useEffect(() => {
    // In development mode, show all menu items regardless of permissions
    console.log('Development mode: Showing all menu items');
    setMenuItems(allMenuItems);
  }, [user]);

  return menuItems;
};
