
import { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/types';
import { mockOrganizations } from '@/mocks/organizationMocks';

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // For now, we're using mock data
      
      // Ensure each organization has a users array
      const orgsWithUsers = mockOrganizations.map(org => ({
        ...org,
        users: org.users || []
      }));
      
      setOrganizations(orgsWithUsers);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    isLoading,
    error,
    setOrganizations,
    refetch: fetchOrganizations,
  };
};
