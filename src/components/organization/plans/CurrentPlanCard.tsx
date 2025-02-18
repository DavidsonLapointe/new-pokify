
import { BadgeCheck, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import type { Plan } from "@/components/admin/plans/plan-form-schema";

interface CurrentPlanCardProps {
  planInfo: Plan;
  onChangePlan: () => void;
}

export function CurrentPlanCard({ planInfo, onChangePlan }: CurrentPlanCardProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const cancellationReasons = [
    { id: "price", label: "Preço muito alto" },
    { id: "features", label: "Faltam recursos importantes" },
    { id: "usability", label: "Difícil de usar" },
    { id: "competitor", label: "Mudando para outro serviço" },
    { id: "temporary", label: "Pausa temporária" },
    { id: "other", label: "Outro motivo" }
  ];

  const handleCancelSubscription = () => {
    if (!selectedReason) {
      toast.error("Por favor, selecione um motivo para o cancelamento");
      return;
    }
    
    if (selectedReason === "other" && !otherReason.trim()) {
      toast.error("Por favor, descreva o motivo do cancelamento");
      return;
    }

    const finalReason = selectedReason === "other" ? otherReason : cancellationReasons.find(r => r.id === selectedReason)?.label;
    console.log("Assinatura cancelada. Motivo:", finalReason);
    
    setIsAlertOpen(false);
    setSelectedReason("");
    setOtherReason("");
    toast.success("Assinatura cancelada com sucesso");
  };

  const handleModalClose = () => {
    setSelectedReason("");
    setOtherReason("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-primary" />
          Plano {planInfo.name}
        </CardTitle>
        <CardDescription>
          {planInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Recursos inclusos:</div>
          <ul className="space-y-2">
            {planInfo.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onChangePlan}
            className="text-muted-foreground hover:text-foreground transition-colors"
            size="sm"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Alterar plano
          </Button>
          
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
              >
                Cancelar assinatura
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Essa ação <span className="font-medium">não poderá ser desfeita</span>. 
                    Sua assinatura será cancelada ao final do período atual e você perderá 
                    acesso a todos os recursos do sistema.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Por que você está cancelando?
                    </label>
                    <RadioGroup 
                      value={selectedReason} 
                      onValueChange={setSelectedReason}
                      className="space-y-3"
                    >
                      {cancellationReasons.map((reason) => (
                        <div key={reason.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={reason.id} id={reason.id} />
                          <label 
                            htmlFor={reason.id}
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {reason.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {selectedReason === "other" && (
                      <div className="mt-4">
                        <Textarea
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                          placeholder="Descreva o motivo do cancelamento..."
                          className="resize-none"
                          rows={4}
                        />
                      </div>
                    )}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleModalClose} className="bg-[#F1F1F1] text-primary hover:bg-[#E5E5E5]">
                  Manter assinatura
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelSubscription}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Confirmar cancelamento
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
