import { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/types';
import { supabase } from '@/integrations/supabase/realClient';

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch real organizations from Supabase
      const { data, error: supabaseError } = await supabase
        .from('empresas')
        .select('*');
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      // Transform data to match Organization interface
      const orgsWithUsers = (data || []).map((org: any) => ({
        id: org.id,
        name: org.name || '',
        nomeFantasia: org.nome_fantasia || '',
        cnpj: org.cnpj || '',
        email: org.email || '',
        phone: org.phone || '',
        status: org.status || 'pending',
        createdAt: org.created_at || new Date().toISOString(),
        updatedAt: org.updated_at,
        plan: org.plan || 'basic',
        users: org.users || [],
        adminName: org.admin_name,
        adminEmail: org.admin_email,
        adminPhone: org.admin_phone,
        logo: org.logo,
        address: org.address || {},
        // Default values for fields that might be undefined
        features: org.features || {},
        modules: org.modules || []
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
