
import { ReactNode } from "react";
import {
  Settings,
  Users,
  Headphones,
  BarChart3,
  Network,
  UserCircle,
  Building2,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ProtectedRoute } from "./ProtectedRoute";
import { usePermissions } from "@/hooks/usePermissions";
import { useUser } from "@/contexts/UserContext";

interface OrganizationLayoutProps {
  children?: ReactNode;
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { getUserPermissions } = usePermissions(user);

  // Pega as rotas permitidas para o usuário
  const allowedRoutes = getUserPermissions().routes;

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('mockLoggedUser');
      sessionStorage.clear();
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao realizar logout");
      console.error("Erro no logout:", error);
    }
  };

  const getMenuItems = () => {
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
        icon: UserCircle,
        label: "Meu Perfil",
        path: "/organization/profile",
        permissionId: "profile"
      },
    ];

    // Filtra apenas os itens do menu que estão na lista de rotas permitidas
    return allMenuItems.filter(item => allowedRoutes.includes(item.permissionId));
  };

  const menuItems = getMenuItems();

  const getInitials = (name: string) => {
    const nameParts = name.trim().split(' ')
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <ProtectedRoute user={user}>
      <div className="min-h-screen bg-background">
        <header className="h-16 bg-[#9b87f5] fixed top-0 left-0 right-0 z-40">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white">
              <Building2 className="w-4 h-4 text-white" />
              <span className="font-medium">{user.organization.name}</span>
            </div>
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
          <aside className="w-64 bg-white fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30 border-r border-gray-200">
            <nav className="flex flex-col h-full py-6 px-3">
              <div className="space-y-0.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] ${
                        active
                          ? "bg-[#F1F0FB] text-[#9b87f5]"
                          : "text-gray-600"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-3 ${active ? "text-[#9b87f5]" : "text-gray-600"}`} />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] text-[#6E59A5] mt-auto"
              >
                <LogOut className="w-4 h-4 mr-3 text-[#6E59A5]" />
                Sair
              </button>
            </nav>
          </aside>

          <main className="flex-1 ml-64">
            <div className="p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrganizationLayout;
