
import React from "react";
import { ToolStatus } from "@/components/organization/modules/types";
import { Lock, AlertTriangle, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIToolCardStatusProps {
  status: ToolStatus;
}

export const AIToolCardStatus: React.FC<AIToolCardStatusProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "not_contracted": 
        return { 
          icon: <Lock size={16} className="text-red-500" />,
          label: "Não contratada"
        };
      case "contracted": 
        return { 
          icon: <AlertTriangle size={16} className="text-yellow-500" />,
          label: "Pendente de configuração"
        };
      case "configured": 
        return { 
          icon: <CheckCircle2 size={16} className="text-green-500" />,
          label: "Configurada e pronta para uso"
        };
      case "coming_soon":
        return { 
          icon: <Clock size={16} className="text-gray-500" />,
          label: "Em breve disponível"
        };
      case "setup":
        return { 
          icon: <RefreshCw size={16} className="text-blue-500 animate-spin" />,
          label: "Nossa equipe está configurando esta ferramenta para sua organização"
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute top-2 right-2">
            {statusInfo.icon}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="bg-white p-2 text-xs max-w-[200px] text-center">
          {statusInfo.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
