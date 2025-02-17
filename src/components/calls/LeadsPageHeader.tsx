
import { Button } from "@/components/ui/button";
import { CallsHeader } from "@/components/calls/CallsHeader";
import { Link2, Upload, UserPlus } from "lucide-react";
import { useState } from "react";
import { IntegrationAlertDialog } from "@/components/calls/IntegrationAlertDialog";
import { Organization, User } from "@/types/organization";

interface LeadsPageHeaderProps {
  onUploadClick: () => void;
  onNewLeadClick: () => void;
  currentUser: User;
  organization: Organization;
}

export const LeadsPageHeader = ({ 
  onUploadClick, 
  onNewLeadClick,
  currentUser,
  organization,
}: LeadsPageHeaderProps) => {
  const [showIntegrationAlert, setShowIntegrationAlert] = useState(false);

  const checkIntegrations = () => {
    const missingIntegrations = {
      crm: !organization.integratedCRM,
      llm: !organization.integratedLLM,
    };

    if (missingIntegrations.crm || missingIntegrations.llm) {
      setShowIntegrationAlert(true);
      return false;
    }

    return true;
  };

  const handleNewLeadClick = () => {
    if (checkIntegrations()) {
      onNewLeadClick();
    }
  };

  const hasIntegrationsAccess = currentUser.permissions?.integrations?.includes("edit") || false;

  const integrationUsers = organization.users.filter(user => 
    user.role === "admin" || 
    (user.permissions?.integrations?.includes("edit") && user.status === "active")
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-6 w-6 text-muted-foreground" />
          <CallsHeader 
            title="Análise de Leads"
            description="Visualize e gerencie todos os leads e suas chamadas"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onUploadClick}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>

          <Button onClick={handleNewLeadClick}>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      <IntegrationAlertDialog
        isOpen={showIntegrationAlert}
        onOpenChange={setShowIntegrationAlert}
        hasIntegrationsAccess={hasIntegrationsAccess}
        integrationUsers={integrationUsers}
        missingIntegrations={{
          crm: !organization.integratedCRM,
          llm: !organization.integratedLLM,
        }}
      />
    </>
  );
};
