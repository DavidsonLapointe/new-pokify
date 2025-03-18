
import React from "react";
import { CheckCircle2 } from "lucide-react";

interface AIToolDetailsBenefitsProps {
  benefits: string[];
}

export const AIToolDetailsBenefits: React.FC<AIToolDetailsBenefitsProps> = ({ benefits }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm h-full">
      <h3 className="text-[#9b87f5] font-medium mb-3 flex items-center">
        <CheckCircle2 size={18} className="mr-2" />
        Benefícios
      </h3>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start text-sm text-left">
            <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-left">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
