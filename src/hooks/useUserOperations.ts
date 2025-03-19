
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useUserOperations = (setUser: (user: User | null) => void) => {
  const navigate = useNavigate();

  const updateUser = async (newUser: User) => {
    try {
      // For database compatibility, if role is "manager", store it as "admin"
      // This is a temporary solution until the database enum is updated
      let roleForDatabase = newUser.role;
      
      if (newUser.role === "manager") {
        roleForDatabase = "admin" as UserRole; // Cast to UserRole to satisfy TypeScript
      }
        
      const { error } = await supabase
        .from('profiles')
        .update({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar,
          role: roleForDatabase, // Use the converted role
          status: newUser.status,
        })
        .eq('id', newUser.id);

      if (error) throw error;

      setUser(newUser);
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return { updateUser, logout };
};
