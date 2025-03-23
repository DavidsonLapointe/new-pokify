
import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { mockLeadlyEmployees } from "@/mocks/userMocks";
import { toast } from "sonner";

export const useOrganizationUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizationUsers = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to get users
      // For now, we'll use the mock data and ensure it has all required properties
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Make sure all users have the required properties including logs
      const usersWithRequiredProps = mockLeadlyEmployees.map(user => ({
        ...user,
        logs: user.logs || [],
        status: user.status || 'active',
        area: user.area || 'General'
      }));
      
      setUsers(usersWithRequiredProps);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchOrganizationUsers();
  }, [fetchOrganizationUsers]);

  const updateUser = async (updatedUser: User): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to update the user
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
      return false;
    }
  };

  return {
    users,
    loading,
    updateUser,
    fetchOrganizationUsers
  };
};
