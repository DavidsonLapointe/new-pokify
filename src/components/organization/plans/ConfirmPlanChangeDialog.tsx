
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmPlanChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmPlanChangeDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmPlanChangeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Mudança de Plano</DialogTitle>
          <DialogDescription>
            Ao confirmar, você será redirecionado para a tela de pagamento para
            finalizar a contratação do novo plano.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
