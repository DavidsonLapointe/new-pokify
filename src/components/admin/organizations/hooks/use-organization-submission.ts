import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { 
  createOrganization, 
  handleProRataCreation, 
  sendOnboardingEmail,
  mapToOrganizationType,
  checkExistingOrganization
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

      // Double-check if CNPJ already exists
      const { exists } = await checkExistingOrganization(values.cnpj);
      if (exists) {
        errorHandlers.handleCnpjExistsError();
        return;
      }

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

      // Create inactive subscription for the new organization with retries
      let subscriptionCreated = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!subscriptionCreated && retryCount < maxRetries) {
        try {
          console.log(`Tentativa ${retryCount + 1} de criar assinatura inativa para organização:`, organizationFormatted.id);
          const inactiveSubscription = await createInactiveSubscription(organizationFormatted.id);
          
          if (inactiveSubscription) {
            console.log("Assinatura inativa criada com sucesso:", inactiveSubscription);
            subscriptionCreated = true;
          } else {
            console.warn(`Tentativa ${retryCount + 1} falhou, aguardando antes de tentar novamente...`);
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1500));
            retryCount++;
          }
        } catch (subscriptionError) {
          console.error(`Erro na tentativa ${retryCount + 1} de criar assinatura:`, subscriptionError);
          retryCount++;
          
          if (retryCount < maxRetries) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1500));
          } else {
            console.error("Falha ao criar assinatura inativa após todas as tentativas");
            toast.error("Erro ao criar assinatura. Tente novamente ou contate o suporte.");
          }
        }
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
