
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
      console.log('Sem permissões definidas');
      return false;
    }

    // Garante que permissions é um array antes de usar includes
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    console.log('Verificando permissão:', routeId, 'em', permissions);
    
    return permissions.includes(routeId);
  };

  const getUserPermissions = () => {
    // Garante que permissions é um array
    const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
    const routes = [...permissions];
    
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
