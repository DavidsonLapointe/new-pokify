
import { useLocation, Outlet } from "react-router-dom";
import { toast } from "sonner";
import ProtectedRoute from "./ProtectedRoute";
import { useUser } from "@/contexts/UserContext";
import { OrganizationHeader } from "./organization/layout/OrganizationHeader";
import { OrganizationSidebar } from "./organization/layout/OrganizationSidebar";
import { useMenuItems } from "./organization/layout/useMenuItems";
import { UserRole, UserStatus } from "@/types/user-types";

// Flag para desenvolvimento - ative para visualizar sem autenticação
const DEV_MODE = false;

const OrganizationLayout = () => {
  const location = useLocation();
  const { user, logout: contextLogout } = useUser();
  const menuItems = useMenuItems(user);

  const handleLogout = () => {
    try {
      contextLogout();
      toast.success("Logout realizado com sucesso");
      window.location.href = "/";
    } catch (error) {
      toast.error("Erro ao realizar logout");
      console.error("Erro no logout:", error);
    }
  };

  const getInitials = (name: string) => {
    const nameParts = name?.trim().split(' ') || ['U', 'S']
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Usuário de exemplo para desenvolvimento
  const mockUser = {
    id: "dev-user-id",
    name: "Usuário de Desenvolvimento",
    email: "dev@example.com",
    role: "admin" as UserRole,
    status: "active" as UserStatus,
    permissions: {
      dashboard: true,
      leads: true,
      users: true,
      integrations: true,
      settings: true,
      plan: true,
      company: true,
      profile: true
    },
    organization: {
      name: "Empresa de Desenvolvimento",
      logo: null
    },
    // Adicionando os campos que faltavam para satisfazer o tipo User
    createdAt: new Date().toISOString(),
    logs: [] // Array vazio de logs
  };

  // Renderização condicional baseada no modo de desenvolvimento
  if (DEV_MODE) {
    return (
      <div className="min-h-screen bg-background">
        <OrganizationHeader user={mockUser} getInitials={getInitials} />
        
        <div className="flex pt-16">
          <OrganizationSidebar 
            menuItems={menuItems.length ? menuItems : useMenuItems(mockUser)}
            isActive={isActive}
            handleLogout={handleLogout}
          />

          <main className="flex-1 ml-64">
            <div className="p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Modo normal com autenticação
  return (
    <ProtectedRoute user={user}>
      <div className="min-h-screen bg-background">
        <OrganizationHeader user={user} getInitials={getInitials} />
        
        <div className="flex pt-16">
          <OrganizationSidebar 
            menuItems={menuItems}
            isActive={isActive}
            handleLogout={handleLogout}
          />

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
