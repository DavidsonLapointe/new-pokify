
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') {
      return true;
    }

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      console.log('Sem permissões definidas');
      return false;
    }

    // Para ambiente da organização, verifica se a permissão existe no array
    if (!isAdminRoute) {
      const permissions = Array.isArray(user.permissions) ? user.permissions : [];
      console.log('Verificando permissão da organização:', routeId, 'em', permissions);
      return permissions.includes(routeId);
    }

    // Para ambiente administrativo, verifica no objeto de permissões
    const adminPermissions = typeof user.permissions === 'object' && !Array.isArray(user.permissions) 
      ? Object.keys(user.permissions)
      : [];
    console.log('Verificando permissão administrativa:', routeId, 'em', adminPermissions);
    return adminPermissions.includes(routeId);
  };

  const getUserPermissions = () => {
    let routes: string[] = [];

    if (isAdminRoute) {
      routes = typeof user?.permissions === 'object' && !Array.isArray(user.permissions)
        ? Object.keys(user.permissions)
        : [];
    } else {
      routes = Array.isArray(user?.permissions) ? [...user.permissions] : [];
    }

    if (!routes.includes('profile')) {
      routes.push('profile');
    }

    console.log('Rotas permitidas:', routes);
    return { routes };
  };

  return {
    hasRoutePermission,
    getUserPermissions
  };
};
