
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

    // Verifica se estamos em uma rota administrativa
    if (isAdminRoute) {
      const adminPermissions = typeof user.permissions === 'object' && !Array.isArray(user.permissions) 
        ? Object.keys(user.permissions)
        : [];
      console.log('Admin permissions:', adminPermissions);
      return adminPermissions.includes(routeId);
    }

    // Para rotas da organização, usa o array de permissões
    const orgPermissions = Array.isArray(user.permissions) ? user.permissions : [];
    console.log('Organization permissions:', orgPermissions);
    return orgPermissions.includes(routeId);
  };

  const getUserPermissions = () => {
    let routes: string[] = [];

    if (isAdminRoute) {
      // Para ambiente admin, usa as chaves do objeto de permissões
      routes = typeof user?.permissions === 'object' && !Array.isArray(user.permissions)
        ? Object.keys(user.permissions)
        : [];
    } else {
      // Para ambiente da organização, usa o array de permissões
      routes = Array.isArray(user?.permissions) ? [...user.permissions] : [];
    }

    // Profile é sempre permitido
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
