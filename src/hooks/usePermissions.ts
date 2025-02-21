
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') return true;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      console.log(`Sem usuário ou permissões definidas para rota ${routeId}`);
      return false;
    }

    console.log('Permissões do usuário:', user.permissions);
    console.log('Verificando permissão para rota:', routeId);

    // Verifica se a rota está nas permissões do usuário e tem pelo menos uma permissão
    const hasPermission = user.permissions[routeId]?.length > 0;
    
    console.log(`Rota ${routeId} tem permissões?`, hasPermission);
    console.log(`Permissões da rota ${routeId}:`, user.permissions[routeId]);
    
    return hasPermission;
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
    // Começa com a rota profile que é sempre permitida
    const routes: string[] = ['profile'];
    
    if (user?.permissions) {
      // Adiciona todas as rotas que têm permissões definidas
      Object.entries(user.permissions).forEach(([route, permissions]) => {
        if (permissions.length > 0 && !routes.includes(route)) {
          routes.push(route);
        }
      });
    }

    console.log('Permissões do usuário:', user?.permissions);
    console.log('Rotas permitidas:', routes);

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

    return { routes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
