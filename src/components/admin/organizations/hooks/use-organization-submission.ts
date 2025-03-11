
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

      // Verificar se o CNPJ está formatado corretamente
      console.log("Verificando CNPJ:", values.cnpj);
      
      // Primeiro, verificar se a empresa já existe com esse CNPJ
      const { exists, error: checkError } = await checkExistingOrganization(values.cnpj);
      
      if (checkError) {
        console.error("Erro ao verificar CNPJ existente:", checkError);
        errorHandlers.handleUnexpectedError(checkError);
        return;
      }
      
      if (exists) {
        console.error("CNPJ já cadastrado no sistema");
        errorHandlers.handleCnpjExistsError();
        return;
      }
      
      // Get the plan name for reference
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('name, price')
        .eq('id', values.plan)
        .single();
        
      if (planError) {
        console.error("Erro ao buscar detalhes do plano:", planError);
        errorHandlers.handleUnexpectedError(planError);
        return;
      }
      
      const planName = planData?.name || 'Não especificado';
      const planPrice = planData?.price || 0;
      
      // Try to create the organization
      console.log("Iniciando criação da organização");
      
      const insertData = {
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        plan: values.plan,
        status: "pending",
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        admin_phone: values.adminPhone,
        email: values.adminEmail,
        contract_status: 'pending',
        payment_status: 'pending',
        registration_status: 'pending',
        pending_reason: 'user_validation'
      };

      console.log("Dados de inserção preparados:", insertData);
      
      const { data: newOrganization, error: insertError } = await supabase
        .from('organizations')
        .insert(insertData)
        .select()
        .single();
        
      if (insertError) {
        console.error("Erro ao criar organização:", insertError);
        
        if (insertError.code === "23505" && 
            insertError.message && 
            insertError.message.includes("organizations_cnpj_key")) {
          errorHandlers.handleCnpjExistsError();
        } else {
          errorHandlers.handleOrganizationCreationError(insertError);
        }
        return;
      }
      
      console.log("Organização criada com sucesso:", newOrganization);
      
      try {
        // Send confirmation email via Supabase Edge Function
        const confirmationUrl = `${window.location.origin}/confirm-registration/${newOrganization.id}`;
        
        const { error: emailError } = await supabase.functions.invoke('send-organization-emails', {
          body: {
            organizationId: newOrganization.id,
            type: 'onboarding',
            data: {
              confirmationToken: confirmationUrl,
              planName,
              mensalidadeAmount: planPrice
            }
          }
        });
        
        if (emailError) {
          console.error("Erro ao enviar e-mail:", emailError);
          toast.error("Organização criada, mas houve um erro ao enviar o e-mail de confirmação.");
        } else {
          console.log("E-mail de onboarding enviado com sucesso");
          toast.success("Empresa criada com sucesso! Um e-mail foi enviado com as instruções de acesso.");
        }
      } catch (emailError) {
        console.error("Exceção ao enviar e-mail:", emailError);
        toast.error("Organização criada, mas houve um erro ao enviar o e-mail de confirmação.");
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Erro inesperado durante a criação:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return {
    handleSubmit
  };
};

// Função auxiliar para verificar CNPJ existente
async function checkExistingOrganization(cnpj: string) {
  try {
    console.log("Verificando se CNPJ já existe:", cnpj);
    
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('cnpj', cnpj)
      .maybeSingle();
      
    if (error) {
      console.error("Erro na verificação de CNPJ:", error);
      return { exists: false, error };
    }
    
    return { 
      exists: !!data, 
      data, 
      error: null 
    };
  } catch (error) {
    console.error("Erro ao verificar CNPJ existente:", error);
    return { exists: false, error };
  }
}
