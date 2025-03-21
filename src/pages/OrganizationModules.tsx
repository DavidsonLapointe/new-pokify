
import React, { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModuleCarousel } from "@/components/organization/modules/ModuleCarousel";
import { ModuleDetails } from "@/components/organization/modules/ModuleDetails";
import { ModuleDialogs } from "@/components/organization/modules/ModuleDialogs";
import { ModulesPageHeader } from "@/components/organization/modules/ModulesPageHeader";
import { useModulesManagement } from "@/components/organization/modules/hooks/useModulesManagement";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { standardAreas } from "@/components/admin/modules/module-form-schema";
import { Tool } from "@/components/organization/modules/types";

const OrganizationModules = () => {
  const [activeAreaFilter, setActiveAreaFilter] = useState<string | null>(null);
  
  const {
    // States
    tools,
    isConfirmDialogOpen,
    isCancelDialogOpen,
    isPaymentProcessingDialogOpen,
    isPaymentSuccessDialogOpen,
    isPaymentFailedDialogOpen,
    isTermsDialogOpen,
    selectedTool,
    cancelModuleId,
    cancelReason,
    setupContactInfo,
    
    // State setters
    setIsConfirmDialogOpen,
    setIsCancelDialogOpen,
    setIsPaymentSuccessDialogOpen,
    setIsPaymentFailedDialogOpen,
    setIsTermsDialogOpen,
    setCancelReason,
    setSelectedTool,
    
    // Handlers
    handleContractTool,
    handleCancelTool,
    confirmAction,
    handleSubmitSetupContact,
    confirmCancelation,
    handleOpenTerms,
    handleSelectTool,
    handleContactInfoChange,
    handleConfigureModule,
    handleEditConfiguration
  } = useModulesManagement();

  // Filter only default areas and sort them alphabetically by name
  const defaultAreas = standardAreas
    .filter(area => area.isDefault)
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAreaFilterClick = (areaId: string) => {
    if (activeAreaFilter === areaId) {
      // If the same filter is clicked twice, clear it
      setActiveAreaFilter(null);
    } else {
      setActiveAreaFilter(areaId);
    }
    
    // Hide any open detail section when a filter is clicked
    if (selectedTool) {
      setSelectedTool(null);
    }
  };

  const clearFilter = () => {
    setActiveAreaFilter(null);
  };

  // Filter tools based on the active area filter
  const filteredTools = activeAreaFilter
    ? tools.filter(tool => 
        Array.isArray(tool.areas) && tool.areas.includes(activeAreaFilter)
      )
    : tools;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <ModulesPageHeader 
          title="Módulos do Sistema"
          description="Gerencie a contratação das ferramentas de IA disponíveis no sistema"
        />

        {/* Area Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">Filtrar por área:</div>
          <div className="flex flex-wrap gap-1.5">
            {defaultAreas.map((area) => (
              <Badge
                key={area.id}
                variant={activeAreaFilter === area.id ? "default" : "outline"}
                className={`
                  px-2.5 py-1 text-xs cursor-pointer
                  ${activeAreaFilter === area.id 
                    ? "bg-primary text-white hover:bg-primary-hover" 
                    : "hover:bg-gray-100 text-gray-700"}
                `}
                onClick={() => handleAreaFilterClick(area.id)}
              >
                {area.name}
              </Badge>
            ))}
            
            {activeAreaFilter && (
              <Badge 
                variant="outline" 
                className="px-2 py-1 text-xs cursor-pointer flex items-center gap-1 hover:bg-gray-100 text-gray-700"
                onClick={clearFilter}
              >
                <X className="w-3 h-3" />
                Limpar
              </Badge>
            )}
          </div>
        </div>

        {/* Show empty state when no tools match the filter */}
        {activeAreaFilter && filteredTools.length === 0 && (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-md text-center">
            <p className="text-gray-600">
              Nenhuma ferramenta encontrada para a área selecionada.
            </p>
            <Badge 
              variant="outline" 
              className="mt-3 px-3 py-1.5 text-xs cursor-pointer flex items-center gap-1 hover:bg-gray-100 text-gray-700 mx-auto w-fit"
              onClick={clearFilter}
            >
              <X className="w-3 h-3" />
              Limpar filtro
            </Badge>
          </div>
        )}

        {/* Always show the carousel, but with filtered tools */}
        <ModuleCarousel
          tools={filteredTools}
          selectedTool={selectedTool}
          onSelectTool={handleSelectTool}
          onCancelModule={handleCancelTool}
        />

        {/* Details of selected module - only shown when a module is selected */}
        {selectedTool && (
          <ModuleDetails
            selectedTool={selectedTool}
            onContractModule={handleContractTool}
            onConfigureModule={handleConfigureModule}
            onEditConfiguration={handleEditConfiguration}
          />
        )}

        {/* Dialogs */}
        <ModuleDialogs
          isConfirmDialogOpen={isConfirmDialogOpen}
          isCancelDialogOpen={isCancelDialogOpen}
          isPaymentProcessingDialogOpen={isPaymentProcessingDialogOpen}
          isPaymentSuccessDialogOpen={isPaymentSuccessDialogOpen}
          isPaymentFailedDialogOpen={isPaymentFailedDialogOpen}
          isTermsDialogOpen={isTermsDialogOpen}
          selectedToolId={selectedTool?.id || null}
          cancelModuleId={cancelModuleId}
          cancelReason={cancelReason}
          setupContactInfo={setupContactInfo}
          tools={tools}
          setIsConfirmDialogOpen={setIsConfirmDialogOpen}
          setIsCancelDialogOpen={setIsCancelDialogOpen}
          setIsPaymentSuccessDialogOpen={setIsPaymentSuccessDialogOpen}
          setIsPaymentFailedDialogOpen={setIsPaymentFailedDialogOpen}
          setIsTermsDialogOpen={setIsTermsDialogOpen}
          onCancelReasonChange={setCancelReason}
          onConfirmContract={confirmAction}
          onConfirmCancelation={confirmCancelation}
          onOpenTerms={handleOpenTerms}
          onContactInfoChange={handleContactInfoChange}
          onSubmitSetupContact={handleSubmitSetupContact}
        />
      </div>
    </TooltipProvider>
  );
};

export default OrganizationModules;
