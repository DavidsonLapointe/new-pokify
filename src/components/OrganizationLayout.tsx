
import { ReactNode } from "react";
import {
  Settings,
  Users,
  Phone,
  BarChart3,
  Headphones,
  UserCircle,
  Building2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface OrganizationLayoutProps {
  children: ReactNode;
}

// Mock do usuário logado - depois será substituído pela autenticação real
const mockLoggedUser = {
  id: 1,
  name: "João Silva",
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

  // Menu items baseados no perfil do usuário
  const menuItems = isAdmin
    ? [
        {
          icon: BarChart3,
          label: "Dashboard",
          path: "/organization/dashboard",
        },
        { icon: Users, label: "Usuários", path: "/organization/users" },
        { icon: Phone, label: "Chamadas", path: "/organization/calls" },
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
      ]
    : [
        {
          icon: BarChart3,
          label: "Dashboard",
          path: "/organization/dashboard",
        },
        { icon: Phone, label: "Minhas Chamadas", path: "/organization/calls" },
        {
          icon: UserCircle,
          label: "Meu Perfil",
          path: "/organization/profile",
        },
      ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border animate-slideIn">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <h1 className="text-sm font-medium">
                {mockLoggedUser.organization.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Administrador" : "Vendedor"}
              </p>
            </div>
          </div>
        </div>
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
