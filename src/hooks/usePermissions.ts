
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
      // Para ambiente da organização, verifica se a permissão existe no array
      if (Array.isArray(user.permissions)) {
        const hasPermission = user.permissions.includes(routeId);
        console.log('Permissões da organização:', user.permissions);
        console.log(`Tem permissão para ${routeId}?`, hasPermission);
        return hasPermission;
      } 
      // Se por algum motivo vier como objeto, tenta usar as chaves
      else if (typeof user.permissions === 'object') {
        const permissions = Object.keys(user.permissions);
        const hasPermission = permissions.includes(routeId);
        console.log('Permissões da organização (objeto):', permissions);
        console.log(`Tem permissão para ${routeId}?`, hasPermission);
        return hasPermission;
      }
      return false;
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
      // Para ambiente da organização
      if (Array.isArray(user?.permissions)) {
        routes = [...user.permissions];
      } else if (typeof user?.permissions === 'object') {
        routes = Object.keys(user.permissions);
      }
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
