
import { PaymentGatewayDialog } from "@/components/organization/plans/PaymentGatewayDialog";
import { LoadingState } from "@/components/organization/setup/LoadingState";
import { PasswordSetupForm } from "@/components/organization/setup/PasswordSetupForm";
import { RemainingStepsCard } from "@/components/organization/setup/RemainingStepsCard";
import { SetupCompleted } from "@/components/organization/setup/SetupCompleted";
import { useOrganizationSetup } from "@/components/organization/setup/useOrganizationSetup";

export default function OrganizationSetup() {
  const {
    organization,
    loading,
    setupCompleted,
    contractSigned,
    paymentCompleted,
    registrationCompleted,
    showPayment,
    setShowPayment,
    handlePasswordSubmit
  } = useOrganizationSetup();

  if (loading) {
    return <LoadingState />;
  }
  
  // If setup is completed, show the completed state
  if (setupCompleted) {
    return (
      <SetupCompleted 
        organizationId={organization.id}
        contractSigned={contractSigned}
        paymentCompleted={paymentCompleted}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        {organization && (contractSigned || paymentCompleted) && (
          <div className="mb-6">
            <RemainingStepsCard 
              organizationId={organization.id}
              contractSigned={contractSigned}
              paymentCompleted={paymentCompleted}
              registrationCompleted={registrationCompleted}
              hideHomeButton={true}
            />
          </div>
        )}
      
        <PasswordSetupForm onSubmit={handlePasswordSubmit} />
      </div>

      <PaymentGatewayDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        package={{
          name: "Valor Pro Rata",
          credits: 0,
          price: 99.90
        }}
      />
    </div>
  );
}
