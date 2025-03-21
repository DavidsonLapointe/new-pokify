
import { User, UserRole } from "@/types";

export interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

// Definição das permissões padrão por função
export const DEFAULT_PERMISSIONS = {
  admin: ["dashboard", "leads", "users", "integrations", "settings", "plan", "profile"],
  seller: ["dashboard", "leads", "integrations", "profile"]
};
