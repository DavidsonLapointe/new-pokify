import { useState } from "react";
import { toast } from "sonner";
import { ProfileFormData } from "./types";
import { User, UserRole, Organization } from "@/types";

const mockOrganization: Organization = {
  id: 1,
  name: "Tech Solutions Ltda",
  nomeFantasia: "Tech Solutions",
  plan: "Enterprise",
  users: [],
  status: "active",
  integratedCRM: null,
  integratedLLM: "GPT-4",
  email: "contato@techsolutions.com",
  phone: "(11) 1234-5678",
  cnpj: "12.345.678/0001-90",
  adminName: "João Silva",
  adminEmail: "joao@empresa.com",
  createdAt: "2024-01-01T00:00:00.000Z"
};

// Mock data (will be replaced with real auth data later)
export const mockLoggedUser: User = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@empresa.com",
  phone: "(11) 99999-9999",
  role: "admin",
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastAccess: "2024-03-15T14:30:00.000Z",
  permissions: {
    dashboard: ["view", "export"],
    calls: ["view", "upload", "delete"],
    leads: ["view", "edit", "delete"],
    integrations: ["view", "edit"],
    users: ["view", "edit", "delete"],
    settings: ["view", "edit"],
    plan: ["view", "edit"],
    profile: ["view", "edit"]
  },
  logs: [
    {
      id: 1,
      date: "2024-03-15T14:30:00.000Z",
      action: "Acessou o sistema",
    },
  ],
  avatar: "",
  organization: mockOrganization,
};

export const useProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: mockLoggedUser.name,
    email: mockLoggedUser.email,
    phone: mockLoggedUser.phone,
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

      mockLoggedUser.email = formData.email;
      mockLoggedUser.name = formData.name;
      mockLoggedUser.phone = formData.phone;

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
