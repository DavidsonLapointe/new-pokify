
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
import { usePermissions } from "@/hooks/usePermissions";

export const useMenuItems = (user: User) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const { hasRoutePermission } = usePermissions(user);

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
    if (user) {
      const dashboardTabs = ['leads', 'uploads', 'performance', 'objections', 'suggestions', 'sellers'];
      
      const filteredItems = allMenuItems.filter(item => {
        if (item.permissionId === 'dashboard') {
          return dashboardTabs.some(tab => !!user.permissions[`dashboard.${tab}`]);
        }
        return hasRoutePermission(item.permissionId);
      });

      setMenuItems(filteredItems);
    }
  }, [user, hasRoutePermission]);

  return menuItems;
};
