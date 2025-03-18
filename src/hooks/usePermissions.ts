
import { User } from "@/types";

export const usePermissions = (user: User) => {
  // Always return true for any route permission check since we're in development mode
  const hasRoutePermission = (routeId: string): boolean => {
    console.log(`Development mode: Permission check for ${routeId} skipped, returning true`);
    return true;
  };

  const getUserPermissions = () => {
    // Return all possible routes
    console.log('Development mode: Returning all routes');
    return { 
      routes: [
        'profile',
        'dashboard',
        'leads',
        'ai-tools',
        'users',
        'integrations',
        'settings',
        'plan',
        'company',
        'organizations',
        'financial',
        'plans',
        'credit-packages',
        'prompt'
      ] 
    };
  };

  return {
    hasRoutePermission,
    getUserPermissions
  };
};
