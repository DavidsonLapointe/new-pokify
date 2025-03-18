
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "@/components/ui/link";
import { Badge } from "@/components/ui/badge";
import { Tool } from "./types";

interface ModuleCardProps {
  tool: Tool;
  isSelected: boolean;
  onShowDetails: (tool: Tool) => void;
  onCancelModule?: (id: string) => void;
}

export const ModuleCard = ({ tool, isSelected, onShowDetails, onCancelModule }: ModuleCardProps) => {
  const Icon = tool.icon;
  
  // Função para determinar o estilo do badge de status
  const getStatusBadgeStyle = (status: Tool["status"]) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-100 text-red-800 border-red-200";
      case "contracted": 
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "configured": 
        return "bg-green-100 text-green-800 border-green-200";
      case "coming_soon":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "setup":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Função para obter o texto do badge de status
  const getStatusText = (status: Tool["status"]) => {
    switch (status) {
      case "not_contracted": 
        return "Não contratado";
      case "contracted": 
        return "Pendente setup";
      case "configured": 
        return "Configurado";
      case "coming_soon":
        return "Em breve";
      case "setup":
        return "Em setup";
    }
  };

  // Formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const statusBadgeStyle = getStatusBadgeStyle(tool.status);
  const statusText = getStatusText(tool.status);
  
  return (
    <Card 
      className={`w-[200px] h-[180px] flex-shrink-0 mx-auto ${isSelected ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onShowDetails(tool)}
    >
      <CardContent className="p-3 flex flex-col items-center justify-between h-full relative">
        <div className="absolute top-2 right-2 flex items-center">
          {/* Badge de status em vez de ícone com tooltip */}
          <Badge 
            className={`text-xs px-2 py-0.5 font-medium rounded-full ${statusBadgeStyle}`}
          >
            {statusText}
          </Badge>
          
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
