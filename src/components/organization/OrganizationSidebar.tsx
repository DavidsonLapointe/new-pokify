
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
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/organization/dashboard",
  },
  {
    title: "Leads",
    icon: FileText,
    url: "/organization/leads",
  },
  {
    title: "Calls",
    icon: Building2,
    url: "/organization/calls",
  },
  {
    title: "Users",
    icon: Users2,
    url: "/organization/users",
  },
  {
    title: "Plan",
    icon: FileText,
    url: "/organization/plan",
  },
  {
    title: "Integrations",
    icon: Network,
    url: "/organization/integrations",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/organization/settings",
  },
];

export function OrganizationSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
