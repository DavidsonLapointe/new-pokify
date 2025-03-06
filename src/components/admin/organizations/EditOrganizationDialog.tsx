
import React from "react";
import { Organization } from "@/types";
import { OrganizationFormFields } from "./organization-form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEditOrganizationForm } from "./hooks/useEditOrganizationForm";
import { StatusSection } from "./dialog-sections/StatusSection";
import { PendingReasonCard } from "./dialog-sections/PendingReasonCard";

interface EditOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization;
  onSave: (organization: Organization) => void;
}

export const EditOrganizationDialog = ({
  open,
  onOpenChange,
  organization,
  onSave,
}: EditOrganizationDialogProps) => {
  const { form, onSubmit } = useEditOrganizationForm(
    organization, 
    onSave, 
    () => onOpenChange(false)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
          <DialogDescription>
            Atualize os dados da empresa.
          </DialogDescription>
        </DialogHeader>

        {organization.status === "pending" && organization.pendingReason && (
          <PendingReasonCard pendingReason={organization.pendingReason} />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <OrganizationFormFields form={form} />

            <StatusSection 
              form={form} 
              currentStatus={organization.status} 
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="cancel"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
