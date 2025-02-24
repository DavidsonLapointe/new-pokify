
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ADMIN_DEFAULT_PERMISSIONS } from "@/types/admin-permissions";
import { UserRole } from "@/types/user-types";

export const DefaultPermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("leadly_employee");
  const [permissions, setPermissions] = useState<Record<string, string[]>>(ADMIN_DEFAULT_PERMISSIONS);

  const handleTogglePermission = (route: string, permission: string) => {
    setPermissions(prev => {
      const currentPerms = prev[selectedRole] || {};
      const routePerms = currentPerms[route] || [];
      
      const updated = {
        ...prev,
        [selectedRole]: {
          ...currentPerms,
          [route]: routePerms.includes(permission)
            ? routePerms.filter(p => p !== permission)
            : [...routePerms, permission]
        }
      };

      return updated;
    });
  };

  const handleSave = () => {
    // TODO: Implement API call to save permissions
    console.log("Saving permissions:", permissions);
    toast.success("Permissões padrão atualizadas com sucesso!");
  };

  const hasPermission = (route: string, permission: string): boolean => {
    return permissions[selectedRole]?.[route]?.includes(permission) || false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões Padrão por Função</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Selecione a Função</Label>
          <RadioGroup
            value={selectedRole}
            onValueChange={(value: UserRole) => setSelectedRole(value)}
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

        <div className="space-y-6">
          <div className="grid gap-4">
            {Object.entries(ADMIN_DEFAULT_PERMISSIONS.leadly_employee).map(([route, perms]) => (
              <div key={route} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium capitalize">
                  {route.replace(/-/g, " ")}
                </span>
                <div className="flex items-center gap-4">
                  {Array.isArray(perms) && perms.map(permission => (
                    <div key={`${route}-${permission}`} className="flex items-center gap-2">
                      <Label htmlFor={`${route}-${permission}`} className="text-sm">
                        {permission}
                      </Label>
                      <CustomSwitch
                        id={`${route}-${permission}`}
                        checked={hasPermission(route, permission)}
                        onCheckedChange={() => handleTogglePermission(route, permission)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};

