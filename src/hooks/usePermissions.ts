
import { User } from "@/types/organization";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') return true;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) return false;

    // Permissões do usuário
    const userPermissions = user.permissions;
    
    // Verifica se a rota está nas permissões do usuário
    return routeId in userPermissions;
  };

  const hasTabPermission = (routeId: string, tabValue: string): boolean => {
    // Profile sempre tem acesso a todas as tabs
    if (routeId === 'profile') return true;

    // Se não tem permissão para a rota, não tem permissão para as tabs
    if (!hasRoutePermission(routeId)) return false;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) return false;

    // Pega as permissões da rota
    const routePermissions = user.permissions[routeId] || [];
    
    // Verifica se a tab está nas permissões da rota
    return routePermissions.includes(tabValue);
  };

  const getUserPermissions = () => {
    // Sempre inclui profile nas rotas
    const routes = ['profile'];
    
    // Se tem permissões, adiciona as outras rotas
    if (user?.permissions) {
      routes.push(...Object.keys(user.permissions));
    }

    // Remove duplicatas e ordena
    const uniqueRoutes = [...new Set(routes)].sort();

    // Monta o objeto de tabs permitidas
    const tabs: { [routeId: string]: string[] } = {};
    
    uniqueRoutes.forEach(routeId => {
      if (routeId === 'profile') {
        // Para profile, permite todas as tabs
        const profileTabs = availableRoutePermissions
          .find(r => r.id === 'profile')
          ?.tabs?.map(t => t.value) || [];
        if (profileTabs.length > 0) {
          tabs[routeId] = profileTabs;
        }
      } else if (user?.permissions?.[routeId]) {
        // Para outras rotas, usa as permissões do usuário
        tabs[routeId] = user.permissions[routeId];
      }
    });

    return { routes: uniqueRoutes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
