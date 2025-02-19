
import {
  BarChart3,
  Building2,
  FileText,
  Network,
  Settings,
  Users2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/organization/dashboard",
  },
  {
    title: "Análise de Leads",
    icon: FileText,
    url: "/organization/analysis",
  },
  {
    title: "Ligações",
    icon: Building2,
    url: "/organization/calls",
  },
  {
    title: "Oportunidades",
    icon: FileText,
    url: "/organization/leads",
  },
  {
    title: "Usuários",
    icon: Users2,
    url: "/organization/users",
  },
  {
    title: "Planos",
    icon: FileText,
    url: "/organization/plan",
  },
  {
    title: "Integrações",
    icon: Network,
    url: "/organization/integrations",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/organization/settings",
  },
];

export function OrganizationSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-2 py-1.5 rounded-md text-sm ${
                          isActive
                            ? "bg-[#9b87f5]/10 text-[#9b87f5] font-medium"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 ${
                            isActive ? "text-[#9b87f5]" : "text-muted-foreground"
                          }`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
