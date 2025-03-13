
import { Button } from "@/components/ui/button";
import { CallsHeader } from "@/components/calls/CallsHeader";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { IntegrationAlertDialog } from "@/components/calls/IntegrationAlertDialog";
import { Organization } from "@/types/organization-types";
import { UserType } from "@/types";

interface LeadsPageHeaderProps {
  onUploadClick: () => void;
  onNewLeadClick: () => void;
  currentUser: UserType;
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

  // Verifica se o usuário tem acesso às integrações
  const hasIntegrationsAccess = Boolean(currentUser.permissions && currentUser.permissions['integrations']);

  // Convert organization.users to the User type properly, mapping the logs field
  const integrationUsers = (organization.users || [])
    .filter(user => 
      user.role === "admin" || 
      (user.permissions && Boolean(user.permissions['integrations']) && user.status === "active")
    );

  return (
    <>
      <div className="flex items-center justify-between">
        <CallsHeader 
          title="Leads"
          description="Visualize e gerencie todos os seus leads."
        />

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
