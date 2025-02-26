
import { useState } from "react";
import { toast } from "sonner";
import { CurrentPlanCard } from "@/components/organization/plans/CurrentPlanCard";
import { CreditsBalanceCard } from "@/components/organization/plans/CreditsBalanceCard";
import { PaymentMethodCard } from "@/components/organization/plans/PaymentMethodCard";
import { AnalysisPackagesDialog } from "@/components/organization/plans/AnalysisPackagesDialog";
import { ChangePlanDialog } from "@/components/organization/plans/ChangePlanDialog";
import type { Plan } from "@/components/admin/plans/plan-form-schema";

// Mock data - em produção viria da API
// Agora usando a mesma estrutura do admin
const planInfo: Plan = {
  id: 2,
  name: "Professional",
  price: 199.90,
  description: "Perfect para empresas em crescimento",
  features: [
    "Até 10 usuários",
    "500 créditos (análise de arquivos)",
    "Integração com 3 CRMs",
    "Suporte prioritário",
    "API de integração"
  ],
  active: true
};

// Mock available plans - em produção viria da API
const availablePlans: Plan[] = [
  {
    id: 1,
    name: "Basic",
    price: 99.90,
    description: "Ideal para pequenas empresas iniciando no mercado",
    features: [
      "Até 3 usuários",
      "100 créditos (análise de arquivos)",
      "Integração com 1 CRM",
      "Suporte por email",
    ],
    active: true
  },
  {
    id: 2,
    name: "Professional",
    price: 199.90,
    description: "Perfect para empresas em crescimento",
    features: [
      "Até 10 usuários",
      "500 créditos (análise de arquivos)",
      "Integração com 3 CRMs",
      "Suporte prioritário",
      "API de integração"
    ],
    active: true
  },
  {
    id: 3,
    name: "Enterprise",
    price: 499.90,
    description: "Para grandes empresas que precisam de mais recursos",
    features: [
      "Usuários ilimitados",
      "1000 créditos (análise de arquivos)",
      "Integrações ilimitadas",
      "Suporte 24/7",
      "API dedicada",
      "Manager dedicado",
    ],
    active: true
  }
];

// Additional data specific to the organization's usage
const usageInfo = {
  monthlyQuota: 500,
  used: 423,
  additionalCredits: 150,
};

const OrganizationPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPackagesDialogOpen, setIsPackagesDialogOpen] = useState(false);
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);

  // Mock do cartão atual - em produção viria da API
  const mockPaymentMethod = {
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025
  };

  const handleBuyMoreAnalyses = () => {
    setIsPackagesDialogOpen(true);
  };

  const handleSelectPackage = (pkg: any) => {
    setIsPackagesDialogOpen(false);
    toast.success("Redirecionando para o gateway de pagamento...");
  };

  return (
    <div className="space-y-2">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Meu Plano</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie seu plano e consumo de análises
        </p>
      </div>

      <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
        <CurrentPlanCard 
          planInfo={planInfo}
          onChangePlan={() => setIsChangePlanDialogOpen(true)}
        />
        <CreditsBalanceCard
          monthlyQuota={usageInfo.monthlyQuota}
          used={usageInfo.used}
          additionalCredits={usageInfo.additionalCredits}
          onBuyMoreCredits={handleBuyMoreAnalyses}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-2">
        <PaymentMethodCard currentPaymentMethod={mockPaymentMethod} />
      </div>

      <AnalysisPackagesDialog
        open={isPackagesDialogOpen}
        onOpenChange={setIsPackagesDialogOpen}
        onSelectPackage={handleSelectPackage}
      />

      <ChangePlanDialog
        open={isChangePlanDialogOpen}
        onOpenChange={setIsChangePlanDialogOpen}
        currentPlan={planInfo}
        availablePlans={availablePlans}
      />
    </div>
  );
};

export default OrganizationPlan;
