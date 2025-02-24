
import { Label } from "@/components/ui/label";
import { RoutePermission } from "@/types/permissions";

interface PermissionRowProps {
  route: RoutePermission;
  isRouteEnabled: boolean;
  isProfile: boolean;
  onPermissionChange: (routeId: string) => void;
}

export const PermissionRow = ({
  route,
  isRouteEnabled,
  isProfile,
  onPermissionChange,
}: PermissionRowProps) => {
  console.log(`Rendering PermissionRow for ${route.id}:`, {
    isRouteEnabled,
    isProfile
  });

  // Verifica se é uma rota padrão (profile ou company)
  const isDefaultRoute = route.id === 'profile' || route.id === 'company';

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={route.id}
          checked={isRouteEnabled}
          onChange={() => !route.isDefault && onPermissionChange(route.id)}
          disabled={route.isDefault}
          className={`h-4 w-4 rounded border appearance-none ${
            isDefaultRoute
              ? 'bg-gray-100 border-gray-200 checked:bg-gray-300 checked:border-gray-300 cursor-not-allowed checked:bg-check'
              : 'border-primary checked:bg-primary hover:border-primary/80 checked:bg-check'
          }`}
        />
        <Label htmlFor={route.id} className="font-medium text-lg">
          {route.label}
        </Label>
      </div>
    </div>
  );
};
