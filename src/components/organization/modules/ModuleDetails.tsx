
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tool } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Clock, CreditCard, Pencil, Settings, Zap } from "lucide-react";

interface ModuleDetailsProps {
  selectedTool: Tool;
  onContractModule: (id: string) => void;
  onConfigureModule: (id: string) => void;
  onEditConfiguration: (id: string) => void;
}

export const ModuleDetails: React.FC<ModuleDetailsProps> = ({
  selectedTool,
  onContractModule,
  onConfigureModule,
  onEditConfiguration
}) => {
  // Função para obter a classe do badge com base no status
  const getBadgeClass = (status: Tool["status"]) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-100 text-red-800";
      case "contracted": 
        return "bg-yellow-100 text-yellow-800";
      case "configured": 
        return "bg-green-100 text-green-800";
      case "coming_soon":
        return "bg-gray-100 text-gray-800";
      case "setup":
        return "bg-blue-100 text-blue-800";
    }
  };

  // Formatação de preço em formato brasileiro
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const Icon = selectedTool.icon;

  return (
    <Card className="p-5 bg-[#F8F8FB] max-w-4xl mx-auto relative">
      {/* Botões de ação movidos para o canto superior direito */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {selectedTool.status === "not_contracted" && (
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 h-9"
            onClick={() => onContractModule(selectedTool.id)}
          >
            <CreditCard className="h-4 w-4 mr-2" /> Contratar
          </Button>
        )}
        
        {selectedTool.status === "configured" && (
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 h-9"
            onClick={() => onEditConfiguration(selectedTool.id)}
          >
            <Pencil className="h-4 w-4 mr-2" /> Editar configuração
          </Button>
        )}
        
        {selectedTool.status === "contracted" && (
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-3 h-9"
            onClick={() => onConfigureModule(selectedTool.id)}
          >
            <Settings className="h-4 w-4 mr-2" /> Configurar módulo
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 text-[#9b87f5]">
          {React.createElement(Icon, { size: 24 })}
        </div>
        <h3 className="text-xl font-semibold">{selectedTool.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClass(selectedTool.status)}`}>
          {selectedTool.badgeLabel}
        </span>

        {selectedTool.status === "contracted" && (
          <span className="text-yellow-600 text-xs font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" /> Necessita configuração
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-6 text-sm text-left">{selectedTool.detailedDescription}</p>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary-lighter text-primary px-3 py-1 rounded-md">
          <span className="text-sm font-semibold">{formatPrice(selectedTool.price)}</span>
          <span className="text-xs"> (valor de setup)</span>
        </div>
        
        {selectedTool.credits && (
          <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md flex items-center gap-1">
            <Zap size={14} />
            <span className="text-sm font-semibold">{selectedTool.credits} créditos</span>
            <span className="text-xs"> por execução</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-100 h-full">
          <h4 className="text-[#9b87f5] font-medium mb-3 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Benefícios
          </h4>
          <ul className="space-y-2">
            {selectedTool.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start text-sm text-left">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-left">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100 h-full">
          <h4 className="text-[#9b87f5] font-medium mb-3 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Como Funciona
          </h4>
          <ul className="space-y-2">
            {selectedTool.howItWorks.map((step, idx) => (
              <li key={idx} className="flex items-start text-sm text-left">
                {selectedTool.icon && React.createElement(selectedTool.icon, { 
                  className: "h-4 w-4 text-[#9b87f5] mr-2 mt-0.5 flex-shrink-0" 
                })}
                <span className="text-left">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

// Adicione os ícones que faltavam
import { AlertTriangle } from "lucide-react";
