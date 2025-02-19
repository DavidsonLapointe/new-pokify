
import { User } from "@/types/organization";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Se não tem permissões definidas, não tem acesso (exceto para rotas padrão)
    if (!user?.permissions) {
      const route = availableRoutePermissions.find(r => r.id === routeId);
      return route?.isDefault || false;
    }

    // Verifica explicitamente quais rotas o usuário tem permissão
    const userPermissions = user.permissions || {};
    
    // Profile é uma rota padrão
    if (routeId === 'profile') return true;
    
    // Para outras rotas, verifica se existe na lista de permissões do usuário
    return routeId in userPermissions;
  };

  const hasTabPermission = (routeId: string, tabValue: string): boolean => {
    // Se não tem permissão para a rota, não tem permissão para as tabs
    if (!hasRoutePermission(routeId)) return false;

    // Se a rota não tem tabs definidas, permite acesso
    const route = availableRoutePermissions.find(r => r.id === routeId);
    if (!route?.tabs) return true;

    // Para o perfil, permite acesso a todas as tabs
    if (routeId === 'profile') return true;

    // Verifica se o usuário tem permissão específica para a tab
    const permissions = user.permissions?.[routeId] || [];
    return permissions.includes(tabValue);
  };

  const getUserPermissions = () => {
    // Começa com a rota profile que é padrão
    const routes = ['profile'];
    
    // Adiciona as outras rotas que o usuário tem permissão
    if (user?.permissions) {
      Object.keys(user.permissions).forEach(routeId => {
        if (!routes.includes(routeId)) {
          routes.push(routeId);
        }
      });
    }

    const tabs: { [routeId: string]: string[] } = {};
    
    routes.forEach(routeId => {
      const route = availableRoutePermissions.find(r => r.id === routeId);
      if (route?.tabs) {
        const allowedTabs = route.tabs
          .filter(tab => hasTabPermission(routeId, tab.value))
          .map(tab => tab.value);
        
        if (allowedTabs.length > 0) {
          tabs[routeId] = allowedTabs;
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
