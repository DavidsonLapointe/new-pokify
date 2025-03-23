
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserFormProps } from "./types";
import { UserStatus } from "@/types";

export const UserForm = ({
  editedUser,
  pendingRole,
  pendingStatus,
  onEditUser,
  onRoleChange,
  onStatusChange
}: UserFormProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary">Ativo</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inativo</Badge>;
      case "pending":
        return <Badge variant="default">Pendente</Badge>;
      default:
        return null;
    }
  };

  const getStatusOptions = (currentStatus: UserStatus) => {
    switch (currentStatus) {
      case "active":
        return [{ value: "inactive", label: "Inativo" }];
      case "inactive":
        return [{ value: "active", label: "Ativo" }];
      case "pending":
        return [
          { value: "active", label: "Ativo" },
          { value: "inactive", label: "Inativo" }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome*</label>
        <Input
          value={editedUser?.name}
          disabled
          className="bg-gray-50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email*</label>
        <Input
          type="email"
          value={editedUser?.email}
          onChange={(e) => onEditUser('email', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Telefone</label>
        <Input
          type="tel"
          value={editedUser?.phone}
          onChange={(e) => onEditUser('phone', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Função</label>
        <Select
          value={pendingRole || editedUser?.role}
          onValueChange={onRoleChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="seller">Vendedor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status atual:</label>
          {editedUser?.status && getStatusBadge(editedUser.status)}
        </div>
        <Select 
          value={pendingStatus} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o novo status" />
          </SelectTrigger>
          <SelectContent>
            {editedUser && getStatusOptions(editedUser.status).map(option => (
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
