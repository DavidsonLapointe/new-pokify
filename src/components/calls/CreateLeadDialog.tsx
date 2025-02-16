
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "./LeadForm";
import { useLeadForm } from "@/hooks/useLeadForm";
import { LeadFormData } from "@/schemas/leadFormSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle } from "lucide-react";

interface CreateLeadDialogProps {
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  onCreateLead: (data: LeadFormData) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateLeadDialog({
  hasPhoneIntegration,
  hasEmailIntegration,
  onCreateLead,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateLeadDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [leadData, setLeadData] = useState<LeadFormData | null>(null);

  const isControlled = controlledIsOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledIsOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  const {
    form,
    personType,
    handlePhoneChange,
    handleDocumentChange,
    onSubmit,
  } = useLeadForm({
    hasPhoneIntegration,
    hasEmailIntegration,
    onCreateLead: (data) => {
      setLeadData(data);
      setShowSuccessCard(true);
    },
  });

  const handleClose = () => {
    if (showSuccessCard && leadData) {
      onCreateLead(leadData); // Salva o lead quando fecha com X
    }
    setOpen(false);
    setShowSuccessCard(false);
    setLeadData(null);
    form.reset();
  };

  const handleUploadClick = () => {
    if (leadData) {
      onCreateLead(leadData);
      setOpen(false);
    }
    setShowSuccessCard(false);
    setLeadData(null);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!showSuccessCard ? (
          <>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Lead</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <LeadForm
                form={form}
                personType={personType}
                hasPhoneIntegration={hasPhoneIntegration}
                hasEmailIntegration={hasEmailIntegration}
                handlePhoneChange={handlePhoneChange}
                handleDocumentChange={handleDocumentChange}
                onSubmit={onSubmit}
                showCancelButton
                onCancel={handleClose}
              />
            </div>
          </>
        ) : (
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 bg-green-50 w-12 h-12 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-xl">Lead cadastrado com sucesso!</CardTitle>
              <CardDescription>
                Que tal começar agora mesmo com o upload da primeira chamada?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pt-4">
              <Button
                onClick={handleUploadClick}
                variant="secondary"
                className="w-full max-w-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer upload da primeira chamada
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
