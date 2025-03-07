
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { OrganizationFormFields } from "./organization-form-fields";
import { useOrganizationForm } from "./use-organization-form";
import { useEffect } from "react";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateOrganizationDialog = ({
  open,
  onOpenChange,
  onSuccess = () => {}
}: CreateOrganizationDialogProps) => {
  const { form, onSubmit } = useOrganizationForm(() => {
    onOpenChange(false);
    onSuccess();
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-[#1A1F2C]">Nova Empresa</DialogTitle>
          <DialogDescription className="text-gray-600">
            Preencha os dados da empresa e do administrador inicial.
            O contrato e as instruções de pagamento serão enviados por email.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <div className="bg-white rounded-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-[#9b87f5] rounded-full"></div>
                <h3 className="text-lg font-medium text-[#1A1F2C]">Dados da Empresa</h3>
              </div>
              <OrganizationFormFields form={form} />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="cancel"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                Criar Empresa
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
