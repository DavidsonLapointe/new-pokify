
import React from "react";
import { ToolStatus } from "@/components/organization/modules/types";
import { Lock, AlertTriangle, CheckCircle2, Clock, RotateCw } from "lucide-react";

interface AIToolCardStatusProps {
  status: ToolStatus;
}

export const AIToolCardStatus: React.FC<AIToolCardStatusProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "not_contracted": 
        return <Lock size={16} className="text-red-500" />;
      case "contracted": 
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case "configured": 
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "coming_soon":
        return <Clock size={16} className="text-gray-500" />;
      case "setup":
        return <RotateCw size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="absolute top-2 right-2">
      {getStatusIcon()}
    </div>
  );
};
