
import { useState, useEffect } from "react";
import { User } from "@/types";
import { mockLeadlyEmployees } from "@/mocks/userMocks";
import { toast } from "sonner";

export const useOrganizationUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to get users
        // For now, we'll use the mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setUsers(mockLeadlyEmployees);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
    updateUser
  };
};
