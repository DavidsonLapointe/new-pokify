
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { useLeadForm } from "@/hooks/useLeadForm";
import { LeadFormData } from "@/schemas/leadFormSchema";

interface CreateLeadDialogProps {
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  onCreateLead: (data: LeadFormData) => void;
}

export function CreateLeadDialog({
  hasPhoneIntegration,
  hasEmailIntegration,
  onCreateLead,
}: CreateLeadDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    personType,
    handlePhoneChange,
    handleDocumentChange,
    onSubmit,
  } = useLeadForm({
    hasPhoneIntegration,
    hasEmailIntegration,
    onCreateLead,
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Lead</DialogTitle>
        </DialogHeader>
        <LeadForm
          form={form}
          personType={personType}
          hasPhoneIntegration={hasPhoneIntegration}
          hasEmailIntegration={hasEmailIntegration}
          handlePhoneChange={handlePhoneChange}
          handleDocumentChange={handleDocumentChange}
          onSubmit={onSubmit}
          showCancelButton
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
