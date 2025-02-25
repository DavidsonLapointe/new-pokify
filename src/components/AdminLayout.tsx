
import { ReactNode } from "react";
import { Settings, Building2, List, Database, User, LogOut, MessageSquare, DollarSign, Package, Users } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { usePermissions } from "@/hooks/usePermissions";
import { SidebarMenuItem } from "./organization/layout/SidebarMenuItem";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { user } = useUser();
  const { hasRoutePermission } = usePermissions(user);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const adminMenuItems = [
    { icon: List, label: "Dashboard", path: "/admin/dashboard", permissionId: "dashboard" },
    { icon: Building2, label: "Empresas", path: "/admin/organizations", permissionId: "organizations" },
    { icon: Users, label: "Usuários", path: "/admin/users", permissionId: "users" },
    { icon: DollarSign, label: "Planos", path: "/admin/plans", permissionId: "plans" },
    { icon: Package, label: "Pacote de Análises", path: "/admin/analysis-packages", permissionId: "analysis-packages" },
    { icon: DollarSign, label: "Financeiro", path: "/admin/financial", permissionId: "financial" },
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

  // Filtra os itens do menu baseado nas permissões
  const filteredMenuItems = adminMenuItems.filter(item => {
    const hasPermission = hasRoutePermission(item.permissionId);
    console.log(`Verificando permissão do menu para ${item.permissionId}:`, hasPermission);
    return hasPermission;
  });

  return (
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
        <aside className="w-64 bg-white border-r border-border fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30">
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

        <main className="flex-1 ml-64">
          <div className="p-8 animate-fadeIn">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
