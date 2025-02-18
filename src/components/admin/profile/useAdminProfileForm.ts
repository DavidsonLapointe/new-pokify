
import { useState } from "react";
import { toast } from "sonner";

// Mock data (will be replaced with real auth data later)
export const mockAdminUser = {
  name: "Admin Silva",
  email: "admin.silva@leadly.com",
  phone: "(11) 99999-9999",
  avatar: "",
};

export interface AdminProfileFormData {
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar: string;
}

export const useAdminProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AdminProfileFormData>({
    email: mockAdminUser.email,
    phone: mockAdminUser.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: mockAdminUser.avatar,
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
