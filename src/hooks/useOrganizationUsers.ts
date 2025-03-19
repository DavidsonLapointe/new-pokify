
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/mocks/userMocks';
import { useUser } from '@/contexts/UserContext';

export const useOrganizationUsers = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizationUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call filtered by the current user's organization
      // For now, we're using mock data
      const organizationId = user?.organization?.id;
      const filteredUsers = mockUsers.filter(
        (mockUser) => mockUser.organization?.id === organizationId
      );
      
      setUsers(filteredUsers);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error fetching organization users:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      return false;
    }
  }, [user?.organization?.id]);

  const updateUser = useCallback(async (updatedUser: User) => {
    try {
      // In a real app, this would be an API call
      // For now, we're just updating the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (user?.organization?.id) {
      fetchOrganizationUsers();
    } else {
      setIsLoading(false);
    }
  }, [user?.organization?.id, fetchOrganizationUsers]);

  return {
    users,
    isLoading,
    error,
    setUsers,
    loading: isLoading,
    fetchOrganizationUsers,
    updateUser,
  };
};
