
import React from "react";
import { TermsDialog } from "@/components/admin/organizations/LegalDocumentsDialogs";
import { ConfirmContractDialog } from "@/components/organization/modules/dialogs/ConfirmContractDialog";
import { PaymentProcessingDialog } from "@/components/organization/modules/dialogs/PaymentProcessingDialog";
import { PaymentSuccessDialog } from "@/components/organization/modules/dialogs/PaymentSuccessDialog";
import { PaymentFailedDialog } from "@/components/organization/modules/dialogs/PaymentFailedDialog";
import { CancelModuleDialog } from "@/components/organization/modules/dialogs/CancelModuleDialog";
import { Tool, SetupContactInfo } from "@/components/organization/modules/types";

interface ModuleDialogsProps {
  // Dialog visibility states
  isConfirmDialogOpen: boolean;
  isCancelDialogOpen: boolean;
  isPaymentProcessingDialogOpen: boolean;
  isPaymentSuccessDialogOpen: boolean;
  isPaymentFailedDialogOpen: boolean;
  isTermsDialogOpen: boolean;

  // Dialog data
  selectedToolId: string | null;
  cancelModuleId: string | null;
  cancelReason: string;
  setupContactInfo: SetupContactInfo;
  tools: Tool[];

  // State setters
  setIsConfirmDialogOpen: (open: boolean) => void;
  setIsCancelDialogOpen: (open: boolean) => void;
  setIsPaymentSuccessDialogOpen: (open: boolean) => void;
  setIsPaymentFailedDialogOpen: (open: boolean) => void;
  setIsTermsDialogOpen: (open: boolean) => void;
  onCancelReasonChange: (reason: string) => void;

  // Action handlers
  onConfirmContract: () => void;
  onConfirmCancelation: () => void;
  onOpenTerms: (e: React.MouseEvent) => void;
  onContactInfoChange: (info: Partial<SetupContactInfo>) => void;
  onSubmitSetupContact: () => void;
}

export const ModuleDialogs: React.FC<ModuleDialogsProps> = ({
  isConfirmDialogOpen,
  isCancelDialogOpen,
  isPaymentProcessingDialogOpen,
  isPaymentSuccessDialogOpen,
  isPaymentFailedDialogOpen,
  isTermsDialogOpen,
  selectedToolId,
  cancelModuleId,
  cancelReason,
  setupContactInfo,
  tools,
  setIsConfirmDialogOpen,
  setIsCancelDialogOpen,
  setIsPaymentSuccessDialogOpen,
  setIsPaymentFailedDialogOpen,
  setIsTermsDialogOpen,
  onCancelReasonChange,
  onConfirmContract,
  onConfirmCancelation,
  onOpenTerms,
  onContactInfoChange,
  onSubmitSetupContact
}) => {
  const selectedTool = tools.find(t => t.id === selectedToolId) || null;

  return (
    <>
      <ConfirmContractDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        selectedTool={selectedTool}
        tools={tools}
        onConfirm={onConfirmContract}
        onOpenTerms={onOpenTerms}
      />

      <PaymentProcessingDialog 
        open={isPaymentProcessingDialogOpen} 
      />

      <PaymentSuccessDialog
        open={isPaymentSuccessDialogOpen}
        onOpenChange={setIsPaymentSuccessDialogOpen}
        setupContactInfo={setupContactInfo}
        onContactInfoChange={onContactInfoChange}
        onSubmit={onSubmitSetupContact}
      />

      <PaymentFailedDialog
        open={isPaymentFailedDialogOpen}
        onOpenChange={setIsPaymentFailedDialogOpen}
      />

      <CancelModuleDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        cancelModuleId={cancelModuleId}
        cancelReason={cancelReason}
        onCancelReasonChange={onCancelReasonChange}
        onConfirm={onConfirmCancelation}
        tools={tools}
      />

      <TermsDialog 
        open={isTermsDialogOpen} 
        onOpenChange={setIsTermsDialogOpen}
        moduleId={selectedToolId || undefined}
        moduleName={tools.find(t => t.id === selectedToolId)?.title}
      />
    </>
  );
};
