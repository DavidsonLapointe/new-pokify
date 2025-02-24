
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') {
      return true;
    }

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      return false;
    }

    return user.permissions.includes(routeId);
  };

  const getUserPermissions = () => {
    const routes = user?.permissions || [];
    
    // Profile é sempre permitido
    if (!routes.includes('profile')) {
      routes.push('profile');
    }

    console.log('Rotas permitidas:', routes);
    return { routes };
  };

  return {
    hasRoutePermission,
    getUserPermissions
  };
};
