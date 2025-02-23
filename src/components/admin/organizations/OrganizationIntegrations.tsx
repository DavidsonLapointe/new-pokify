
import React from "react";
import { Organization } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OrganizationIntegrationsProps {
  organization: Organization;
}

export const OrganizationIntegrations: React.FC<OrganizationIntegrationsProps> = ({
  organization,
}) => {
  const totalIntegrations = 2;
  const completedIntegrations = [organization.integratedCRM, organization.integratedLLM].filter(Boolean).length;
  
  const tooltipText = () => {
    const crmStatus = organization.integratedCRM 
      ? `CRM: ${organization.integratedCRM}` 
      : "CRM: Pendente";
    
    const llmStatus = organization.integratedLLM 
      ? `LLM: ${organization.integratedLLM}` 
      : "LLM: Pendente";

    return `${crmStatus}\n${llmStatus}`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant={completedIntegrations === totalIntegrations ? "secondary" : "default"}
          className="cursor-help"
        >
          {completedIntegrations}/{totalIntegrations}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm whitespace-pre-line">
          {tooltipText().split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
