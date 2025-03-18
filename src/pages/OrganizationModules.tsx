
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModuleCarousel } from "@/components/organization/modules/ModuleCarousel";
import { ModuleDetails } from "@/components/organization/modules/ModuleDetails";
import { ModuleDialogs } from "@/components/organization/modules/ModuleDialogs";
import { ModulesPageHeader } from "@/components/organization/modules/ModulesPageHeader";
import { useModulesManagement } from "@/components/organization/modules/hooks/useModulesManagement";

const OrganizationModules = () => {
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <ModulesPageHeader 
          title="Módulos do Sistema"
          description="Gerencie a contratação das ferramentas de IA disponíveis no sistema"
        />

        <ModuleCarousel
          tools={tools}
          selectedTool={selectedTool}
          onSelectTool={handleSelectTool}
          onCancelModule={handleCancelTool}
        />

        {/* Details of selected module */}
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
