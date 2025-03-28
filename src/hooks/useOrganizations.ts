import { useState, useEffect, useCallback } from 'react';
import { Organization, OrganizationPlan, OrgUser } from '@/types';
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
      const { data: orgsData, error: supabaseError } = await supabase
        .from('organization')
        .select('*');
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Fetch all plans data from the 'planos' table
      const { data: planosData, error: planosError } = await supabase
        .from('planos')
        .select('*');

      if (planosError) {
        throw new Error(planosError.message);
      }

      // Create a map of plans by ID for quick lookup
      const planosMap = (planosData || []).reduce((acc: Record<string, any>, plan: any) => {
        acc[plan.id] = plan;
        return acc;
      }, {});

      // Fetch active users count for each organization from 'profiles' table
      const organizations = await Promise.all((orgsData || []).map(async (org: any) => {
        // Get active users with all required fields from profiles table
        const { data: activeUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id, name, email, tel, function, status, created_at, user_id')
          .eq('organization_id', org.id)
          .eq('status', 'active');

        if (usersError) {
          console.error('Error fetching users for organization:', org.id, usersError);
        }

        // Convert database users to OrgUser type
        const formattedUsers: OrgUser[] = (activeUsers || []).map((user: any) => ({
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          phone: user.tel || '',
          role: user.function || 'user',
          status: user.status || 'active',
          createdAt: user.created_at || new Date().toISOString(),
          organization: { id: org.id, name: org.name } as Organization
        }));

        // Find the plan details from planos table
        const planId = org.plan_id || '';
        const planData = planosMap[planId];
        
        const plan: OrganizationPlan = planData ? {
          id: planData.id,
          name: planData.name || 'Plano não especificado',
          value: planData.value || 0,
          features: planData.resources ? planData.resources.split(',') : []
        } : {
          id: '',
          name: 'Plano não especificado',
          value: 0,
          features: []
        };

        return {
          id: org.id,
          name: org.name || '',
          nomeFantasia: org.nome_fantasia || '',
          cnpj: org.cnpj || '',
          email: org.email || '',
          phone: org.phone || '',
          status: org.status || 'pending',
          createdAt: org.created_at || new Date().toISOString(),
          updatedAt: org.updated_at,
          plan: plan,
          planName: plan.name,
          users: formattedUsers,
          adminName: org.admin_name,
          adminEmail: org.admin_email,
          adminPhone: org.admin_phone,
          logo: org.logo,
          address: org.address || {},
          // Default values for fields that might be undefined
          features: org.features || {},
          modules: org.modules || []
        };
      }));
      
      setOrganizations(organizations);
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
