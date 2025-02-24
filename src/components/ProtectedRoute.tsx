
import { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { User } from "@/types";
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
  const currentPath = location.pathname;
  console.log('Verificando acesso à rota:', currentPath);
  console.log('Usuário:', user);
  
  const currentRoute = availableRoutePermissions.find(
    route => currentPath === route.path
  );

  // Se não encontrou a rota nas configurações, redireciona para o perfil
  if (!currentRoute) {
    console.log('Rota não encontrada nas configurações');
    toast.error("Rota não encontrada");
    return <Navigate to="/organization/profile" replace />;
  }

  // Verifica se o usuário tem permissão para acessar a rota
  const hasPermission = hasRoutePermission(currentRoute.id);
  console.log('Tem permissão?', hasPermission);
  
  if (!hasPermission) {
    console.log('Usuário sem permissão para a rota');
    toast.error("Você não tem permissão para acessar esta página");
    return <Navigate to="/organization/profile" replace />;
  }

  // Se tem permissão, renderiza o conteúdo da rota normalmente
  return <>{children}</>;
};
