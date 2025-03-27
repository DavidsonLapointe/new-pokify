import { CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/modules/PageHeader";
import { LoadingState } from "@/components/admin/modules/LoadingState";
import { ModuleCarousel } from "@/components/admin/modules/ModuleCarousel";
import { ModuleDetailsView } from "@/components/admin/modules/ModuleDetailsView";
import { ModuleDialog } from "@/components/admin/modules/ModuleDialog";
import { CancelModuleDialog } from "@/components/admin/modules/CancelModuleDialog";
import { SetupContactDialog } from "@/components/admin/modules/SetupContactDialog";
import { useModulesManagement } from "@/components/admin/modules/hooks/useModulesManagement";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { CompanyArea } from "@/components/admin/modules/module-form-schema";
import { fetchDefaultAreas } from "@/services/areasService";

export const ModulesTab = () => {
  const [activeAreaFilter, setActiveAreaFilter] = useState<string | null>(null);
  const [areas, setAreas] = useState<CompanyArea[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  
  const {
    modules,
    isLoading: modulesLoading,
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

  // Load areas from database when component mounts
  useEffect(() => {
    const loadAreas = async () => {
      try {
        setLoadingAreas(true);
        const defaultAreas = await fetchDefaultAreas();
        setAreas(defaultAreas);
      } catch (error) {
        console.error('Error loading areas:', error);
      } finally {
        setLoadingAreas(false);
      }
    };

    loadAreas();
  }, []);

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
    const groupSize = 4; // 4 cards per slide (mesma quantidade da grid original)
    
    for (let i = 0; i < filteredModules.length; i += groupSize) {
      groups.push(filteredModules.slice(i, i + groupSize));
    }
    
    return groups;
  };

  // Get the name of the active area filter
  const getActiveAreaName = () => {
    return areas.find(a => a.id === activeAreaFilter)?.name || activeAreaFilter;
  };

  return (
    <>
      {/* Removed the CardTitle that had "Módulos" text */}
      <CardContent className="p-0">
        <div className="container py-6 max-w-6xl mx-auto">
          <PageHeader 
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            activeAreaFilter={activeAreaFilter}
            setActiveAreaFilter={handleAreaFilterChange}
          />
          
          {modulesLoading || loadingAreas ? (
            <LoadingState />
          ) : (
            <ScrollArea className="w-full">
              {/* User-friendly message when no modules match the area filter */}
              {activeAreaFilter && filteredModules.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                  <p className="text-sm text-yellow-700">
                    Nenhum módulo encontrado para a área "{getActiveAreaName()}".
                  </p>
                </div>
              )}
              
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
      </CardContent>
    </>
  );
};
