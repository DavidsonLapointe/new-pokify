
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
import { Calendar, CreditCard, QrCode, Receipt } from "lucide-react";
import { format, addDays } from "date-fns";
import type { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto'>('pix');
  
  // Calcula a data de vencimento (3 dias a partir de hoje)
  const dueDate = addDays(new Date(), 3);

  // Calcula o valor pro rata (exemplo simples - em produção seria calculado corretamente)
  const prorataValue = (selectedPlan.price / 30 * 15).toFixed(2); // exemplo assumindo 15 dias

  const handleConfirm = () => {
    toast.success(`Plano alterado com sucesso! Gerando ${paymentMethod === 'pix' ? 'QR Code' : 'boleto'} para pagamento.`);
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Primeira cobrança (pro rata)</h4>
                  <p className="text-sm text-muted-foreground">
                    Valor proporcional até o início do próximo ciclo: R$ {prorataValue}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: {format(dueDate, "dd/MM/yyyy")}
                  </p>

                  <Tabs defaultValue="pix" className="mt-4">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger 
                        value="pix" 
                        onClick={() => setPaymentMethod('pix')}
                        className="flex items-center gap-2"
                      >
                        <QrCode className="h-4 w-4" />
                        PIX
                      </TabsTrigger>
                      <TabsTrigger 
                        value="boleto"
                        onClick={() => setPaymentMethod('boleto')}
                        className="flex items-center gap-2"
                      >
                        <Receipt className="h-4 w-4" />
                        Boleto
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Cobranças mensais subsequentes</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <p>
                      R$ {selectedPlan.price.toFixed(2)} via cartão de crédito cadastrado
                    </p>
                  </div>
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
