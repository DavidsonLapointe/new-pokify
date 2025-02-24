
import { User } from "@/types";
import { availableAdminRoutePermissions } from "@/types/admin-permissions";

export const useAdminPermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') return true;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) return false;

    // Verifica se a rota está nas permissões do usuário
    const hasPermission = routeId in user.permissions;
    console.log(`Verificando permissão para rota ${routeId}:`, hasPermission);
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

  const getAdminPermissions = () => {
    // Começa com a rota profile
    const routes = ['profile'];
    
    // Adiciona apenas as rotas que existem nas permissões do usuário
    if (user?.permissions) {
      Object.keys(user.permissions).forEach(route => {
        if (!routes.includes(route)) {
          routes.push(route);
        }
      });
    }

    // Monta o objeto de tabs permitidas
    const tabs: { [routeId: string]: string[] } = {};
    
    routes.forEach(routeId => {
      if (user?.permissions?.[routeId]) {
        // Para todas as rotas, usa as permissões do usuário
        tabs[routeId] = user.permissions[routeId];
      }
    });

    return { routes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getAdminPermissions
  };
};
