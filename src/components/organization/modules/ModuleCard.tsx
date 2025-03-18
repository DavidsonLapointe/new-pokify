
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Clock, MoreVertical, Trash2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "@/components/ui/link";
import { Tool } from "./types";

interface ModuleCardProps {
  tool: Tool;
  isSelected: boolean;
  onShowDetails: (tool: Tool) => void;
  onCancelModule?: (id: string) => void;
}

export const ModuleCard = ({ tool, isSelected, onShowDetails, onCancelModule }: ModuleCardProps) => {
  const Icon = tool.icon;
  
  // Função para determinar o ícone e tooltip de status
  const getStatusInfo = (status: Tool["status"]) => {
    switch (status) {
      case "not_contracted": 
        return { 
          icon: <Lock size={18} className="text-red-500" />,
          tooltip: "Módulo não contratado"
        };
      case "contracted": 
        return { 
          icon: <AlertTriangle size={18} className="text-yellow-500" />,
          tooltip: "Módulo contratado, mas ainda não configurado"
        };
      case "configured": 
        return { 
          icon: <CheckCircle2 size={18} className="text-green-500" />,
          tooltip: "Módulo contratado e configurado"
        };
      case "coming_soon":
        return { 
          icon: <Clock size={18} className="text-gray-500" />,
          tooltip: "Em breve disponível"
        };
      case "setup":
        return {
          icon: <RefreshCw size={18} className="text-blue-500" />,
          tooltip: "Módulo em processo de setup"
        };
    }
  };

  // Formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const statusInfo = getStatusInfo(tool.status);
  
  return (
    <Card 
      className={`w-[200px] h-[180px] flex-shrink-0 mx-auto ${isSelected ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onShowDetails(tool)}
    >
      <CardContent className="p-3 flex flex-col items-center justify-between h-full relative">
        <div className="absolute top-2 right-2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{statusInfo.icon}</span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{statusInfo.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {(tool.status === "contracted" || tool.status === "configured") && onCancelModule && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 rounded-full p-0">
                  <MoreVertical size={16} className="text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-white">
                <DropdownMenuItem 
                  className="text-red-600 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelModule(tool.id);
                  }}
                >
                  <Trash2 size={14} />
                  <span>Cancelar módulo</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex flex-col items-center mt-4">
          <div className={`p-1 rounded-md ${isSelected ? 'text-[#9b87f5]' : 'text-gray-400'}`}>
            {Icon && <Icon size={28} />}
          </div>
          
          <div className="text-center w-full mt-2">
            <p className="font-medium text-xs mb-1">{tool.title}</p>
            <div className="flex flex-col items-center">
              <p className="text-xs text-[#6E59A5] font-bold">
                {formatPrice(tool.price)}<span className="text-xs text-gray-500">/setup</span>
              </p>
              
              {tool.credits && (
                <p className="text-xs text-amber-700 flex items-center mt-1">
                  <Zap size={10} className="mr-1 text-amber-500" />
                  {tool.credits} créditos por execução
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-auto w-full pb-1">
          <Link 
            href="#" 
            className="text-xs text-[#9b87f5] hover:text-[#8a76e5] hover:underline flex items-center justify-center w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShowDetails(tool);
            }}
          >
            Ver Detalhes
            {isSelected ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

// Importe os ícones que estavam faltando
import { AlertTriangle, CheckCircle2, Lock, RefreshCw } from "lucide-react";
