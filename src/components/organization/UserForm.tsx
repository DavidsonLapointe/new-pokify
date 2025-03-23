
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
  pendingArea,
  onEditUser,
  onRoleChange,
  onStatusChange,
  onAreaChange,
  availableStatusOptions,
  availableRoles,
  availableAreas,
  currentStatusLabel,
  currentRole
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
            {availableRoles.map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Area field */}
      {onAreaChange && availableAreas && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Área</label>
          <Select
            value={pendingArea || editedUser?.area || ''}
            onValueChange={onAreaChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma área" />
            </SelectTrigger>
            <SelectContent>
              {availableAreas.map(area => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        {currentStatusLabel || (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Status atual:</label>
            {editedUser?.status && getStatusBadge(editedUser.status)}
          </div>
        )}
        <Select 
          value={pendingStatus} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o novo status" />
          </SelectTrigger>
          <SelectContent>
            {availableStatusOptions.map(option => (
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
