
import { useState } from "react";
import { toast } from "sonner";
import { ProfileFormData } from "./types";
import { User } from "@/types";
import { useUser } from "@/contexts/UserContext";

export const useProfileForm = () => {
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name,
    email: user.email,
    phone: user.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: user.avatar,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const mockImageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        avatar: mockImageUrl
      }));
      
      const updatedUser = {
        ...user,
        avatar: mockImageUrl
      };
      updateUser(updatedUser);
      
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar foto de perfil");
      console.error("Erro ao atualizar avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          toast.error("A nova senha deve ter pelo menos 6 caracteres");
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("As senhas não coincidem");
          return;
        }
        if (!formData.currentPassword) {
          toast.error("Digite sua senha atual");
          return;
        }
      }

      const updatedUser = {
        ...user,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar,
      };
      updateUser(updatedUser);

      toast.success("Perfil atualizado com sucesso!");
      
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error("Erro ao atualizar o perfil");
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleUpdateProfile,
    handleImageUpload,
  };
};
