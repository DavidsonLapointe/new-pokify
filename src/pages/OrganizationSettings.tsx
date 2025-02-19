
import { OrganizationLayout } from "@/components/OrganizationLayout";
import { FunnelSection } from "@/components/settings/FunnelSection";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { CustomFieldDialog } from "@/components/settings/CustomFieldDialog";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { useState } from "react";
import { useFunnelManagement } from "@/hooks/settings/useFunnelManagement";
import { useCustomFieldsManagement } from "@/hooks/settings/useCustomFieldsManagement";

const mockCurrentOrganization = {
  id: 1,
  name: "Tech Solutions",
  nomeFantasia: "Tech Solutions Ltda",
  plan: "Enterprise",
  users: [] as any[],
  status: "active" as const,
  integratedCRM: null,
  integratedLLM: "GPT-4",
  email: "contact@techsolutions.com",
  phone: "(11) 1234-5678",
  cnpj: "12.345.678/0001-00",
  adminName: "João Silva",
  adminEmail: "joao@techsolutions.com",
  createdAt: "2024-01-01T00:00:00.000Z",
};

const OrganizationSettings = () => {
  const [isFieldsDialogOpen, setIsFieldsDialogOpen] = useState(false);

  const {
    funnelName,
    stageName,
    isDefaultConfigSaved,
    isEditing,
    setFunnelName,
    setStageName,
    handleSaveDefaultConfig,
    handleToggleEdit,
  } = useFunnelManagement();

  const {
    customFields,
    newField,
    isEditingField,
    setNewField,
    handleOpenNewField,
    handleOpenEditField,
    handleSaveFieldsSettings,
  } = useCustomFieldsManagement();

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <SettingsHeader organization={mockCurrentOrganization} />

        <FunnelSection
          funnelName={funnelName}
          stageName={stageName}
          setFunnelName={setFunnelName}
          setStageName={setStageName}
          isDefaultConfigSaved={isDefaultConfigSaved}
          isEditing={isEditing}
          onSaveDefaultConfig={handleSaveDefaultConfig}
          onToggleEdit={handleToggleEdit}
        />

        <CustomFieldsSection
          customFields={customFields}
          handleOpenNewField={() => {
            handleOpenNewField();
            setIsFieldsDialogOpen(true);
          }}
          handleOpenEditField={(field) => {
            handleOpenEditField(field);
            setIsFieldsDialogOpen(true);
          }}
        />

        <CustomFieldDialog
          isOpen={isFieldsDialogOpen}
          onOpenChange={setIsFieldsDialogOpen}
          isEditing={isEditingField}
          newField={newField}
          setNewField={setNewField}
          handleSaveFieldsSettings={handleSaveFieldsSettings}
        />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
