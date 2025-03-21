
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  subtitle?: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  tooltip: string;
  actionButton?: React.ReactNode;
}

export const StatCard = ({
  title,
  subtitle,
  value,
  icon: Icon,
  color = "text-muted-foreground",
  tooltip,
  actionButton,
}: StatCardProps) => (
  <Card className="p-4">
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/60">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold min-w-[2rem] text-center">{value}</h3>
      </div>
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  </Card>
);
