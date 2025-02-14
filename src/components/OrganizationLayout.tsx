
import { ReactNode } from "react";
import {
  Settings,
  Users,
  Phone,
  BarChart3,
  Headphones,
  UserCircle,
  Building2,
  PhoneCall,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Função para fazer logout (mock)
  const handleLogout = () => {
    console.log("Logout realizado");
    navigate("/"); // Redireciona para a landing page
  };

  // Menu items baseados no perfil do usuário com as novas opções
  const getMenuItems = () => {
    const commonItems = [
      {
        icon: BarChart3,
        label: "Dashboard",
        path: "/organization/dashboard",
      },
      { 
        icon: Phone, 
        label: "Análise de Chamadas", 
        path: "/organization/calls" 
      },
      { 
        icon: PhoneCall, 
        label: "Efetuar Ligação", 
        path: "/organization/new-call"
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
        icon: Headphones,
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
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border animate-slideIn">
        {/* Header com Avatar e Info do Usuário */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockLoggedUser.avatar} alt={mockLoggedUser.name} />
              <AvatarFallback>{mockLoggedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-medium truncate">
                {mockLoggedUser.name}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {mockLoggedUser.email}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 animate-fadeIn">{children}</div>
      </main>
    </div>
  );
};

export default OrganizationLayout;
