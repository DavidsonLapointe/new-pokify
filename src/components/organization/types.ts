
import { User, UserRole } from "@/types";

export interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

export interface UserFormProps {
  editedUser: User | null;
  pendingRole: UserRole | "";
  pendingStatus: string;
  pendingArea?: string;
  onEditUser: (field: string, value: string) => void;
  onRoleChange: (value: UserRole) => void;
  onStatusChange: (value: string) => void;
  onAreaChange?: (value: string) => void;
}

// Definição das permissões padrão por função
export const DEFAULT_PERMISSIONS = {
  admin: ["dashboard", "leads", "users", "integrations", "settings", "plan", "profile"],
  seller: ["dashboard", "leads", "integrations", "profile"]
};
