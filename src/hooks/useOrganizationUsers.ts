
import { useState, useEffect, useCallback } from 'react';
import { User, OrgUser } from '@/types';
import { mockOrganizationUsers } from '@/mocks/userMocks';
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
      
      // Use the mockOrganizationUsers array that contains 15 users across different organizations
      // But clone and add more users for the current organization to test pagination
      let filteredUsers = mockOrganizationUsers.filter(
        (mockUser) => mockUser.organization?.id === organizationId
      );
      
      // Duplicate users to ensure we have more than 12 for pagination testing
      if (filteredUsers.length > 0 && filteredUsers.length < 15) {
        const additionalUsers = [...filteredUsers]
          .map((user, index) => ({
            ...user,
            id: `dup-${index}-${user.id}`,
            name: `${user.name} (Copy ${index + 1})`,
            email: `copy${index + 1}.${user.email}`
          }));
        
        filteredUsers = [...filteredUsers, ...additionalUsers];
      }
      
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
