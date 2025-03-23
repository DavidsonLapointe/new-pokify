
import { User, UserRole, UserStatus } from "@/types";

export interface UserFormProps {
  editedUser: User | null;
  pendingRole: UserRole | "";
  pendingStatus: string;
  pendingArea?: string;
  onEditUser: (field: string, value: string) => void;
  onRoleChange: (value: UserRole) => void;
  onStatusChange: (value: string) => void;
  onAreaChange?: (value: string) => void;
  availableStatusOptions: { value: string; label: string }[];
  availableRoles: { value: UserRole; label: string }[];
  availableAreas?: string[];
  currentStatusLabel?: React.ReactNode;
  currentRole?: UserRole;
}

export interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

export interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}
