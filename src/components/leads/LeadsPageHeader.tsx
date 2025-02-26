
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { IntegrationAlertDialog } from "@/components/calls/IntegrationAlertDialog";
import { Organization, User } from "@/types";

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

  const hasIntegrationsAccess = Boolean(currentUser.permissions['integrations']);

  const integrationUsers = organization.users.filter(user => 
    user.role === "admin" || 
    (Boolean(user.permissions['integrations']) && user.status === "active")
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold">Análise de Leads</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os seus leads.
          </p>
        </div>

        <div className="flex gap-2">
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
