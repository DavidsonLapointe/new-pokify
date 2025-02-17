
import { useState } from "react";
import { toast } from "sonner";
import { ProfileFormData } from "./types";
import { mockUser } from "./types";

export const useProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: mockUser.email,
    phone: mockUser.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  };
};
