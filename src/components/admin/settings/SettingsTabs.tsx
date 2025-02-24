
import { Label } from "@/components/ui/label";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { settingsTabs } from "./constants";

interface SettingsTabsProps {
  hasAccess: (route: string) => boolean;
  onTogglePermission: (route: string) => void;
}

export const SettingsTabs = ({ hasAccess, onTogglePermission }: SettingsTabsProps) => {
  return (
    <div className="ml-8 space-y-2">
      <Label className="text-sm text-muted-foreground">Abas de Configurações:</Label>
      <div className="grid gap-2">
        {settingsTabs.map(tab => (
          <div key={tab.id} className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </div>
            <CustomSwitch
              checked={hasAccess(`settings-${tab.id}`)}
              onCheckedChange={() => onTogglePermission(`settings-${tab.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
