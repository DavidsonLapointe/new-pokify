
import OrganizationLayout from "@/components/OrganizationLayout";
import { useState } from "react";
import { toast } from "sonner";
import { CurrentPlanCard } from "@/components/organization/plans/CurrentPlanCard";
import { CreditsBalanceCard } from "@/components/organization/plans/CreditsBalanceCard";
import { AnalysisPackagesDialog } from "@/components/organization/plans/AnalysisPackagesDialog";

// Mock data - em produção viria da API
const planInfo = {
  name: "Professional",
  monthlyQuota: 500,
  used: 423,
  additionalCredits: 150,
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
  const [isPackagesDialogOpen, setIsPackagesDialogOpen] = useState(false);

  const handleBuyMoreAnalyses = () => {
    setIsPackagesDialogOpen(true);
  };

  const handleSelectPackage = (pkg: any) => {
    setIsPackagesDialogOpen(false);
    // Aqui você implementaria a integração com o gateway de pagamento
    toast.success("Redirecionando para o gateway de pagamento...");
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
          <CurrentPlanCard planInfo={planInfo} />
          <CreditsBalanceCard
            monthlyQuota={planInfo.monthlyQuota}
            used={planInfo.used}
            additionalCredits={planInfo.additionalCredits}
            onBuyMoreCredits={handleBuyMoreAnalyses}
            isLoading={isLoading}
          />
        </div>

        <AnalysisPackagesDialog
          open={isPackagesDialogOpen}
          onOpenChange={setIsPackagesDialogOpen}
          onSelectPackage={handleSelectPackage}
        />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationPlan;
