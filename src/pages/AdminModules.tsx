
import React, { useState } from "react";
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
  const [activeAreaFilter, setActiveAreaFilter] = useState<string | null>(null);
  
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
    setSelectedModule,
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

  // Update the active area filter and close any open module details
  const handleAreaFilterChange = (areaId: string | null) => {
    setActiveAreaFilter(areaId);
    if (selectedModule) {
      setSelectedModule(null);
    }
  };

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

  // Filter modules based on the active area filter
  const filteredModules = activeAreaFilter
    ? modules.filter(module => 
        Array.isArray(module.areas) && module.areas.includes(activeAreaFilter)
      )
    : modules;

  // Get module groups with filtered modules
  const getFilteredModuleGroups = () => {
    const groups = [];
    const groupSize = 4; // 4 cards per slide
    
    for (let i = 0; i < filteredModules.length; i += groupSize) {
      groups.push(filteredModules.slice(i, i + groupSize));
    }
    
    return groups;
  };

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <PageHeader 
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        activeAreaFilter={activeAreaFilter}
        setActiveAreaFilter={handleAreaFilterChange}
      />
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <ScrollArea className="w-full">
          {/* Carrossel de módulos */}
          <ModuleCarousel
            moduleGroups={activeAreaFilter ? getFilteredModuleGroups() : moduleGroups()}
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
