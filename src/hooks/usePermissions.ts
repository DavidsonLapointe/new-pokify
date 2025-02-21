
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

    // Verifica EXPLICITAMENTE se a rota existe no objeto de permissões
    const hasRoute = Object.prototype.hasOwnProperty.call(user.permissions, routeId);
    
    if (!hasRoute) {
      console.log(`Rota ${routeId} não existe nas permissões do usuário`);
      return false;
    }

    // Verifica se tem permissões não vazias
    const permissions = user.permissions[routeId];
    const hasPermissions = Array.isArray(permissions) && permissions.length > 0;

    console.log(`Verificando permissões para rota ${routeId}:`);
    console.log('- Rota existe:', hasRoute);
    console.log('- Tem permissões:', hasPermissions);
    console.log('- Permissões:', permissions);

    return hasRoute && hasPermissions;
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
    const routes: string[] = [];
    const tabs: { [routeId: string]: string[] } = {};
    
    // Adiciona profile que é sempre permitido
    routes.push('profile');
    
    if (user?.permissions) {
      // Itera sobre cada rota nas permissões
      Object.keys(user.permissions).forEach(routeId => {
        // Verifica explicitamente se tem permissão para a rota
        if (hasRoutePermission(routeId)) {
          routes.push(routeId);
          tabs[routeId] = user.permissions[routeId];
        }
      });
    }

    console.log('=== Permissões calculadas ===');
    console.log('Rotas permitidas:', routes);
    console.log('Tabs permitidas:', tabs);
    console.log('========================');

    return { routes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
