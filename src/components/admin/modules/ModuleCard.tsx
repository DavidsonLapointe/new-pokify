
import React from "react";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { iconMap } from "./module-constants";
import { MessageCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModuleCardProps {
  module: Plan;
  onClick: () => void;
  isActive: boolean;
  onEditModule: (module: Plan) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onClick,
  isActive,
  onEditModule
}) => {
  // Get the appropriate icon component
  const IconComponent = module.icon && iconMap[module.icon as keyof typeof iconMap] 
    ? iconMap[module.icon as keyof typeof iconMap] 
    : MessageCircle; // Default to MessageCircle if not found

  return (
    <TooltipProvider>
      <Card 
        className={`h-[230px] cursor-pointer hover:shadow-md transition-all duration-300 ${isActive ? 'bg-[#F1F0FB]' : ''}`}
        onClick={onClick}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-primary-lighter rounded-md">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex items-center gap-1">
              {module.comingSoon && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Em breve disponível</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Badge 
                variant="secondary"
                className={`
                  ${module.active 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100"}
                `}
              >
                {module.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-base font-semibold mt-2 line-clamp-1">
            {module.name}
          </CardTitle>
          <div className="text-primary font-semibold">
            R$ {module.price.toFixed(2)}<span className="text-sm text-muted-foreground font-normal">/mês</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {module.shortDescription}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div 
            className="w-full text-xs text-primary flex items-center justify-center cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onClick(); // Use the onClick prop to select this module
            }}
          >
            Ver Detalhes {isActive ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};
