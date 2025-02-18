
import { ReactNode } from "react";
import {
  Settings,
  Users,
  Headphones,
  BarChart3,
  Network,
  UserCircle,
  Building2,
  PhoneCall,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface OrganizationLayoutProps {
  children: ReactNode;
}

// Mock do usuário logado - depois será substituído pela autenticação real
const mockLoggedUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@empresa.com",
  avatar: "", // URL da imagem do usuário
  role: "admin", // ou "seller"
  organization: {
    id: 1,
    name: "Tech Solutions Ltda",
  },
};

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = mockLoggedUser.role === "admin";

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

  const getMenuItems = () => {
    const commonItems = [
      {
        icon: BarChart3,
        label: "Dashboard",
        path: "/organization/dashboard",
      },
      { 
        icon: Headphones, 
        label: "Análise de Leads", 
        path: "/organization/leads"
      },
      { 
        icon: PhoneCall, 
        label: "Efetuar Ligação", 
        path: "/organization/new-call"
      },
      {
        icon: CreditCard,
        label: "Meu Plano",
        path: "/organization/plan",
      },
      {
        icon: UserCircle,
        label: "Meu Perfil",
        path: "/organization/profile",
      },
    ];

    const adminItems = [
      { icon: Users, label: "Usuários", path: "/organization/users" },
      {
        icon: Network,
        label: "Integrações",
        path: "/organization/integrations",
      },
      {
        icon: Settings,
        label: "Configurações",
        path: "/organization/settings",
      },
    ];

    return isAdmin ? [...commonItems, ...adminItems] : commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Agora fixa */}
      <aside className="w-64 bg-card border-r border-border fixed left-0 top-0 h-screen overflow-y-auto z-40">
        {/* Logo ou Nome da Organização */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{mockLoggedUser.organization.name}</span>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="mt-6">
          {menuItems.map((item) => {
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

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm transition-colors hover:bg-accent text-muted-foreground mt-6"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sair
          </button>
        </nav>
      </aside>

      {/* Main Content com margem à esquerda para compensar o sidebar fixo */}
      <div className="flex-1 ml-64">
        {/* Header com informações do usuário - Agora fixo */}
        <div className="h-16 bg-card border-b px-8 flex items-center justify-end fixed top-0 right-0 left-64 z-30">
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">{mockLoggedUser.name}</p>
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockLoggedUser.avatar} alt={mockLoggedUser.name} />
              <AvatarFallback>{mockLoggedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        {/* Conteúdo da página com padding-top para compensar o header fixo */}
        <div className="p-8 pt-24 animate-fadeIn">{children}</div>
      </div>
    </div>
  );
};

export default OrganizationLayout;
