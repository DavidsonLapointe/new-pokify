
import { User } from "@/types/organization";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') return true;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) return false;

    // Verifica se a rota está nas permissões do usuário
    return routeId in user.permissions;
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
    // Começa com a rota profile
    const routes = ['profile'];
    
    // Adiciona apenas as rotas que existem nas permissões do usuário
    if (user?.permissions) {
      // Mapeia as rotas de acordo com as permissões do backend para as rotas da aplicação
      const routeMapping: { [key: string]: string } = {
        'dashboard': 'dashboard',
        'calls': 'calls',
        'leads': 'leads',
        'users': 'users',
        'integrations': 'integrations',
        'settings': 'settings',
        'plan': 'plan'
      };

      // Adiciona as rotas que o usuário tem permissão
      Object.keys(user.permissions).forEach(permissionKey => {
        const routeId = routeMapping[permissionKey];
        if (routeId && !routes.includes(routeId)) {
          routes.push(routeId);
        }
      });
    }

    // Monta o objeto de tabs permitidas
    const tabs: { [routeId: string]: string[] } = {};
    
    routes.forEach(routeId => {
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

    console.log('Permissões filtradas:', tabs);
    return { routes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
