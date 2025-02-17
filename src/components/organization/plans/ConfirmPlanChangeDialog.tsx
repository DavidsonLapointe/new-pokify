
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import type { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";

interface ConfirmPlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: Plan;
  nextBillingDate: Date;
}

export function ConfirmPlanChangeDialog({
  open,
  onOpenChange,
  selectedPlan,
  nextBillingDate,
}: ConfirmPlanChangeDialogProps) {
  const handleConfirm = () => {
    toast.success("Plano alterado com sucesso!");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar mudança de plano</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="space-y-4 text-base">
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <p>
                  Seu novo plano <strong>{selectedPlan.name}</strong> terá início em{" "}
                  <strong>{format(nextBillingDate, "dd/MM/yyyy")}</strong>
                </p>
              </div>
              
              <p>
                O valor de R$ {selectedPlan.price.toFixed(2)} será debitado mensalmente
                do seu cartão de crédito cadastrado.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmar mudança
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
