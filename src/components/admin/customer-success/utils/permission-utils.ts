
import { User } from "@/types";
import { 
  permissionLabels, 
  dashboardTabPermissions, 
  settingsTabPermissions,
  crmTabPermissions
} from "@/types/permissions";

export interface PermissionWithUsers {
  users: User[];
  label: string;
  count: number;
  hasChildPermissions?: boolean;
}

export type PermissionMap = Record<string, PermissionWithUsers>;

// Helper function to determine if a module has tab permissions
export const hasTabPermissions = (moduleKey: string): boolean => {
  if (moduleKey === 'dashboard') return true;
  if (moduleKey === 'settings') return true;
  if (moduleKey === 'crm') return true;
  return false;
};

// Get tab permissions for a given parent module
export const getTabPermissions = (parentKey: string): string[] => {
  switch(parentKey) {
    case 'dashboard':
      return dashboardTabPermissions;
    case 'settings':
      return settingsTabPermissions;
    case 'crm':
      return crmTabPermissions;
    default:
      return [];
  }
};

// Organize permissions and users
export const getPermissionData = (activeUsers: User[]): PermissionMap => {
  const permissionMap: PermissionMap = {};
  
  // Initialize with all permissions from permissionLabels
  Object.entries(permissionLabels).forEach(([key, label]) => {
    const hasChildPermissions = hasTabPermissions(key);
    
    permissionMap[key] = { 
      users: [], 
      label, 
      count: 0,
      hasChildPermissions 
    };
  });

  // Populate with actual active users
  activeUsers.forEach(user => {
    if (!user.permissions) return;

    Object.entries(user.permissions).forEach(([permKey, hasPermission]) => {
      if (hasPermission && permissionMap[permKey]) {
        permissionMap[permKey].users.push(user);
        permissionMap[permKey].count = permissionMap[permKey].users.length;
      }
    });
  });

  return permissionMap;
};
