
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole, UserStatus } from "@/types";

interface UserFormProps {
  editedUser: User | null;
  pendingRole: UserRole | "";
  pendingStatus: string;
  onEditUser: (field: string, value: string) => void;
  onRoleChange: (value: UserRole) => void;
  onStatusChange: (value: string) => void;
}

export const UserForm = ({
  editedUser,
  pendingRole,
  pendingStatus,
  onEditUser,
  onRoleChange,
  onStatusChange,
}: UserFormProps) => {
  if (!editedUser) return null;

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
        <Label>Função</Label>
        <Select
          value={pendingRole || editedUser.role}
          onValueChange={onRoleChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="seller">Vendedor</SelectItem>
            <SelectItem value="leadly_employee">Funcionário Leadly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={pendingStatus || editedUser.status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
