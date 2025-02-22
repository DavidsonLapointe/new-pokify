
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile e Company são sempre permitidos
    if (routeId === 'profile' || routeId === 'company') {
      return true;
    }

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      return false;
    }

    const permissions = user.permissions[routeId];
    return Array.isArray(permissions) && permissions.length > 0;
  };

  const getUserPermissions = () => {
    const routes: string[] = [];
    const permissions = user?.permissions || {};

    // Profile e Company são sempre permitidos
    routes.push('profile');
    routes.push('company');

    // Adiciona outras rotas que o usuário tem permissão
    Object.keys(permissions).forEach(routeId => {
      if (hasRoutePermission(routeId)) {
        routes.push(routeId);
      }
    });

    console.log('Rotas permitidas:', routes);
    return { routes, tabs: permissions };
  };

  const hasTabPermission = (routeId: string, tabValue: string): boolean => {
    // Profile e Company sempre têm acesso a todas as tabs
    if (routeId === 'profile' || routeId === 'company') return true;

    const permissions = user?.permissions?.[routeId] || [];
    return permissions.includes(tabValue);
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
