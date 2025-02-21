
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
  onEditUser: (field: string, value: string) => void;
  onRoleChange: (value: UserRole) => void;
  onStatusChange: (value: string) => void;
}

// Definição das permissões padrão por função
export const DEFAULT_PERMISSIONS = {
  admin: {
    dashboard: ["leads", "uploads", "performance", "objections", "suggestions", "sellers"],
    leads: ["view", "edit", "delete"],
    users: ["view", "edit", "delete"],
    integrations: ["view", "edit"],
    settings: ["view", "edit"],
    plan: ["view", "upgrade"],
    profile: ["contact", "password"]
  },
  seller: {
    dashboard: ["leads", "uploads"],
    leads: ["view"],
    profile: ["contact", "password"]
  }
};

