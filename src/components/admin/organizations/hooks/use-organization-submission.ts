import { useState } from "react";
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { type CreateOrganizationFormData } from "../schema";
import { 
  createOrganization, 
  handleProRataCreation, 
  sendOnboardingEmail,
  mapToOrganizationType 
} from "../api/organization-api";
import { createInactiveSubscription } from "@/services/subscriptionService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/realClient";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Hook for handling organization form submission logic
 */
export const useOrganizationSubmission = (onSuccess: () => void) => {
  const errorHandlers = useFormErrorHandlers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      setIsSubmitting(true);
      console.log("%c 🚀 INICIANDO SUBMISSÃO DO FORMULÁRIO DE NOVA EMPRESA", "background: #8e44ad; color: white; padding: 5px; font-weight: bold; border-radius: 5px;");
      console.log("%c Dados completos do formulário:", "font-weight: bold;", values);
      console.log("%c Módulos selecionados:", "font-weight: bold;", values.modules || []);
      
      // Não verifica mais o tipo de usuário, permitindo qualquer usuário criar empresa
      
      console.log("%c 📋 Dados da organização:", "color: #3498db;", {
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        cnpj: values.cnpj,
        email: values.email,
        phone: values.phone,
        plan: values.plan
      });
      console.log("%c 👤 Dados do administrador:", "color: #3498db;", {
        adminName: values.adminName,
        adminEmail: values.adminEmail
      });
      console.log("%c 📦 Módulos selecionados:", "color: #3498db;", values.modules || []);

      // Check if email domain might have delivery issues
      let emailDomain = "";
      if (values.adminEmail && values.adminEmail.includes('@')) {
        emailDomain = values.adminEmail.split('@')[1].toLowerCase();
        const problematicDomains = ['uol.com.br', 'bol.com.br', 'terra.com.br'];
        
        if (problematicDomains.includes(emailDomain)) {
          console.warn("%c ⚠️ Usando provedor de email potencialmente problemático:", "color: orange;", emailDomain);
        }
      }

      // Check if organization with same CNPJ already exists before trying to create
      console.log("%c 🔍 Verificando se CNPJ já existe...", "color: #3498db;", values.cnpj);
      const { data: existingOrgs, error: checkError } = await supabase
        .from('organization')
        .select('id, cnpj')
        .eq('cnpj', values.cnpj.replace(/[^0-9]/g, ''))
        .limit(1);
        
      console.log("%c Resultado da verificação prévia de CNPJ:", "font-weight: bold;", {
        organizacoes: existingOrgs,
        erro: checkError
      });
        
      if (checkError) {
        console.error("%c ❌ Erro ao verificar existência de CNPJ:", "color: red;", checkError);
      }
      
      if (existingOrgs && existingOrgs.length > 0) {
        console.error("%c ❌ CNPJ duplicado encontrado:", "color: red;", `Organização com CNPJ ${values.cnpj} já existe`, existingOrgs[0]);
        errorHandlers.handleDuplicateOrganizationError(checkError as PostgrestError || {
          message: `Organização com CNPJ ${values.cnpj} já existe.`,
          details: '',
          hint: '',
          code: 'DUPLICATE_ENTRY',
          name: 'PostgrestError'
        } as PostgrestError);
        setIsSubmitting(false);
        return;
      }

      // Create organization
      console.log("%c 🏢 Criando organização...", "color: #3498db;");
      const createResult = await createOrganization(values);
      console.log("%c Resultado da criação:", "font-weight: bold;", createResult);
      
      console.log("%c Verificando resultado da criação da organização...", "color: #3498db;");
      if (createResult.error) {
        console.error("%c ❌ Erro ao criar organização:", "color: red;", createResult.error);
        errorHandlers.handleOrganizationCreationError(createResult.error as PostgrestError || {
          message: createResult.error.message || "Erro ao criar organização",
          details: createResult.error.details || '',
          hint: '',
          code: 'ERROR',
          name: 'PostgrestError'
        } as PostgrestError);
        setIsSubmitting(false);
        return;
      }

      if (!createResult.data) {
        console.error("%c ❌ Erro: Nenhum dado retornado após criação da organização", "color: red;");
        errorHandlers.handleOrganizationCreationError({
          message: "Erro desconhecido ao criar organização",
          details: '',
          hint: '',
          code: 'ERROR',
          name: 'PostgrestError'
        } as PostgrestError);
        setIsSubmitting(false);
        return;
      }

      console.log("%c ✅ Organização criada com sucesso:", "color: green;", createResult.data);
      
      // Convert DB organization to Organization type and add plan name
      const organizationFormatted = mapToOrganizationType({
        ...createResult.data,
        planName: createResult.planName // Inject plan name from the creation response
      });

      // Create inactive subscription for the new organization with retries
      console.log("%c 💳 Criando assinatura inativa...", "color: #3498db;");
      let subscriptionCreated = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!subscriptionCreated && retryCount < maxRetries) {
        try {
          console.log(`%c 🔄 Tentativa ${retryCount + 1} de criar assinatura inativa`, "color: #3498db;", `ID da organização: ${organizationFormatted.id}`);
          const inactiveSubscription = await createInactiveSubscription(organizationFormatted.id);
          
          console.log("%c Resultado da criação de assinatura:", "font-weight: bold;", inactiveSubscription);
          
          if (inactiveSubscription) {
            console.log("%c ✅ Assinatura inativa criada com sucesso:", "color: green;", inactiveSubscription);
            subscriptionCreated = true;
          } else {
            console.warn(`%c ⚠️ Tentativa ${retryCount + 1} falhou`, "color: orange;", "Aguardando antes de tentar novamente...");
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1500));
            retryCount++;
          }
        } catch (subscriptionError) {
          console.error(`%c ❌ Erro na tentativa ${retryCount + 1} de criar assinatura:`, "color: red;", subscriptionError);
          retryCount++;
          
          if (retryCount < maxRetries) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1500));
          } else {
            console.error("%c ❌ Falha ao criar assinatura inativa após todas as tentativas", "color: red;");
            toast.error("Erro ao criar assinatura. Tente novamente ou contate o suporte.");
          }
        }
      }

      // Calculate pro-rata value and create pro-rata title
      try {
        // Create pro-rata title
        console.log("%c 💰 Criando título pro-rata...", "color: #3498db;");
        const proRataTitle = await handleProRataCreation(organizationFormatted);

        console.log("%c Título pro-rata criado:", "font-weight: bold;", proRataTitle);

        if (!proRataTitle) {
          console.error("%c ❌ Falha ao criar título pro-rata", "color: red;");
        }
        
        // Get pro-rata value from the title creation process
        const proRataValue = proRataTitle?.value || 0;
        
        // Send single onboarding email with all links and selected modules
        try {
          console.log("%c 📧 Enviando email único de onboarding...", "color: #3498db;", {
            organizationId: organizationFormatted.id,
            proRataValue: proRataValue,
            modules: values.modules
          });
          
          const emailData = {
            organizationId: organizationFormatted.id,
            contractLink: `${window.location.origin}/contract/${organizationFormatted.id}`,
            confirmRegistrationLink: `${window.location.origin}/confirm-registration/${organizationFormatted.id}`,
            paymentLink: `${window.location.origin}/payment/${organizationFormatted.id}`,
            proRataValue: proRataValue,
            modules: values.modules
          };
          
          console.log("%c Dados para o email:", "font-weight: bold;", emailData);
          
          const { error: emailError } = await sendOnboardingEmail(
            organizationFormatted.id,
            `${window.location.origin}/contract/${organizationFormatted.id}`,
            `${window.location.origin}/confirm-registration/${organizationFormatted.id}`,
            `${window.location.origin}/payment/${organizationFormatted.id}`,
            proRataValue,
            values.modules // Pass selected modules to the email function
          );

          console.log("%c Resultado do envio de email:", "font-weight: bold;", { erro: emailError });

          if (emailError) {
            // Check if it's a provider-specific issue
            if (emailDomain && emailError.status === 422 && emailError.details?.includes(emailDomain)) {
              console.error(`%c ❌ Erro ao enviar email para provedor ${emailDomain}:`, "color: red;", emailError);
              errorHandlers.handleEmailProviderIssue(emailDomain);
            } else {
              console.error("%c ❌ Erro ao enviar email de onboarding:", "color: red;", emailError);
              errorHandlers.handleEmailError(emailError);
            }
          } else {
            console.log("%c ✅ Email de onboarding enviado com sucesso", "color: green;");
          }
        } catch (emailError) {
          console.error("%c ❌ Erro ao enviar email:", "color: red;", emailError);
          errorHandlers.handleEmailError(emailError);
          // Continue with success flow even if email fails
        }

        console.log("%c 🎉 PROCESSO DE CRIAÇÃO CONCLUÍDO COM SUCESSO!", "background: #2ecc71; color: white; padding: 5px; font-weight: bold; border-radius: 5px;", {
          organizacao: organizationFormatted.id,
          plano: organizationFormatted.planName,
          modulos: values.modules
        });
        errorHandlers.showSuccessToast();
        onSuccess();
      } catch (error) {
        console.error("%c ❌ Erro após criação da organização:", "background: #e74c3c; color: white; padding: 3px; font-weight: bold; border-radius: 3px;", error);
        errorHandlers.handlePostCreationError(error);
        onSuccess();
      } finally {
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("%c ❌ ERRO INESPERADO DURANTE SUBMISSÃO:", "background: #c0392b; color: white; padding: 5px; font-weight: bold; border-radius: 5px;", error);
      errorHandlers.handleUnexpectedError(error);
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
