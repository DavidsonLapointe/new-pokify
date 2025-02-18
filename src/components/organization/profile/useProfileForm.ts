
import { useState } from "react";
import { toast } from "sonner";

// Mock data (will be replaced with real auth data later)
export const mockLoggedUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@empresa.com",
  avatar: "",
  role: "admin",
  organization: {
    id: 1,
    name: "Tech Solutions Ltda",
  },
};

export interface ProfileFormData {
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar: string;
}

export const useProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: mockLoggedUser.email,
    phone: "(11) 99999-9999",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: mockLoggedUser.avatar,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockImageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        avatar: mockImageUrl
      }));
      
      // Update the mockLoggedUser for the navbar
      mockLoggedUser.avatar = mockImageUrl;
      
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar foto de perfil");
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

      // Update the mockLoggedUser data
      mockLoggedUser.email = formData.email;

      toast.success("Perfil atualizado com sucesso!");
      
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error("Erro ao atualizar o perfil");
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
