
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/types';
import { formatUserData } from '@/utils/userUtils';

export const useAuthLogin = (setUser: (user: User | null) => void) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.session?.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data.role === 'leadly_employee' || data.role === 'leadly_master') {
        const formattedUser = formatUserData(data);
        localStorage.setItem('adminUser', JSON.stringify(formattedUser));
        setUser(formattedUser);
        navigate('/admin/dashboard');
      } else {
        const formattedUser = formatUserData(data);
        localStorage.setItem('orgUser', JSON.stringify(formattedUser));
        setUser(formattedUser);
        navigate('/organization/dashboard');
      }

      toast.success('Login realizado com sucesso');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
};
