
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";

const AdminLayout = () => {
  const { user, loading } = useUser();
  const permissions = useAdminPermissions();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user || user.role !== "leadly_employee") {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar permissions={permissions} />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
