
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

      // Create admin profile manually if the trigger didn't do it
      try {
        // Verificar se o perfil já existe
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', values.adminEmail)
          .eq('organization_id', organizationFormatted.id)
          .maybeSingle();
        
        // Se não existir, criar perfil manualmente
        if (!existingProfile) {
          console.log("Criando perfil do administrador manualmente");
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              email: values.adminEmail,
              name: values.adminName,
              role: 'admin',
              status: 'pending',
              organization_id: organizationFormatted.id,
              phone: values.adminPhone
            });
            
          if (profileError) {
            console.error("Erro ao criar perfil do administrador:", profileError);
          } else {
            console.log("Perfil do administrador criado manualmente com sucesso");
          }
        } else {
          console.log("Perfil do administrador já existe:", existingProfile);
        }
      } catch (profileError) {
        console.error("Erro ao verificar/criar perfil:", profileError);
      }

      // Criar assinatura inativa manualmente se o trigger não o fez
      try {
        // Verificar se já existe uma assinatura
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('organization_id', organizationFormatted.id)
          .maybeSingle();
          
        // Se não existir, criar manualmente
        if (!existingSubscription) {
          console.log("Criando assinatura inativa manualmente");
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert({
              organization_id: organizationFormatted.id,
              status: 'inactive',
              stripe_subscription_id: '',
              stripe_customer_id: ''
            });
            
          if (subscriptionError) {
            console.error("Erro ao criar assinatura inativa:", subscriptionError);
          } else {
            console.log("Assinatura inativa criada manualmente com sucesso");
          }
        } else {
          console.log("Assinatura já existe:", existingSubscription);
        }
      } catch (subscriptionError) {
        console.error("Erro ao verificar/criar assinatura:", subscriptionError);
      }

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
