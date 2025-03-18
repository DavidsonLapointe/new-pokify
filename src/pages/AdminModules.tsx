
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModuleDialog } from "@/components/admin/modules/ModuleDialog";
import { LoadingState } from "@/components/admin/modules/LoadingState";
import { PageHeader } from "@/components/admin/modules/PageHeader";
import { ModuleCarousel } from "@/components/admin/modules/ModuleCarousel";
import { ModuleDetailsView } from "@/components/admin/modules/ModuleDetailsView";
import { CancelModuleDialog } from "@/components/admin/modules/CancelModuleDialog";
import { SetupContactDialog } from "@/components/admin/modules/SetupContactDialog";
import { useModulesManagement } from "@/components/admin/modules/hooks/useModulesManagement";

const AdminModules = () => {
  const {
    modules,
    isLoading,
    selectedModule,
    deletingModuleId,
    isCreateDialogOpen,
    editingModule,
    isCancelDialogOpen,
    cancelModuleId,
    isSetupContactDialogOpen,
    setupContactInfo,
    moduleGroups,
    setIsCreateDialogOpen,
    setEditingModule,
    setIsCancelDialogOpen,
    setCancelModuleId,
    setIsSetupContactDialogOpen,
    setSetupContactInfo,
    handleSaveModule,
    handleDeleteModule,
    handleEditModule,
    handleSelectModule
  } = useModulesManagement();

  const handleConfirmCancel = () => {
    if (cancelModuleId) {
      handleDeleteModule(cancelModuleId);
      setIsCancelDialogOpen(false);
    }
  };

  const handleContactInfoChange = (info: { name?: string; phone?: string }) => {
    setSetupContactInfo(prev => ({ ...prev, ...info }));
  };

  const handleSubmitContactInfo = () => {
    console.log("Informações de contato enviadas:", setupContactInfo);
    setIsSetupContactDialogOpen(false);
    // Aqui você pode adicionar a lógica para enviar as informações de contato
  };

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <PageHeader setIsCreateDialogOpen={setIsCreateDialogOpen} />
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <ScrollArea className="w-full">
          {/* Carrossel de módulos */}
          <ModuleCarousel
            moduleGroups={moduleGroups()}
            selectedModule={selectedModule}
            onEditModule={handleEditModule}
            onSelectModule={handleSelectModule}
          />
          
          {/* Detalhes do módulo selecionado */}
          {selectedModule && (
            <ModuleDetailsView
              selectedModule={selectedModule}
              onEditModule={handleEditModule}
              onDeleteModule={(id) => {
                setIsCancelDialogOpen(true);
                setEditingModule(null);
                setCancelModuleId(id);
              }}
              deletingModuleId={deletingModuleId}
            />
          )}
        </ScrollArea>
      )}
      
      {/* Dialog para criar/editar módulo */}
      <ModuleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        module={editingModule}
        onSave={handleSaveModule}
      />

      {/* Dialog para cancelar módulo */}
      <CancelModuleDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        modules={modules}
        cancelModuleId={cancelModuleId}
        onConfirm={handleConfirmCancel}
      />

      {/* Diálogo para setup de contato */}
      <SetupContactDialog
        open={isSetupContactDialogOpen}
        onOpenChange={setIsSetupContactDialogOpen}
        setupContactInfo={setupContactInfo}
        onContactInfoChange={handleContactInfoChange}
        onSubmit={handleSubmitContactInfo}
      />
    </div>
  );
};

export default AdminModules;
