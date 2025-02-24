
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') {
      return true;
    }

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      return false;
    }

    // Verifica se é um objeto de permissões (admin) ou um array (org)
    if (Array.isArray(user.permissions)) {
      return user.permissions.includes(routeId);
    } else {
      // Para usuários admin, verifica se a rota existe nas permissões
      return routeId in user.permissions;
    }
  };

  const getUserPermissions = () => {
    const routes: string[] = [];

    // Profile é sempre permitido
    routes.push('profile');

    // Adiciona outras rotas que o usuário tem permissão
    if (user?.permissions) {
      if (Array.isArray(user.permissions)) {
        // Para usuários da organização
        routes.push(...user.permissions);
      } else {
        // Para usuários admin
        routes.push(...Object.keys(user.permissions));
      }
    }

    console.log('Rotas permitidas:', routes);
    return { routes };
  };

  return {
    hasRoutePermission,
    getUserPermissions
  };
};
