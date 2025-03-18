
import React from "react";
import { PlayCircle, HelpCircle } from "lucide-react";

interface AIToolDetailsHowItWorksProps {
  steps: string[];
}

export const AIToolDetailsHowItWorks: React.FC<AIToolDetailsHowItWorksProps> = ({ steps }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm h-full">
      <h3 className="text-[#9b87f5] font-medium mb-3 flex items-center">
        <HelpCircle size={18} className="mr-2" />
        Como Funciona
      </h3>
      <ul className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start text-sm text-left">
            <PlayCircle size={16} className="text-[#9b87f5] mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-left">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
