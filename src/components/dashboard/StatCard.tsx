
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
}

export const StatCard = ({
  title,
  subtitle,
  value,
  icon: Icon,
  color = "text-muted-foreground",
  tooltip,
}: StatCardProps) => (
  <Card className="p-4">
    <div className="space-y-2">
      <div className="flex flex-col items-center">
        <div className="mb-2">
          <p className="text-sm text-muted-foreground text-center">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/60 text-center">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center justify-center mb-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <h3 className="text-2xl font-semibold">{value}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full ml-2">
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </Card>
);
