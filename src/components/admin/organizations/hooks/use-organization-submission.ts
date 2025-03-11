
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { 
  createOrganization, 
  handleMensalidadeCreation, 
  sendOnboardingEmail,
  mapToOrganizationType 
} from "../api/organization-api";
import { createInactiveSubscription } from "@/services/subscriptionService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const { user } = useUser();
  const errorHandlers = useFormErrorHandlers();

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      console.log("Processando submissão do formulário de organização:", values);
      
      if (user.role !== "leadly_employee") {
        errorHandlers.handlePermissionError();
        return;
      }

      // Tenta criar a organização
      const { data: newOrganizationData, error: orgError, planName, planPrice } = await createOrganization(values);

      if (orgError) {
        console.error("Erro ao criar organização:", orgError);
        errorHandlers.handleOrganizationCreationError(orgError);
        return;
      }

      if (!newOrganizationData) {
        console.error("Dados da organização não retornados após criação");
        errorHandlers.handleUnexpectedError(new Error("Falha ao receber dados da organização após criação"));
        return;
      }

      console.log("Organização criada com sucesso:", newOrganizationData);

      const organizationFormatted = mapToOrganizationType({
        ...newOrganizationData,
        planName,
        email: values.adminEmail
      });

      try {
        // Create inactive subscription and Stripe customer
        console.log("Criando assinatura inativa para:", organizationFormatted.id);
        const subscription = await createInactiveSubscription(organizationFormatted.id);
        console.log("Assinatura inativa criada:", subscription);
        
        // Calculate mensalidade value and create mensalidade title
        console.log("Criando título de mensalidade");
        const mensalidadeTitle = await handleMensalidadeCreation(organizationFormatted);
        
        if (!mensalidadeTitle) {
          console.error("Falha ao criar título de mensalidade");
        } else {
          console.log("Título de mensalidade criado:", mensalidadeTitle);
        }
        
        const mensalidadeValue = mensalidadeTitle?.value || 0;
        
        try {
          console.log("Enviando email de onboarding");
          const { error: emailError } = await sendOnboardingEmail(
            organizationFormatted.id,
            `${window.location.origin}/confirm-registration/${organizationFormatted.id}`,
            planName || 'Não especificado',
            mensalidadeValue
          );

          if (emailError) {
            console.error("Erro ao enviar email de onboarding:", emailError);
            errorHandlers.handleEmailError(emailError);
          }
        } catch (emailError) {
          console.error("Exceção ao enviar email:", emailError);
          errorHandlers.handleEmailError(emailError);
        }

        errorHandlers.showSuccessToast();
        onSuccess();
      } catch (error) {
        console.error("Erro no processo pós-criação:", error);
        errorHandlers.handlePostCreationError(error);
        // Mesmo com erro no pós-processamento, consideramos que a criação foi bem-sucedida
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro inesperado durante a criação:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return {
    handleSubmit
  };
};
