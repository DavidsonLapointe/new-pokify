
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
import { Button } from "@/components/ui/button";
import { format, addDays, getDate } from "date-fns";
import type { Plan } from "@/components/admin/plans/plan-form-schema";
import { PaymentGatewayDialog } from "./PaymentGatewayDialog";
import { useState } from "react";

interface ConfirmPlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: Plan;
  proRatedAmount: number;
  nextBillingDate: Date;
}

export function ConfirmPlanChangeDialog({
  open,
  onOpenChange,
  selectedPlan,
  proRatedAmount,
  nextBillingDate,
}: ConfirmPlanChangeDialogProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const dueDate = addDays(new Date(), 3);
  const fifthWorkingDay = 5; // Simplificado - em produção você calcularia o 5º dia útil real

  const handleConfirm = () => {
    setShowPaymentDialog(true);
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar mudança de plano</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="space-y-2 text-base">
                <p>
                  Você está prestes a mudar para o plano <strong>{selectedPlan.name}</strong>.
                </p>
                
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Pagamento inicial (pro rata):</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Valor: R$ {proRatedAmount.toFixed(2)}</li>
                    <li>• Vencimento: {format(dueDate, "dd/MM/yyyy")}</li>
                    <li>• Formas de pagamento: PIX ou Boleto</li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Mensalidades regulares:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Valor mensal: R$ {selectedPlan.price.toFixed(2)}</li>
                    <li>• Primeira mensalidade regular: {format(nextBillingDate, "dd/MM/yyyy")}</li>
                    <li>• Dia de pagamento: 5º dia útil de cada mês</li>
                    <li>• Forma de pagamento: Cartão de crédito (recorrente)</li>
                  </ul>
                </div>

                <p className="text-sm mt-4">
                  Ao confirmar, você será direcionado para:
                  1. Pagamento do valor pro rata
                  2. Cadastro do cartão de crédito para as mensalidades futuras
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirmar e prosseguir com o pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentGatewayDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        package={{
          name: `Pro rata - ${selectedPlan.name}`,
          price: proRatedAmount,
          credits: 0
        }}
      />
    </>
  );
}
