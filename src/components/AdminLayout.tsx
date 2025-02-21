
import { ReactNode } from "react";
import { Settings, Building2, List, Database, User, LogOut, MessageSquare, DollarSign, Package, Users } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const adminMenuItems = [
    { icon: List, label: "Dashboard", path: "/admin", permissionKey: "dashboard" },
    { icon: Building2, label: "Empresas", path: "/admin/organizations", permissionKey: "organizations" },
    { icon: Users, label: "Usuários", path: "/admin/users", permissionKey: "users" },
    { icon: DollarSign, label: "Planos", path: "/admin/plans", permissionKey: "plans" },
    { icon: Package, label: "Pacote de Análises", path: "/admin/analysis-packages", permissionKey: "analysis_packages" },
    { icon: DollarSign, label: "Financeiro", path: "/admin/financial", permissionKey: "financial" },
    { icon: Database, label: "Integrações", path: "/admin/integrations", permissionKey: "integrations" },
    { icon: MessageSquare, label: "Prompt", path: "/admin/prompt", permissionKey: "prompt" },
    { icon: Settings, label: "Configurações", path: "/admin/settings", permissionKey: "settings" },
    { icon: User, label: "Meu Perfil", path: "/admin/profile", permissionKey: "profile" },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.clear();
      toast.success("Logout realizado com sucesso");
      navigate("/");
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

  // Filtra os itens do menu baseado nas permissões do usuário
  const filteredMenuItems = adminMenuItems.filter(item => {
    if (item.permissionKey === 'profile') return true; // Perfil sempre visível
    return user.permissions && user.permissions[item.permissionKey];
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
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-[#F1F0FB] ${
                      isActive
                        ? "bg-[#F1F0FB] text-[#9b87f5]"
                        : "text-gray-600"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-[#9b87f5]" : "text-gray-600"}`} />
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
          <div className="p-8 animate-fadeIn">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
