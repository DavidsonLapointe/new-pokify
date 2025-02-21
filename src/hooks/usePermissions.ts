
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    console.log(`\n=== Verificando permissão para rota ${routeId} ===`);
    
    // Profile é sempre permitido
    if (routeId === 'profile') {
      console.log('Profile é sempre permitido');
      return true;
    }

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      console.log('Sem usuário ou permissões definidas');
      return false;
    }

    // Verifica se a rota existe nas permissões do usuário
    const hasRoute = Object.prototype.hasOwnProperty.call(user.permissions, routeId);
    console.log('Rota existe nas permissões?', hasRoute);

    if (!hasRoute) {
      console.log('Rota não encontrada nas permissões');
      return false;
    }

    // Verifica se tem permissões não vazias
    const permissions = user.permissions[routeId];
    const hasPermissions = Array.isArray(permissions) && permissions.length > 0;
    
    console.log('Permissões da rota:', permissions);
    console.log('Tem permissões válidas?', hasPermissions);
    console.log('================================\n');

    return hasRoute && hasPermissions;
  };

  const getUserPermissions = () => {
    console.log('\n=== Calculando permissões do usuário ===');
    console.log('Usuário:', user?.name);
    console.log('Permissões do usuário:', user?.permissions);
    
    const routes: string[] = [];
    
    // Adiciona profile que é sempre permitido
    routes.push('profile');
    console.log('Adicionado profile (padrão)');
    
    if (user?.permissions) {
      // Itera sobre cada permissão do usuário
      Object.keys(user.permissions).forEach(routeId => {
        console.log(`\nVerificando rota: ${routeId}`);
        
        if (hasRoutePermission(routeId)) {
          console.log(`Adicionando rota permitida: ${routeId}`);
          routes.push(routeId);
        }
      });
    }

    console.log('\nRotas permitidas final:', routes);
    console.log('====================================\n');

    return { routes, tabs: user?.permissions || {} };
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

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
