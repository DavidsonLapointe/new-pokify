
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No user data returned from auth');
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organization_id (
            status,
            pending_reason
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile) {
        throw new Error('No profile found');
      }

      // Initialize default permissions object
      const defaultPermissions: { [key: string]: boolean } = {
        profile: true
      };

      // Update user's profile with default permissions if none exist
      if (!profile.permissions) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            permissions: defaultPermissions
          })
          .eq('id', authData.user.id);

        if (updateError) throw updateError;
      }

      // Check if user is leadly_employee or if their organization is active
      if (profile.role === 'leadly_employee' || 
          (profile.organization && profile.organization.status === 'active')) {
        // Redirect based on role
        if (profile.role === 'leadly_employee') {
          navigate('/admin');
          toast.success('Login realizado com sucesso!');
        } else {
          navigate('/organization/dashboard');
          toast.success('Login realizado com sucesso!');
        }
      } else {
        // If user's organization is not active and they're not a leadly_employee
        throw new Error('Sua empresa não possui uma assinatura ativa. Entre em contato com o suporte.');
      }

    } catch (error: any) {
      toast.error('Erro ao fazer login: ' + (error.message || 'Tente novamente'));
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
