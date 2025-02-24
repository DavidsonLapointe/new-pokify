
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile e Company são sempre permitidos
    if (routeId === 'profile' || routeId === 'company') {
      return true;
    }

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      return false;
    }

    // Agora permissions é apenas um array de strings com os IDs das rotas permitidas
    return user.permissions.includes(routeId);
  };

  const getUserPermissions = () => {
    const routes: string[] = [];

    // Profile e Company são sempre permitidos
    routes.push('profile');
    routes.push('company');

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
