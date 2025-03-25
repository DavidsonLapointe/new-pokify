import { useState, useEffect, useCallback } from 'react';
import { User, UserRole, UserStatus } from '@/types';
import { 
  fetchUsers as fetchUsersService,
  createUser,
  updateUser,
  updateUserStatus,
  updateUserRole,
  deleteUser
} from '@/services/mockUserService';
import { toast } from 'sonner';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUsersService();
      setUsers(data);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      return false;
    }
  }, []);

  const addUser = useCallback(async (userData: Partial<User>) => {
    try {
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      toast.success('Usuário criado com sucesso!');
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Erro ao criar usuário');
      throw err;
    }
  }, []);

  const editUser = useCallback(async (id: string, userData: Partial<User>) => {
    try {
      const updatedUser = await updateUser(id, userData);
      if (updatedUser) {
        setUsers(prev => 
          prev.map(user => user.id === id ? updatedUser : user)
        );
        toast.success('Usuário atualizado com sucesso!');
      }
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Erro ao atualizar usuário');
      throw err;
    }
  }, []);

  const changeUserStatus = useCallback(async (id: string, status: UserStatus) => {
    try {
      const success = await updateUserStatus(id, status);
      if (success) {
        setUsers(prev => 
          prev.map(user => user.id === id ? { ...user, status } : user)
        );
        toast.success(`Status do usuário alterado para ${status}!`);
      }
      return success;
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Erro ao alterar status do usuário');
      throw err;
    }
  }, []);

  const changeUserRole = useCallback(async (id: string, role: UserRole) => {
    try {
      const success = await updateUserRole(id, role);
      if (success) {
        setUsers(prev => 
          prev.map(user => user.id === id ? { ...user, role } : user)
        );
        toast.success(`Papel do usuário alterado para ${role}!`);
      }
      return success;
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Erro ao alterar papel do usuário');
      throw err;
    }
  }, []);

  const removeUser = useCallback(async (id: string) => {
    try {
      const success = await deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        toast.success('Usuário removido com sucesso!');
      }
      return success;
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Erro ao remover usuário');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    addUser,
    editUser,
    changeUserStatus,
    changeUserRole,
    removeUser
  };
};
