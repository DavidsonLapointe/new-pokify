
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

      // Calculate mensalidade value and create mensalidade title
      try {
        // Create mensalidade title
        const mensalidadeTitle = await handleMensalidadeCreation(organizationFormatted);
        console.log("Título mensalidade criado:", mensalidadeTitle);

        if (!mensalidadeTitle) {
          console.error("Falha ao criar título de mensalidade");
        }
        
        // Get mensalidade value from the title creation process
        const mensalidadeValue = mensalidadeTitle?.value || 0;
        
        // Create inactive subscription and Stripe customer
        const subscription = await createInactiveSubscription(organizationFormatted.id);
        console.log("Assinatura inativa criada:", subscription);
        
        // Send single onboarding email with all links
        try {
          console.log("Enviando email único de onboarding...");
          const { error: emailError } = await sendOnboardingEmail(
            organizationFormatted.id,
            `${window.location.origin}/confirm-registration/${organizationFormatted.id}`,
            planName || 'Não especificado',
            mensalidadeValue
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
