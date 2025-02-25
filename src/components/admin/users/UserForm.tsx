
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole } from "@/types";

interface StatusOption {
  value: string;
  label: string;
}

interface RoleOption {
  value: UserRole;
  label: string;
}

interface UserFormProps {
  editedUser: User | null;
  pendingRole: UserRole | "";
  pendingStatus: string;
  onEditUser: (field: string, value: string) => void;
  onRoleChange: (value: UserRole) => void;
  onStatusChange: (value: string) => void;
  availableStatusOptions: StatusOption[];
  availableRoles: RoleOption[];
  currentStatusLabel: React.ReactNode;
}

export const UserForm = ({
  editedUser,
  pendingRole,
  pendingStatus,
  onEditUser,
  onRoleChange,
  onStatusChange,
  availableStatusOptions,
  availableRoles,
  currentStatusLabel,
}: UserFormProps) => {
  if (!editedUser) return null;

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "seller":
        return "Vendedor";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={editedUser.email}
          onChange={(e) => onEditUser("email", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={editedUser.phone}
          onChange={(e) => onEditUser("phone", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Função atual: {getRoleLabel(editedUser.role)}</Label>
        <Select
          value={pendingRole || editedUser.role}
          onValueChange={onRoleChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={getRoleLabel(editedUser.role)} />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{currentStatusLabel}</Label>
        <Select
          value={pendingStatus}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o novo status" />
          </SelectTrigger>
          <SelectContent>
            {availableStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
