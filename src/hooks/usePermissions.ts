
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

    // Simplifica a verificação para usar diretamente o array de permissões
    return user.permissions.includes(routeId);
  };

  const getUserPermissions = () => {
    const routes: string[] = [];

    // Profile é sempre permitido
    routes.push('profile');

    // Adiciona outras rotas que o usuário tem permissão
    if (user?.permissions) {
      routes.push(...user.permissions);
    }

    console.log('Rotas permitidas:', routes);
    return { routes };
  };

  return {
    hasRoutePermission,
    getUserPermissions
  };
};
