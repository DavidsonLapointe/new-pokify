
import React from "react";

interface ModulesPageHeaderProps {
  title: string;
  description: string;
}

export const ModulesPageHeader: React.FC<ModulesPageHeaderProps> = ({ 
  title, 
  description 
}) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
