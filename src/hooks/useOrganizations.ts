
import { useState, useEffect } from 'react';
import { Organization } from '@/types';
import { mockOrganizations } from '@/mocks/organizationMocks';

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we're using mock data
        setOrganizations(mockOrganizations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return {
    organizations,
    isLoading,
    setOrganizations,
  };
};
