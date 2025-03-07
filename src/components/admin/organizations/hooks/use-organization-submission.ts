
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

      // Criar assinatura inativa para a nova organização
      const inactiveSubscription = await createInactiveSubscription(organizationFormatted.id);
      
      if (inactiveSubscription) {
        console.log("Assinatura inativa criada com sucesso:", inactiveSubscription);
      } else {
        console.error("Erro ao criar assinatura inativa");
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
        // Fix: Use 'value' instead of 'amount'
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
