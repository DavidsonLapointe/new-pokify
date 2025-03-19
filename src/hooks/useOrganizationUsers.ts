
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/mocks/userMocks';
import { useUser } from '@/contexts/UserContext';

export const useOrganizationUsers = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call filtered by the current user's organization
        // For now, we're using mock data
        const organizationId = user?.organization?.id;
        const filteredUsers = mockUsers.filter(
          (mockUser) => mockUser.organization?.id === organizationId
        );
        
        setUsers(filteredUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching organization users:', error);
        setIsLoading(false);
      }
    };

    if (user?.organization?.id) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [user?.organization?.id]);

  return {
    users,
    isLoading,
    setUsers,
  };
};
