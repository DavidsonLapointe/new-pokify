
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
      if (user.role !== "leadly_employee") {
        errorHandlers.handlePermissionError();
        return;
      }

      const { data: newOrganizationData, error: orgError, planName } = await createOrganization(values);

      if (orgError) {
        errorHandlers.handleOrganizationCreationError(orgError);
        return;
      }

      const organizationFormatted = mapToOrganizationType({
        ...newOrganizationData,
        planName,  // Add plan name from creation response
        email: values.adminEmail // Use admin email as organization email
      });

      try {
        // Create inactive subscription and Stripe customer
        const subscription = await createInactiveSubscription(organizationFormatted.id);
        console.log("Assinatura inativa criada:", subscription);
        
        // Calculate mensalidade value and create mensalidade title
        const mensalidadeTitle = await handleMensalidadeCreation(organizationFormatted);
        
        if (!mensalidadeTitle) {
          console.error("Falha ao criar título de mensalidade");
        }
        
        const mensalidadeValue = mensalidadeTitle?.value || 0;
        
        try {
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
          errorHandlers.handleEmailError(emailError);
        }

        errorHandlers.showSuccessToast();
        onSuccess();
      } catch (error) {
        errorHandlers.handlePostCreationError(error);
        onSuccess();
      }
    } catch (error: any) {
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return {
    handleSubmit
  };
};
