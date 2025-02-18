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
import { Separator } from "@/components/ui/separator";
import { mockLoggedUser } from "@/components/organization/profile/useProfileForm";

interface OrganizationLayoutProps {
  children: ReactNode;
}

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
    <div className="min-h-screen bg-background">
      <header className="h-16 bg-card border-b fixed top-0 left-0 right-0 z-40">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{mockLoggedUser.organization.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">{mockLoggedUser.name}</p>
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockLoggedUser.avatar} alt={mockLoggedUser.name} />
              <AvatarFallback>{mockLoggedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="w-64 bg-card border-r border-border fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30">
          <nav className="py-6">
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

            <Separator className="my-6" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-sm transition-colors hover:bg-accent text-muted-foreground"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </button>
          </nav>
        </aside>

        <main className="flex-1 ml-64">
          <div className="p-8 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationLayout;
