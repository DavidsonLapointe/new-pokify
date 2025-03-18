
import React from "react";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clock, CheckCircle, Zap } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { iconMap } from "@/components/admin/modules/module-constants";

interface ModuleDetailsViewProps {
  selectedModule: Plan;
  onEditModule: (module: Plan) => void;
  onDeleteModule: (id: string | number) => void;
  deletingModuleId: string | number | null;
}

export const ModuleDetailsView: React.FC<ModuleDetailsViewProps> = ({
  selectedModule,
  onEditModule,
  onDeleteModule,
  deletingModuleId
}) => {
  if (!selectedModule) return null;

  return (
    <Card className="mt-8 bg-[#F8F8FB] flex flex-col max-w-5xl mx-auto shadow-sm">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-lighter rounded-md">
              {selectedModule.icon && iconMap[selectedModule.icon as keyof typeof iconMap] 
                ? React.createElement(iconMap[selectedModule.icon as keyof typeof iconMap], { className: "h-8 w-8 text-primary" })
                : <div className="h-8 w-8 text-primary" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl">{selectedModule.name}</CardTitle>
                {selectedModule.comingSoon && (
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
                    ${selectedModule.active 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-red-100 text-red-800 hover:bg-red-100"}
                  `}
                >
                  {selectedModule.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-lg text-primary font-semibold">
                  R$ {selectedModule.price.toFixed(2)}<span className="text-sm text-muted-foreground font-normal"> (valor único de setup)</span>
                </div>
                {selectedModule.credits && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Zap className="h-3 w-3" />
                          <span className="font-medium">{selectedModule.credits} créditos</span>
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
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs px-3"
              onClick={() => onEditModule(selectedModule)}
            >
              <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs px-3 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onDeleteModule(selectedModule.id)}
              disabled={deletingModuleId === selectedModule.id}
            >
              {deletingModuleId === selectedModule.id ? (
                <>
                  <span className="animate-spin mr-1">
                    ●
                  </span>
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pt-0 pb-6 flex-1 flex flex-col">
        {/* Sobre o módulo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-purple-500">Sobre o módulo</h3>
          <p className="text-muted-foreground text-left">{selectedModule.description}</p>
          
          {/* Informação de créditos */}
          {selectedModule.credits && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <p className="text-amber-800">
                  <span className="font-semibold">Consumo de créditos:</span> Este módulo consome <span className="font-semibold">{selectedModule.credits} créditos</span> por cada execução
                </p>
              </div>
            </div>
          )}
        </div>
          
        {/* Benefícios e Como funciona */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-purple-500">Benefícios</h3>
            <div className="space-y-2">
              {selectedModule.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-left">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
            
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-purple-500">Como funciona</h3>
            <div className="space-y-2">
              {selectedModule.howItWorks?.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="bg-purple-100 text-purple-600 font-semibold rounded-full h-6 w-6 flex items-center justify-center text-sm mt-0.5 flex-shrink-0">
                    {i+1}
                  </div>
                  <p className="text-left">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
