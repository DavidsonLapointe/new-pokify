
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/components/organization/modules/types";
import { CheckCircle2, HelpCircle, PlayCircle } from "lucide-react";
import { AIToolDetailsBenefits } from "./AIToolDetailsBenefits";
import { AIToolDetailsHowItWorks } from "./AIToolDetailsHowItWorks";

interface AIToolDetailsProps {
  tool: Tool;
  onExecute: () => void;
}

export const AIToolDetails: React.FC<AIToolDetailsProps> = ({ tool, onExecute }) => {
  const getBadgeClass = (status: Tool["status"]) => {
    switch (status) {
      case "not_contracted": 
        return "bg-red-100 text-red-700";
      case "contracted": 
        return "bg-yellow-100 text-yellow-700";
      case "configured": 
        return "bg-green-100 text-green-700";
      case "coming_soon":
        return "bg-gray-100 text-gray-700";
      case "setup":
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <Card key={`details-${tool.id}`} className="p-5 bg-[#F8F8FB]">
      <div className="flex items-center gap-2 mb-4">
        {React.createElement(tool.icon, { className: "text-[#9b87f5]", size: 24 })}
        <h2 className="text-xl font-semibold">{tool.title}</h2>
        <Badge variant="outline" className={getBadgeClass(tool.status)}>
          {tool.badgeLabel}
        </Badge>
      </div>
      
      <p className="text-gray-600 mb-3 text-sm text-left">
        {tool.detailedDescription}
      </p>
      
      {/* Informação de custo de execução - mostrar somente créditos */}
      <div className="mb-4 flex items-center text-sm font-medium">
        <span className="mr-2 text-[#9b87f5]">Custo de execução:</span>
        <span className="text-gray-700">{tool.credits} créditos</span>
      </div>

      {/* Seções "Benefícios" e "Como Funciona" com a ordem invertida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AIToolDetailsBenefits benefits={tool.benefits} />
        <AIToolDetailsHowItWorks steps={tool.howItWorks} />
      </div>

      <div className="flex gap-3">
        <Button 
          className="flex items-center justify-center gap-2 bg-[#9b87f5] hover:bg-[#8a76e5] px-4"
          onClick={onExecute}
        >
          {React.createElement(tool.executeIcon || PlayCircle, { size: 18 })}
          <span>{tool.executeLabel || "Executar"}</span>
        </Button>
      </div>
    </Card>
  );
};
