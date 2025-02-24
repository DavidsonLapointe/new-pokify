
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

    // Garante que estamos trabalhando com um array
    const userPermissions = Array.isArray(user.permissions) 
      ? user.permissions 
      : Object.keys(user.permissions);

    return userPermissions.includes(routeId);
  };

  const getUserPermissions = () => {
    const routes: string[] = [];

    // Profile é sempre permitido
    routes.push('profile');

    // Adiciona outras rotas que o usuário tem permissão
    if (user?.permissions) {
      // Garante que estamos trabalhando com um array
      const userPermissions = Array.isArray(user.permissions)
        ? user.permissions
        : Object.keys(user.permissions);
        
      routes.push(...userPermissions);
    }

    console.log('Rotas permitidas:', routes);
    return { routes };
  };

  return {
    hasRoutePermission,
    getUserPermissions
  };
};
