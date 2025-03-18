
import React from "react";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { iconMap } from "./module-constants";
import { 
  MessageCircle, Clock, Pencil, CheckCircle, Zap, Settings, Plus
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModuleDetailsProps { 
  module: Plan | null, 
  onEdit: (module: Plan) => void, 
  onDelete: (id: string | number) => void,
  isDeleting: boolean
}

export const ModuleDetails: React.FC<ModuleDetailsProps> = ({ 
  module, 
  onEdit, 
  onDelete,
  isDeleting 
}) => {
  if (!module) return null;
  
  const IconComponent = module.icon && iconMap[module.icon as keyof typeof iconMap] 
    ? iconMap[module.icon as keyof typeof iconMap] 
    : MessageCircle;
    
  return (
    <Card className="mt-8 bg-[#F1F0FB] flex flex-col min-h-[600px]">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-lighter rounded-md">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl">{module.name}</CardTitle>
                {module.comingSoon && (
                  <TooltipProvider>
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
                  </TooltipProvider>
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
              <div className="flex items-center gap-2">
                <div className="text-lg text-primary font-semibold">
                  R$ {module.price.toFixed(2)}<span className="text-sm text-muted-foreground font-normal"> (valor único de setup)</span>
                </div>
                {module.credits && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Zap className="h-3 w-3" />
                          <span className="font-medium">{module.credits} créditos</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Créditos consumidos por execução</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(module)}>
              <Pencil className="h-4 w-4 mr-1" /> Editar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0 flex-1 flex flex-col">
        {/* Sobre o módulo ocupa quase toda a largura */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Sobre o módulo</h3>
          <p className="text-muted-foreground text-left">{module.description}</p>
          
          {/* Adicionando a informação de créditos de forma mais clara */}
          {module.credits && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <p className="text-amber-800">
                  <span className="font-semibold">Consumo de créditos:</span> Este módulo consome <span className="font-semibold">{module.credits} créditos</span> por cada execução
                </p>
              </div>
            </div>
          )}
        </div>
          
        {/* Benefícios e Como funciona lado a lado em containers brancos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Benefícios</h3>
            <div className="space-y-2">
              {module.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-left">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
            
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Como funciona</h3>
            <div className="space-y-2">
              {module.howItWorks?.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="bg-primary-lighter text-primary font-semibold rounded-full h-6 w-6 flex items-center justify-center text-sm mt-0.5">
                    {i+1}
                  </div>
                  <p className="text-left">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de ação em uma área de rodapé fixa com padding e margem claros */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            {/* Sempre mostre os botões de ação com base no status */}
            {(module.status === "configured" || (!module.status && module.active)) && (
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Pencil className="h-4 w-4 mr-2" /> Editar configuração
              </Button>
            )}
            
            {(module.status === "contracted" || (!module.status && !module.active)) && (
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Settings className="h-4 w-4 mr-2" /> Configurar
              </Button>
            )}

            {((!module.status && !module.active) || module.status === "not_contracted") && (
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4 mr-2" /> Contratar módulo
              </Button>
            )}
            
            {(module.status === "coming_soon" || module.comingSoon) && (
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" disabled>
                <Clock className="h-4 w-4 mr-2" /> Em breve disponível
              </Button>
            )}
            
            {module.status === "setup" && (
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" disabled>
                <Clock className="h-4 w-4 mr-2" /> Aguardando setup
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
