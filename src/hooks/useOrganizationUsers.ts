
import { useState, useEffect, useCallback } from 'react';
import { User, OrgUser } from '@/types';
import { mockUsers, mockOrganizationUsers } from '@/mocks/userMocks';
import { useUser } from '@/contexts/UserContext';

export const useOrganizationUsers = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrganizationUsers = useCallback(async () => {
    setIsLoading(true);
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call filtered by the current user's organization
      // For now, we're using mock data
      const organizationId = user?.organization?.id;
      
      // Use the new mockOrganizationUsers array that contains 15 users across different organizations
      const filteredUsers = mockOrganizationUsers.filter(
        (mockUser) => mockUser.organization?.id === organizationId
      );
      
      setUsers(filteredUsers);
      setIsLoading(false);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error fetching organization users:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      setLoading(false);
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
      setLoading(false);
    }
  }, [user?.organization?.id, fetchOrganizationUsers]);

  return {
    users,
    isLoading,
    loading,
    error,
    setUsers,
    fetchOrganizationUsers,
    updateUser,
  };
};
