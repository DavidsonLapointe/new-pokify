
import { User } from "@/types";
import { RoutePermission, availablePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    console.log("\n=== Verificando Permissão ===");
    console.log("Rota solicitada:", routeId);
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

    // Verifica se a permissão existe e é true
    const hasPermission = Boolean(user.permissions[routeId]);
    console.log(`Tem permissão para ${routeId}?`, hasPermission);
    return hasPermission;
  };

  const getUserPermissions = () => {
    let routes: string[] = [];

    // Adiciona todas as rotas que têm permissão true
    if (user?.permissions) {
      routes = Object.entries(user.permissions)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key);
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
