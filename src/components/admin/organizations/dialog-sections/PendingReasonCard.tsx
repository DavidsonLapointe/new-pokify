
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { OrganizationPendingReason } from "@/types";

interface PendingReasonCardProps {
  pendingReason: OrganizationPendingReason;
}

export const PendingReasonCard = ({ pendingReason }: PendingReasonCardProps) => {
  const getPendingReasonDescription = (reason: string | null | undefined) => {
    if (!reason) return null;

    const reasons: { [key: string]: { description: string, action: string } } = {
      contract_signature: {
        description: "O contrato ainda não foi assinado pelo cliente.",
        action: "Envie um lembrete de assinatura ou entre em contato com o cliente."
      },
      payment: {
        description: "O pagamento não foi confirmado.",
        action: "Verifique o status do pagamento ou entre em contato com o cliente."
      },
      pro_rata_payment: {
        description: "O pagamento pro-rata ainda não foi realizado.",
        action: "Envie um lembrete de pagamento ou entre em contato com o cliente."
      },
      user_validation: {
        description: "O usuário administrador não validou seus dados ou não criou uma senha.",
        action: "Envie um novo e-mail de validação ou entre em contato com o administrador."
      },
      approval: {
        description: "A empresa está aguardando aprovação administrativa.",
        action: "Analise as informações da empresa e aprove-a se estiver tudo correto."
      }
    };

    return reasons[reason] || { 
      description: "Pendência não especificada.", 
      action: "Entre em contato com o suporte técnico."
    };
  };

  const pendingInfo = getPendingReasonDescription(pendingReason);
  
  if (!pendingInfo) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50 mb-4">
      <CardContent className="pt-4">
        <div className="flex gap-2 items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">{pendingInfo.description}</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Ação recomendada: {pendingInfo.action}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
