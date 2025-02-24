
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/user-types";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label>Selecione a Função</Label>
      <RadioGroup
        value={selectedRole}
        onValueChange={(value: UserRole) => onRoleChange(value)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="leadly_employee" id="leadly_employee" />
          <Label htmlFor="leadly_employee">Funcionário Leadly</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="admin" id="admin" />
          <Label htmlFor="admin">Administrador</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="seller" id="seller" />
          <Label htmlFor="seller">Vendedor</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
