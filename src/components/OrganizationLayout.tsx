
import { useLocation, Outlet } from "react-router-dom";
import { toast } from "sonner";
import ProtectedRoute from "./ProtectedRoute";
import { useUser } from "@/contexts/UserContext";
import { OrganizationHeader } from "./organization/layout/OrganizationHeader";
import { OrganizationSidebar } from "./organization/layout/OrganizationSidebar";
import { useMenuItems } from "./organization/layout/useMenuItems";

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
    const nameParts = name.trim().split(' ')
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
