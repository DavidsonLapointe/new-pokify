
import React from "react";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CancelModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: Plan[];
  cancelModuleId: string | number | null;
  onConfirm: () => void;
}

export const CancelModuleDialog: React.FC<CancelModuleDialogProps> = ({
  open,
  onOpenChange,
  modules,
  cancelModuleId,
  onConfirm
}) => {
  const moduleToCancel = modules.find(m => m.id === cancelModuleId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            Cancelar Módulo
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            Você está prestes a cancelar o módulo{" "}
            <strong>
              {moduleToCancel?.name}
            </strong>. 
            Esta ação não pode ser desfeita.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
