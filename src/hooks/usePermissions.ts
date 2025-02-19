
import { User } from "@/types/organization";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Se o usuário não tem objeto de permissões definido, não tem acesso
    if (!user?.permissions) return false;

    // Verifica se o usuário tem a permissão na sua lista de permissões
    return routeId in user.permissions;
  };

  const hasTabPermission = (routeId: string, tabValue: string): boolean => {
    // Se não tem permissão para a rota, não tem permissão para as tabs
    if (!hasRoutePermission(routeId)) return false;

    // Se a rota não tem tabs definidas, permite acesso
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (!route?.tabs) return true;

    // Verifica se o usuário tem permissão específica para a tab
    const permissions = user.permissions[routeId] || [];
    return permissions.includes(tabValue);
  };

  const getUserPermissions = () => {
    if (!user?.permissions) {
      return { routes: [], tabs: {} };
    }

    // Pega apenas as rotas que existem nas permissões do usuário
    const routes = Object.keys(user.permissions);

    const tabs: { [routeId: string]: string[] } = {};
    routes.forEach(routeId => {
      const permissions = user.permissions[routeId];
      if (permissions && permissions.length > 0) {
        tabs[routeId] = permissions;
      }
    });

    return { routes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
