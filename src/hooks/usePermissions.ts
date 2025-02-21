
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') return true;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) return false;

    // Verifica se a rota está nas permissões do usuário
    const hasPermission = routeId in user.permissions;
    
    // Se tem a rota mas não tem permissões ou tem array vazio, não mostra
    if (!hasPermission || user.permissions[routeId].length === 0) {
      console.log(`Rota ${routeId} não tem permissões ou está vazia`);
      return false;
    }
    
    console.log(`Verificando permissão para rota ${routeId}:`, true);
    return true;
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
    // e que têm pelo menos uma permissão
    if (user?.permissions) {
      Object.entries(user.permissions).forEach(([route, permissions]) => {
        if (!routes.includes(route) && permissions.length > 0) {
          routes.push(route);
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

    console.log('Rotas permitidas:', routes);
    console.log('Tabs permitidas:', tabs);
    return { routes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
