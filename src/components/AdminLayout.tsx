
import { ReactNode } from "react";
import { Settings, Building2, List, Database, User, LogOut, MessageSquare, DollarSign, Users, Puzzle, CreditCard, ClipboardCheck, Package, HeadphonesIcon } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { SidebarMenuItem } from "./organization/layout/SidebarMenuItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const adminMenuItems = [
    { icon: List, label: "Dashboard", path: "/admin/dashboard", permissionId: "dashboard" },
    { icon: Building2, label: "Empresas", path: "/admin/organizations", permissionId: "organizations" },
    { icon: Users, label: "Usuários", path: "/admin/users", permissionId: "users" },
    { icon: Puzzle, label: "Módulos", path: "/admin/modules", permissionId: "modules" },
    { icon: ClipboardCheck, label: "Setups", path: "/admin/module-setups", permissionId: "module-setups" },
    { icon: CreditCard, label: "Planos", path: "/admin/plans", permissionId: "plans" },
    { icon: Package, label: "Pacotes de Créditos", path: "/admin/credit-packages", permissionId: "credit-packages" },
    { icon: DollarSign, label: "Financeiro", path: "/admin/financial", permissionId: "financial" },
    { icon: HeadphonesIcon, label: "Customer Success", path: "/admin/customer-success", permissionId: "customer-success" },
    { icon: Database, label: "Integrações", path: "/admin/integrations", permissionId: "integrations" },
    { icon: MessageSquare, label: "Prompt", path: "/admin/prompt", permissionId: "prompt" },
    { icon: Settings, label: "Configurações", path: "/admin/settings", permissionId: "settings" },
    { icon: User, label: "Meu Perfil", path: "/admin/profile", permissionId: "profile" },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('orgUser');
      sessionStorage.clear();
      toast.success("Logout realizado com sucesso");
      window.location.href = "/";
    } catch (error) {
      toast.error("Erro ao realizar logout");
      console.error("Erro no logout:", error);
    }
  };

  const getInitials = (name: string) => {
    const nameParts = name.trim().split(' ')
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
  }

  // Se não houver usuário, não renderiza o layout
  if (!user) {
    return null;
  }

  // In development mode, always show all menu items without filtering by permissions
  const filteredMenuItems = adminMenuItems;
  console.log('Development mode: Showing all admin menu items');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <header className="h-16 bg-primary fixed top-0 left-0 right-0 z-40">
          <div className="h-full px-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Leadly</h1>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="flex pt-16">
          <aside className="w-[240px] bg-white border-r border-border fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30">
            <nav className="flex flex-col h-full py-6 px-3">
              <div className="space-y-0.5">
                {filteredMenuItems.map((item) => (
                  <SidebarMenuItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    active={isActive(item.path)}
                  />
                ))}
              </div>

              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-[#6E59A5] mt-auto"
              >
                <LogOut className="w-4 h-4 mr-3 text-[#6E59A5]" />
                Sair
              </Link>
            </nav>
          </aside>

          <main className="flex-1 ml-[240px]">
            <div className="p-6 animate-fadeIn">
              {children ?? <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default AdminLayout;
