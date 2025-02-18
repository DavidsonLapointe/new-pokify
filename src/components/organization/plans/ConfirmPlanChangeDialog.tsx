
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import type { Plan } from "@/components/admin/plans/plan-form-schema";

interface ConfirmPlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: Plan;
  nextBillingDate: Date;
}

export const ConfirmPlanChangeDialog = ({
  open,
  onOpenChange,
  selectedPlan,
  nextBillingDate,
}: ConfirmPlanChangeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Mudança de Plano</DialogTitle>
          <DialogDescription className="space-y-6">
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
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="cancel" onClick={() => onOpenChange(false)}>
            Manter assinatura
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Confirmar mudança
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
