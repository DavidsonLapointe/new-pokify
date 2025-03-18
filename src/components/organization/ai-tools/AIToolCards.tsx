
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tool } from "@/components/organization/modules/types";
import { AIToolCardStatus } from "./AIToolCardStatus";

interface AIToolCardsProps {
  configuredTools: Tool[];
  selectedTool: string;
  setSelectedTool: (id: string) => void;
}

export const AIToolCards: React.FC<AIToolCardsProps> = ({ 
  configuredTools, 
  selectedTool, 
  setSelectedTool 
}) => {
  return (
    <div>
      <div className="relative">
        <div className="flex items-center space-x-4 overflow-x-auto py-4 px-1">
          <button 
            className="absolute left-0 z-10 bg-white/80 rounded-full p-1 shadow-md"
            aria-label="Deslizar para esquerda"
          >
            <ChevronLeft size={20} />
          </button>
          
          {configuredTools.map((tool) => (
            <Card 
              key={tool.id}
              className={`w-[180px] h-[120px] flex-shrink-0 cursor-pointer transition-all ${
                selectedTool === tool.id ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'bg-white'
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center h-full space-y-2 relative">
                <AIToolCardStatus status={tool.status} />
                <div className={`p-2 rounded-md ${selectedTool === tool.id ? 'text-[#9b87f5]' : 'text-gray-400'}`}>
                  {React.createElement(tool.icon, { size: 28 })}
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{tool.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <button 
            className="absolute right-0 z-10 bg-white/80 rounded-full p-1 shadow-md"
            aria-label="Deslizar para direita"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
