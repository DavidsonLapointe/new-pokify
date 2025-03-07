
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { 
  createOrganization, 
  handleProRataCreation, 
  sendOnboardingEmail,
  mapToOrganizationType 
} from "../api/organization-api";
import { createInactiveSubscription } from "@/services/subscriptionService";
import { toast } from "sonner";

/**
 * Hook for handling organization form submission logic
 */
export const useOrganizationSubmission = (onSuccess: () => void) => {
  const { user } = useUser();
  const errorHandlers = useFormErrorHandlers();

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Verify user permission
      if (user.role !== "leadly_employee") {
        errorHandlers.handlePermissionError();
        return;
      }

      console.log("Iniciando criação da organização:", values);

      // Check if email domain might have delivery issues
      const emailDomain = values.adminEmail.split('@')[1].toLowerCase();
      const problematicDomains = ['uol.com.br', 'bol.com.br', 'terra.com.br'];
      
      if (problematicDomains.includes(emailDomain)) {
        console.warn(`⚠️ Warning: Using potentially problematic email domain: ${emailDomain}`);
      }

      // Create organization
      const { data: newOrganizationData, error: orgError, planName } = await createOrganization(values);

      if (orgError) {
        errorHandlers.handleOrganizationCreationError(orgError);
        return;
      }

      console.log("Organização criada com sucesso:", newOrganizationData);

      // Convert DB organization to Organization type and add plan name
      const organizationFormatted = mapToOrganizationType({
        ...newOrganizationData,
        planName: planName // Inject plan name from the creation response
      });

      // Create inactive subscription for the new organization
      try {
        console.log("Tentando criar assinatura inativa para organização:", organizationFormatted.id);
        
        // Try multiple times with a small delay between attempts
        let attempts = 0;
        const maxAttempts = 3;
        let inactiveSubscription = null;
        
        while (attempts < maxAttempts && !inactiveSubscription) {
          attempts++;
          try {
            inactiveSubscription = await createInactiveSubscription(organizationFormatted.id);
            
            if (inactiveSubscription) {
              console.log("Assinatura inativa criada com sucesso na tentativa", attempts, ":", inactiveSubscription);
              break;
            } else {
              console.log("Tentativa", attempts, "falhou, aguardando antes de tentar novamente...");
              // Wait a bit before next attempt
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (subscriptionAttemptError) {
            console.error("Erro na tentativa", attempts, ":", subscriptionAttemptError);
            // Wait a bit before next attempt
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (!inactiveSubscription) {
          console.error("Falha ao criar assinatura inativa após", maxAttempts, "tentativas");
          toast.error("Erro ao criar assinatura. Tente novamente ou contate o suporte.");
        }
      } catch (subscriptionError) {
        console.error("Erro ao criar assinatura inativa:", subscriptionError);
        toast.error("Erro ao criar assinatura. O processo continuará, mas pode haver problemas no pagamento.");
        // Continue with the flow even if subscription creation fails
      }

      // Calculate pro-rata value and create pro-rata title
      try {
        // Create pro-rata title
        const proRataTitle = await handleProRataCreation(organizationFormatted);

        console.log("Título pro-rata criado:", proRataTitle);

        if (!proRataTitle) {
          console.error("Falha ao criar título pro-rata");
        }
        
        // Get pro-rata value from the title creation process
        const proRataValue = proRataTitle?.value || 0;
        
        // Send single onboarding email with all links
        try {
          console.log("Enviando email único de onboarding...");
          const { error: emailError } = await sendOnboardingEmail(
            organizationFormatted.id,
            `${window.location.origin}/contract/${organizationFormatted.id}`,
            `${window.location.origin}/confirm-registration/${organizationFormatted.id}`,
            `${window.location.origin}/payment/${organizationFormatted.id}`,
            proRataValue
          );

          if (emailError) {
            // Check if it's a provider-specific issue
            if (emailError.status === 422 && emailError.details?.includes(emailDomain)) {
              console.error(`Erro ao enviar email para provedor ${emailDomain}:`, emailError);
              errorHandlers.handleEmailProviderIssue(emailDomain);
            } else {
              console.error("Erro ao enviar email de onboarding:", emailError);
              errorHandlers.handleEmailError(emailError);
            }
          } else {
            console.log("Email de onboarding enviado com sucesso");
          }
        } catch (emailError) {
          errorHandlers.handleEmailError(emailError);
          // Continue with success flow even if email fails
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
