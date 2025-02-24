
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  const hasRoutePermission = (routeId: string): boolean => {
    console.log("\n=== Verificando Permissão ===");
    console.log("Rota solicitada:", routeId);
    console.log("É rota admin?", isAdminRoute);
    console.log("Permissões do usuário:", user?.permissions);

    // Profile é sempre permitido
    if (routeId === 'profile') {
      console.log("Permissão profile é sempre true");
      return true;
    }

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      console.log('Sem permissões definidas');
      return false;
    }

    // Se for ambiente da organização
    if (!isAdminRoute) {
      // Extrai as permissões independente do formato
      const permissions = Array.isArray(user.permissions)
        ? user.permissions
        : Object.keys(user.permissions);

      console.log('Permissões extraídas:', permissions);
      const hasPermission = permissions.includes(routeId);
      console.log(`Tem permissão para ${routeId}?`, hasPermission);
      return hasPermission;
    }

    // Para ambiente administrativo
    const adminPermissions = Array.isArray(user.permissions)
      ? user.permissions
      : Object.keys(user.permissions);
    console.log('Permissões administrativas:', adminPermissions);
    const hasPermission = adminPermissions.includes(routeId);
    console.log(`Tem permissão para ${routeId}?`, hasPermission);
    return hasPermission;
  };

  const getUserPermissions = () => {
    let routes: string[] = [];

    // Extrai as permissões independente do formato
    if (user?.permissions) {
      routes = Array.isArray(user.permissions)
        ? [...user.permissions]
        : Object.keys(user.permissions);
    }

    // Adiciona profile se não existir
    if (!routes.includes('profile')) {
      routes.push('profile');
    }

    console.log('Rotas permitidas finais:', routes);
    return { routes };
  };

  return {
    hasRoutePermission,
    getUserPermissions
  };
};
