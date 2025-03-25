import { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/types';
import { fetchOrganizations as fetchOrgsService } from '@/services/mockOrganizationService';

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Usando o serviço mockado em vez dos dados mockados diretamente
      const orgs = await fetchOrgsService();
      
      // Garantir que cada organização tenha um array de usuários
      const orgsWithUsers = orgs.map(org => ({
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
