
import { User } from "@/types/organization";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Verifica se é uma rota padrão (todos têm acesso)
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (route?.isDefault) return true;

    // Se não tem permissões definidas, não tem acesso
    if (!user?.permissions) return false;

    // Verifica se o usuário tem acesso à rota
    return Object.keys(user.permissions).includes(routeId);
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
    const routes = availableRoutePermissions
      .filter(route => hasRoutePermission(route.id))
      .map(route => route.id);

    const tabs: { [routeId: string]: string[] } = {};
    
    availableRoutePermissions.forEach(route => {
      if (route.tabs) {
        const allowedTabs = route.tabs
          .filter(tab => hasTabPermission(route.id, tab.value))
          .map(tab => tab.value);
        
        if (allowedTabs.length > 0) {
          tabs[route.id] = allowedTabs;
        }
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

