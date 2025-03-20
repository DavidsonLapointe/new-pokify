
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface CustomerSuccessStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  onClick?: () => void;
  buttonLabel?: string;
  tooltip?: string;
  bottomText?: string;
}

export const CustomerSuccessStatCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  onClick,
  buttonLabel = "Ver empresas",
  tooltip,
  bottomText
}: CustomerSuccessStatCardProps) => {
  return (
    <Card className="p-4 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-md ${iconBgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px] text-sm">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
      
      {bottomText && (
        <p className="text-sm text-muted-foreground mt-2">{bottomText}</p>
      )}
      
      {onClick && (
        <Button 
          variant="link" 
          className="text-blue-500 p-0 h-auto mt-3 justify-start"
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      )}
    </Card>
  );
};
