
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
import { Calendar, CreditCard } from "lucide-react";
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar mudança de plano</AlertDialogTitle>
          <AlertDialogDescription className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <p>
                  Seu novo plano <strong>{selectedPlan.name}</strong> terá início em{" "}
                  <strong>{format(nextBillingDate, "dd/MM/yyyy")}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Detalhes da cobrança</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <p>
                    R$ {selectedPlan.price.toFixed(2)} será debitado mensalmente do seu cartão de crédito cadastrado
                  </p>
                </div>
              </div>
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
