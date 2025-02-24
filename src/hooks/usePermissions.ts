
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
      // Garante que o routeId está no array de permissões
      const hasPermission = Array.isArray(user.permissions) && user.permissions.includes(routeId);
      console.log(`Tem permissão para ${routeId}?`, hasPermission);
      return hasPermission;
    }

    // Para ambiente administrativo
    const adminPermissions = typeof user.permissions === 'object' && !Array.isArray(user.permissions) 
      ? Object.keys(user.permissions)
      : [];
    console.log('Permissões administrativas:', adminPermissions);
    const hasPermission = adminPermissions.includes(routeId);
    console.log(`Tem permissão para ${routeId}?`, hasPermission);
    return hasPermission;
  };

  const getUserPermissions = () => {
    let routes: string[] = [];

    if (isAdminRoute) {
      routes = typeof user?.permissions === 'object' && !Array.isArray(user.permissions)
        ? Object.keys(user.permissions)
        : [];
    } else {
      // Para ambiente da organização, usa diretamente o array de permissões
      routes = Array.isArray(user?.permissions) ? user.permissions : [];
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
