
import { User } from '@/types';
import { Organization } from '@/types/organization-types';

export const getInitialUserState = (): User | null => null;

export const formatUserData = (profile: any, organization?: Organization): User => {
  const baseUserData = {
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    role: profile.role,
    status: profile.status || 'active',
    createdAt: profile.created_at,
    lastAccess: profile.last_access,
    permissions: profile.permissions as { [key: string]: boolean } || {},
    logs: [],
    avatar: '',
  };

  if (profile.role === 'leadly_employee') {
    return {
      ...baseUserData,
      company_leadly_id: profile.company_leadly_id
    };
  }

  return {
    ...baseUserData,
    organization
  };
};
