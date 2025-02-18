
export interface ProfileFormData {
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar?: string;
  name?: string;
}

export const mockUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@empresa.com",
  phone: "(11) 99999-9999",
  avatar: "",
};
