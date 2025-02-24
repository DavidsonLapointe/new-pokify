
import { Label } from "@/components/ui/label";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { dashboardTabs } from "./constants";

interface DashboardTabsProps {
  hasAccess: (route: string) => boolean;
  onTogglePermission: (route: string) => void;
}

export const DashboardTabs = ({ hasAccess, onTogglePermission }: DashboardTabsProps) => {
  return (
    <div className="ml-8 space-y-2">
      <Label className="text-sm text-muted-foreground">Abas do Dashboard:</Label>
      <div className="grid gap-2">
        {dashboardTabs.map(tab => (
          <div key={tab.id} className="flex items-center justify-between p-2 border rounded-lg">
            <span className="text-sm">{tab.label}</span>
            <CustomSwitch
              checked={hasAccess(`dashboard-${tab.id}`)}
              onCheckedChange={() => onTogglePermission(`dashboard-${tab.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
