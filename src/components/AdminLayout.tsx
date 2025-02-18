
import { ReactNode } from "react";
import { Settings, Users, List, Database, User, LogOut, MessageSquare, DollarSign, Package } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { mockAdminUser } from "@/components/admin/profile/useAdminProfileForm";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { icon: List, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Empresas", path: "/admin/organizations" },
    { icon: DollarSign, label: "Planos", path: "/admin/plans" },
    { icon: Package, label: "Pacote de Análises", path: "/admin/analysis-packages" },
    { icon: DollarSign, label: "Financeiro", path: "/admin/financial" },
    { icon: Database, label: "Integrações", path: "/admin/integrations" },
    { icon: MessageSquare, label: "Prompt", path: "/admin/prompt" },
    { icon: Settings, label: "Configurações", path: "/admin/settings" },
    { icon: User, label: "Meu Perfil", path: "/admin/profile" },
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar - Ocupando toda a largura */}
      <header className="h-16 bg-card border-b fixed top-0 left-0 right-0 z-40">
        <div className="h-full px-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Leadly</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">{mockAdminUser.name}</p>
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockAdminUser.avatar} alt={mockAdminUser.name} />
              <AvatarFallback>{mockAdminUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30">
          <nav className="py-6">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-6 py-3 text-sm transition-colors hover:bg-accent ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-sm transition-colors hover:bg-accent text-muted-foreground mt-6"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="p-8 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
