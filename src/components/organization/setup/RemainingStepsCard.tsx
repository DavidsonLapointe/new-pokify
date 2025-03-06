
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface RemainingStepsProps {
  organizationId: string;
  contractSigned: boolean;
  paymentCompleted: boolean;
  registrationCompleted: boolean;
}

export const RemainingStepsCard: React.FC<RemainingStepsProps> = ({
  organizationId,
  contractSigned,
  paymentCompleted,
  registrationCompleted,
}) => {
  const navigate = useNavigate();
  
  // Count completed steps
  const completedSteps = [contractSigned, paymentCompleted, registrationCompleted].filter(Boolean).length;
  const allStepsCompleted = completedSteps === 3;
  
  if (allStepsCompleted) {
    return (
      <Card className="bg-green-50 border-green-200 mb-6">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Parabéns! Todas as etapas foram concluídas.
          </h3>
          <p className="text-green-700 mb-4">
            Sua conta está ativa. Você já pode acessar a plataforma.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Ir para a página inicial
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          Próximos passos ({completedSteps}/3 concluídos)
        </h3>
        <p className="text-blue-700 mb-4">
          Complete as etapas abaixo para ativar sua conta:
        </p>
        
        <div className="space-y-3">
          {!contractSigned && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">1. Assinar Contrato</p>
                <p className="text-sm text-gray-500">Revise e assine o contrato de adesão</p>
              </div>
              <Button 
                onClick={() => navigate(`/contract/${organizationId}`)}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Assinar Contrato
              </Button>
            </div>
          )}
          
          {!paymentCompleted && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">2. Realizar Pagamento</p>
                <p className="text-sm text-gray-500">Efetue o pagamento pro-rata</p>
              </div>
              <Button 
                onClick={() => navigate(`/payment/${organizationId}`)}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Realizar Pagamento
              </Button>
            </div>
          )}
          
          {!registrationCompleted && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">3. Completar Cadastro</p>
                <p className="text-sm text-gray-500">Defina sua senha e confirme seus dados</p>
              </div>
              <Button 
                onClick={() => navigate(`/organization/setup?token=${organizationId}`)}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Completar Cadastro
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
