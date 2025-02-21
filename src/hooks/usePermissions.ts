
import { User } from "@/types";
import { RoutePermission, availableRoutePermissions } from "@/types/permissions";

export const usePermissions = (user: User) => {
  const hasRoutePermission = (routeId: string): boolean => {
    // Profile é sempre permitido
    if (routeId === 'profile') return true;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) {
      console.log(`Sem usuário ou permissões definidas para rota ${routeId}`);
      return false;
    }

    // Normaliza o ID da rota (converte hífens para underscores e vice-versa)
    const normalizedRouteId = routeId.replace(/_/g, '-');
    const permissions = user.permissions;

    // Verifica se a rota está nas permissões do usuário
    const hasPermission = normalizedRouteId in permissions;
    
    // Se tem a rota mas não tem permissões ou tem array vazio, não mostra
    if (!hasPermission || permissions[normalizedRouteId]?.length === 0) {
      console.log(`Rota ${normalizedRouteId} não tem permissões ou está vazia`);
      return false;
    }
    
    console.log(`Verificando permissão para rota ${normalizedRouteId}:`, true);
    return true;
  };

  const hasTabPermission = (routeId: string, tabValue: string): boolean => {
    // Profile sempre tem acesso a todas as tabs
    if (routeId === 'profile') return true;

    // Se não tem permissão para a rota, não tem permissão para as tabs
    if (!hasRoutePermission(routeId)) return false;

    // Se não tem usuário ou permissões definidas, não tem acesso
    if (!user?.permissions) return false;

    // Normaliza o ID da rota
    const normalizedRouteId = routeId.replace(/_/g, '-');

    // Pega as permissões da rota
    const routePermissions = user.permissions[normalizedRouteId] || [];
    
    // Verifica se a tab está nas permissões da rota
    return routePermissions.includes(tabValue);
  };

  const getUserPermissions = () => {
    // Começa com a rota profile
    const routes = ['profile'];
    
    // Adiciona apenas as rotas que existem nas permissões do usuário
    // e que têm pelo menos uma permissão
    if (user?.permissions) {
      Object.entries(user.permissions).forEach(([route, permissions]) => {
        // Normaliza o ID da rota
        const normalizedRoute = route.replace(/_/g, '-');
        if (!routes.includes(normalizedRoute) && permissions.length > 0) {
          routes.push(normalizedRoute);
        }
      });
    }

    // Monta o objeto de tabs permitidas
    const tabs: { [routeId: string]: string[] } = {};
    
    routes.forEach(routeId => {
      if (routeId === 'profile') {
        // Para profile, permite todas as tabs
        const profileTabs = availableRoutePermissions
          .find(r => r.id === 'profile')
          ?.tabs?.map(t => t.value) || [];
        if (profileTabs.length > 0) {
          tabs[routeId] = profileTabs;
        }
      } else if (user?.permissions?.[routeId]) {
        // Para outras rotas, usa as permissões do usuário
        tabs[routeId] = user.permissions[routeId];
      }
    });

    console.log('Rotas permitidas:', routes);
    console.log('Tabs permitidas:', tabs);
    return { routes, tabs };
  };

  return {
    hasRoutePermission,
    hasTabPermission,
    getUserPermissions
  };
};
