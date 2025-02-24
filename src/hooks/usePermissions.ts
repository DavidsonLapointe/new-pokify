
import { User } from "@/types";
import { RoutePermission, availablePermissions, dashboardTabPermissions, settingsTabPermissions } from "@/types/permissions";

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

    // Verifica se é uma subpermissão (aba)
    const isDashboardTab = dashboardTabPermissions.includes(routeId);
    const isSettingsTab = settingsTabPermissions.includes(routeId);

    if (isDashboardTab || isSettingsTab) {
      const mainRoute = routeId.split('.')[0]; // 'dashboard' ou 'settings'
      if (!user.permissions[mainRoute]) {
        return false; // Se não tem acesso à página principal, não tem acesso às abas
      }
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
      // Adiciona rotas principais
      routes = Object.entries(user.permissions)
        .filter(([key, value]) => {
          // Não inclui subpermissões aqui
          if (key.includes('.')) return false;
          return Boolean(value);
        })
        .map(([key, _]) => key);

      // Adiciona subpermissões apenas para dashboard e settings
      if (user.permissions['dashboard']) {
        dashboardTabPermissions.forEach(tabPermission => {
          if (user.permissions[tabPermission]) {
            routes.push(tabPermission);
          }
        });
      }

      if (user.permissions['settings']) {
        settingsTabPermissions.forEach(tabPermission => {
          if (user.permissions[tabPermission]) {
            routes.push(tabPermission);
          }
        });
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
