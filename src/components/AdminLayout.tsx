
import { ReactNode } from "react";
import { Settings, Users, List, Database, User, LogOut, MessageSquare, DollarSign, Package } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

const mockLoggedUser = {
  id: 1,
  name: "Maria Silva",
  email: "maria.silva@leadly.com",
  avatar: "",
  role: "admin",
};

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
      // Limpar dados do usuário do localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Limpar qualquer outro dado de sessão que exista
      sessionStorage.clear();
      
      // Notificar o usuário
      toast.success("Logout realizado com sucesso");
      
      // Redirecionar para a landing page
      navigate("/");
    } catch (error) {
      toast.error("Erro ao realizar logout");
      console.error("Erro no logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border animate-slideIn">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold">Leadly</h1>
        </div>

        <nav className="mt-6">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Admin
            </h2>
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

      <main className="flex-1 overflow-auto">
        <div className="h-16 bg-card px-8 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">{mockLoggedUser.name}</p>
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockLoggedUser.avatar} alt={mockLoggedUser.name} />
              <AvatarFallback>{mockLoggedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="p-8 animate-fadeIn">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
