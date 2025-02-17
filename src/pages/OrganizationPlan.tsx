
import OrganizationLayout from "@/components/OrganizationLayout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BadgeCheck, FileBarChart, Plus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

// Mock data - em produção viria da API
const planInfo = {
  name: "Professional",
  monthlyQuota: 500,
  used: 423,
  price: 199.90,
  features: [
    "Até 10 usuários",
    "500 análises por mês",
    "Integração com 3 CRMs",
    "Suporte prioritário",
    "API de integração",
  ]
};

const OrganizationPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const remainingAnalyses = planInfo.monthlyQuota - planInfo.used;
  const usagePercentage = (planInfo.used / planInfo.monthlyQuota) * 100;
  const isQuotaExhausted = remainingAnalyses <= 0;

  const handleBuyMoreAnalyses = () => {
    setIsLoading(true);
    // Aqui implementaria a lógica de compra
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCancelSubscription = () => {
    if (!cancelReason.trim()) {
      toast.error("Por favor, informe o motivo do cancelamento");
      return;
    }
    // Aqui implementaria a lógica de cancelamento
    console.log("Assinatura cancelada. Motivo:", cancelReason);
    setIsAlertOpen(false);
    setCancelReason("");
    toast.success("Assinatura cancelada com sucesso");
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Plano</h1>
          <p className="text-muted-foreground">
            Gerencie seu plano e consumo de análises
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Card do Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" />
                Plano {planInfo.name}
              </CardTitle>
              <CardDescription>
                Seu plano atual e recursos disponíveis
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
              
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive text-sm mt-4"
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
                        <label htmlFor="cancelReason" className="text-sm font-medium text-foreground">
                          Por que você está cancelando?
                        </label>
                        <Textarea
                          id="cancelReason"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Descreva o motivo do cancelamento..."
                          className="resize-none"
                          rows={4}
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setCancelReason("")}>
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
            </CardContent>
          </Card>

          {/* Card de Uso do Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart className="h-5 w-5 text-primary" />
                Consumo de Análises
              </CardTitle>
              <CardDescription>
                Consumo do mês atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Análises utilizadas</span>
                  <span className="font-medium">{planInfo.used}/{planInfo.monthlyQuota}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Saldo disponível</p>
                      <p className="text-sm text-muted-foreground">
                        {isQuotaExhausted 
                          ? "Você utilizou todas as análises disponíveis para este mês." 
                          : `Você ainda tem ${remainingAnalyses} análises disponíveis para este mês.`}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleBuyMoreAnalyses}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Comprar análises adicionais
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationPlan;
