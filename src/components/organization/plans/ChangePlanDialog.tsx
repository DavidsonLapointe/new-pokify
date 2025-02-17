
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ArrowRight, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format, endOfMonth, startOfMonth, addMonths } from "date-fns";
import type { Plan } from "@/components/admin/plans/plan-form-schema";

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: Plan;
  availablePlans: Plan[];
}

export function ChangePlanDialog({
  open,
  onOpenChange,
  currentPlan,
  availablePlans,
}: ChangePlanDialogProps) {
  const calculateProRatedAmount = (planPrice: number) => {
    const today = new Date();
    const endOfCurrentMonth = endOfMonth(today);
    const daysInMonth = endOfCurrentMonth.getDate();
    const remainingDays = endOfCurrentMonth.getDate() - today.getDate() + 1;
    
    return (planPrice / daysInMonth) * remainingDays;
  };

  const getNextBillingDate = () => {
    return startOfMonth(addMonths(new Date(), 1));
  };

  const handlePlanChange = (plan: Plan) => {
    const proRatedAmount = calculateProRatedAmount(plan.price);
    const nextBillingDate = getNextBillingDate();
    
    toast.success(
      `Mudança de plano solicitada!`,
      {
        description: `Sua mudança para o plano ${plan.name} será efetivada em ${format(nextBillingDate, "dd/MM/yyyy")}, início do próximo ciclo de cobrança.`
      }
    );
    
    // Em produção, aqui você implementaria a integração com o gateway de pagamento
    // e salvaria a mudança de plano no banco de dados
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mudar de Plano</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Escolha o plano que melhor atende às suas necessidades</p>
            <div className="flex items-center gap-2 text-sm mt-2 p-3 bg-muted rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                A mudança será efetivada no início do próximo ciclo de cobrança
                ({format(getNextBillingDate(), "dd/MM/yyyy")})
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {availablePlans
            .filter((plan) => plan.id !== currentPlan.id)
            .map((plan) => {
              const proRatedAmount = calculateProRatedAmount(plan.price);
              
              return (
                <div
                  key={plan.id}
                  className="border rounded-lg p-4 space-y-4 hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm leading-snug">
                      {plan.description}
                    </p>
                    <div>
                      <div className="text-2xl font-bold">
                        R$ {plan.price.toFixed(2)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /mês
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Valor pro rata para este mês: R$ {proRatedAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <BadgeCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    onClick={() => handlePlanChange(plan)}
                    size="sm"
                  >
                    Mudar para este plano
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
