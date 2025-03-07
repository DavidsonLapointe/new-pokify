
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle, Coins } from "lucide-react";
import { format } from "date-fns";
import type { Plan } from "@/components/admin/plans/plan-form-schema";

interface CurrentPlanCardProps {
  plan: Plan;
  onChangePlan: () => void;
  nextBillingDate?: Date;
}

export function CurrentPlanCard({ plan, onChangePlan, nextBillingDate }: CurrentPlanCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              {plan.description}
            </p>
          </div>
          <Badge variant="default" className="ml-2">
            Plano Atual
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline text-2xl font-semibold">
          <span className="text-xl mr-1">R$</span>
          {plan.price?.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            /mês
          </span>
        </div>

        {plan.credits !== undefined && plan.credits > 0 && (
          <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-md">
            <Coins className="h-4 w-4 text-primary shrink-0" />
            <span><strong>{plan.credits}</strong> créditos mensais</span>
          </div>
        )}

        {nextBillingDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              Próximo pagamento em {format(nextBillingDate, "dd/MM/yyyy")}
            </span>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Recursos inclusos:</h4>
          <ul className="space-y-1.5">
            {plan.features?.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={onChangePlan}
        >
          Mudar de Plano
        </Button>
      </CardContent>
    </Card>
  );
}
