
import { Badge } from "@/components/ui/badge";
import { Flame, HelpCircle } from "lucide-react";
import { LeadCalls } from "./types";
import { getLastCallTemperature, temperatureConfig } from "./utils";

interface LeadTemperatureBadgeProps {
  calls: LeadCalls['calls'];
  hasProcessed: boolean;
}

export const LeadTemperatureBadge = ({ calls, hasProcessed }: LeadTemperatureBadgeProps) => {
  const temperature = getLastCallTemperature(calls);
  const tempConfig = temperature ? temperatureConfig[temperature] : null;

  if (!hasProcessed) {
    return (
      <Badge
        variant="secondary"
        className="flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 bg-gray-100 text-gray-800"
      >
        <HelpCircle className="w-3 h-3 mr-1" />
        Sem classificação
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${tempConfig?.color}`}
    >
      <Flame className="w-3 h-3 mr-1" />
      {tempConfig?.label}
    </Badge>
  );
};
