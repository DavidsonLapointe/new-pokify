
import { User } from "@/types/organization";
import { UserRoutePermissions, RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Verifica se é uma rota padrão (todos têm acesso)
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (route?.isDefault) return true;

    // Verifica se o usuário tem permissão para a rota
    return (user?.permissions?.[routeId] || []).includes("view");
  };

  const hasTabPermission = (routeId: string, tabId: string): boolean => {
    // Se não tem permissão para a rota, não tem permissão para as tabs
    if (!hasRoutePermission(routeId)) return false;

    // Verifica se tem permissão específica para a tab
    return (user?.permissions?.[routeId] || []).includes(tabId);
  };

  const getUserPermissions = (): UserRoutePermissions => {
    const routes = availableRoutePermissions
      .filter(route => hasRoutePermission(route.id))
      .map(route => route.id);

    const tabs: { [routeId: string]: string[] } = {};
    
    availableRoutePermissions.forEach(route => {
      if (route.tabs) {
        const allowedTabs = route.tabs
          .filter(tab => hasTabPermission(route.id, tab.id))
          .map(tab => tab.id);
        
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
