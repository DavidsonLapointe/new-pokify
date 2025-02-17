
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
  value: number;
  icon: LucideIcon;
  color?: string;
  tooltip: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-muted-foreground",
  tooltip,
}: StatCardProps) => (
  <Card className="p-4">
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-xl font-semibold">{value}</h3>
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
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        </div>
      </div>
    </div>
  </Card>
);
