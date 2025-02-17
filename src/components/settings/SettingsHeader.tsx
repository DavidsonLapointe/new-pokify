
import { AlertCircle, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Organization } from "@/types/organization";

interface SettingsHeaderProps {
  organization: Organization;
}

export const SettingsHeader = ({ organization }: SettingsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure os campos que serão extraídos automaticamente das chamadas
        </p>
      </div>
      
      {organization.integratedCRM ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Check className="h-5 w-5" />
          <span className="text-sm font-medium">
            Integrado com {organization.integratedCRM}
          </span>
        </div>
      ) : (
        <Button
          variant="outline"
          className="flex items-center gap-2 text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-700"
          onClick={() => navigate("/organization/integrations")}
        >
          <AlertCircle className="h-4 w-4" />
          <span>Integração com CRM Pendente</span>
          <ExternalLink className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
};
