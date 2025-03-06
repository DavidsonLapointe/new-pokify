
import { RemainingStepsCard } from "./RemainingStepsCard";

interface SetupCompletedProps {
  organizationId: string;
  contractSigned: boolean;
  paymentCompleted: boolean;
}

export const SetupCompleted = ({ 
  organizationId, 
  contractSigned, 
  paymentCompleted 
}: SetupCompletedProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-primary mb-2">Leadly</h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Cadastro Concluído
          </h2>
          <p className="text-gray-600 mt-2">
            Sua senha foi definida com sucesso!
          </p>
        </div>
        
        <RemainingStepsCard 
          organizationId={organizationId}
          contractSigned={contractSigned}
          paymentCompleted={paymentCompleted}
          registrationCompleted={true} // This step is now completed
          hideHomeButton={true}
        />
      </div>
    </div>
  );
};
