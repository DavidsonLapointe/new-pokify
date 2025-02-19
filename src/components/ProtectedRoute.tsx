
import { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { User } from "@/types/organization";
import { usePermissions } from "@/hooks/usePermissions";
import { availableRoutePermissions } from "@/types/permissions";
import { toast } from "sonner";

interface ProtectedRouteProps {
  user: User;
  children: ReactNode;
}

export const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { hasRoutePermission } = usePermissions(user);

  // Encontra a rota atual baseada no path
  const currentRoute = availableRoutePermissions.find(
    route => location.pathname === route.path
  );

  // Se não encontrou a rota nas configurações, permite o acesso (pode ser uma rota pública)
  if (!currentRoute) {
    return <>{children}</>;
  }

  // Verifica se o usuário tem permissão para acessar a rota
  if (!hasRoutePermission(currentRoute.id)) {
    toast.error("Você não tem permissão para acessar esta página");
    return <Navigate to="/organization/profile" replace />;
  }

  // Se tem permissão, renderiza o conteúdo da rota normalmente
  return <>{children}</>;
};
