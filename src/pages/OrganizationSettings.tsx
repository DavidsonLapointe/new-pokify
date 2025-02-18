
import OrganizationLayout from "@/components/OrganizationLayout";
import { useState, useCallback } from "react";
import { FunnelSection } from "@/components/settings/FunnelSection";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { NewFunnelDialog } from "@/components/settings/NewFunnelDialog";
import { NewStageDialog } from "@/components/settings/NewStageDialog";
import { CustomFieldDialog } from "@/components/settings/CustomFieldDialog";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { NoFunnelAlert } from "@/components/settings/NoFunnelAlert";
import { useFunnelManagement } from "@/hooks/settings/useFunnelManagement";
import { useCustomFieldsManagement } from "@/hooks/settings/useCustomFieldsManagement";
import { Dialog } from "@/components/ui/dialog";

const mockFunnels = [];

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
  const [isFunnelDialogOpen, setIsFunnelDialogOpen] = useState(false);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [isFieldsDialogOpen, setIsFieldsDialogOpen] = useState(false);
  const [isNoFunnelAlertOpen, setIsNoFunnelAlertOpen] = useState(false);

  const {
    funnels,
    selectedFunnel,
    selectedStage,
    newFunnel,
    newStage,
    newStageFunnelId,
    isDefaultConfigSaved,
    isEditing,
    setSelectedFunnel,
    setSelectedStage,
    setNewFunnel,
    setNewStage,
    setNewStageFunnelId,
    handleSaveFunnel,
    handleSaveStage,
    handleSaveDefaultConfig,
    handleToggleEdit,
  } = useFunnelManagement(mockFunnels);

  const {
    customFields,
    newField,
    isEditingField,
    setNewField,
    handleOpenNewField,
    handleOpenEditField,
    handleSaveFieldsSettings,
  } = useCustomFieldsManagement();

  const handleNewStageClick = () => {
    if (funnels.length === 0) {
      setIsNoFunnelAlertOpen(true);
    } else {
      setIsStageDialogOpen(true);
    }
  };

  const handleCreateFunnelFromAlert = useCallback(() => {
    setIsNoFunnelAlertOpen(false);
    requestAnimationFrame(() => {
      setIsFunnelDialogOpen(true);
    });
  }, []);

  const handleFunnelDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setNewFunnel("");
      setIsFunnelDialogOpen(false);
    } else {
      setIsFunnelDialogOpen(true);
    }
  }, [setNewFunnel]);

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <SettingsHeader organization={mockCurrentOrganization} />

        <FunnelSection
          funnels={funnels}
          selectedFunnel={selectedFunnel}
          selectedStage={selectedStage}
          setSelectedFunnel={setSelectedFunnel}
          setSelectedStage={setSelectedStage}
          setIsFunnelDialogOpen={setIsFunnelDialogOpen}
          setIsStageDialogOpen={handleNewStageClick}
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

        <Dialog open={isFunnelDialogOpen} onOpenChange={handleFunnelDialogClose}>
          <NewFunnelDialog
            isOpen={isFunnelDialogOpen}
            onOpenChange={handleFunnelDialogClose}
            newFunnel={newFunnel}
            setNewFunnel={setNewFunnel}
            handleSaveFunnel={handleSaveFunnel}
          />
        </Dialog>

        <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
          <NewStageDialog
            isOpen={isStageDialogOpen}
            onOpenChange={setIsStageDialogOpen}
            newStage={newStage}
            setNewStage={setNewStage}
            newStageFunnelId={newStageFunnelId}
            setNewStageFunnelId={setNewStageFunnelId}
            handleSaveStage={handleSaveStage}
            funnels={funnels}
          />
        </Dialog>

        <Dialog open={isFieldsDialogOpen} onOpenChange={setIsFieldsDialogOpen}>
          <CustomFieldDialog
            isOpen={isFieldsDialogOpen}
            onOpenChange={setIsFieldsDialogOpen}
            isEditing={isEditingField}
            newField={newField}
            setNewField={setNewField}
            handleSaveFieldsSettings={handleSaveFieldsSettings}
          />
        </Dialog>

        <NoFunnelAlert
          isOpen={isNoFunnelAlertOpen}
          onClose={setIsNoFunnelAlertOpen}
          onCreateFunnel={handleCreateFunnelFromAlert}
        />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
