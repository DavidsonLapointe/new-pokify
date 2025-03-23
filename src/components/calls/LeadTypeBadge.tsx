
import { Badge } from "@/components/ui/badge";
import { leadTypeConfig, LeadType } from "./utils";
import * as LucideIcons from "lucide-react";

interface LeadTypeBadgeProps {
  leadType: LeadType | undefined;
  showLabel?: boolean;
  className?: string;
}

export const LeadTypeBadge = ({ leadType, showLabel = true, className = "" }: LeadTypeBadgeProps) => {
  if (!leadType || !leadTypeConfig[leadType]) {
    return null;
  }

  const config = leadTypeConfig[leadType];
  const IconComponent = LucideIcons[config.icon as keyof typeof LucideIcons] as React.FC<any>;

  return (
    <Badge variant="secondary" className={`${config.color} ${className}`}>
      {IconComponent && <IconComponent className="h-3.5 w-3.5 mr-1" />}
      {showLabel && config.label}
    </Badge>
  );
};
