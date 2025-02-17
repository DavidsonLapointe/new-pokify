
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, QrCode, Receipt } from "lucide-react";
import { format, addDays } from "date-fns";
import type { Plan } from "@/components/admin/plans/plan-form-schema";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InitialPlanPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: Plan;
  startDate: Date;
}

export function InitialPlanPaymentDialog({
  open,
  onOpenChange,
  selectedPlan,
  startDate,
}: InitialPlanPaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto'>('pix');
  
  // Data de vencimento (3 dias a partir de hoje)
  const dueDate = addDays(new Date(), 3);

  // Valor pro rata (exemplo simples - em produção seria calculado corretamente)
  const prorataValue = (selectedPlan.price / 30 * 15).toFixed(2); // exemplo assumindo 15 dias

  const handleConfirm = () => {
    toast.success(`Gerando ${paymentMethod === 'pix' ? 'QR Code' : 'boleto'} para pagamento.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar adesão ao plano</DialogTitle>
          <DialogDescription className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <p>
                  O plano <strong>{selectedPlan.name}</strong> terá início em{" "}
                  <strong>{format(startDate, "dd/MM/yyyy")}</strong>
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
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar pagamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
