
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";
import { toast } from "sonner";

// Function to ensure status is one of the allowed values
const correctedStatus = (status: string): OrganizationStatus => {
  if (status === "active" || status === "pending" || status === "inactive") {
    return status as OrganizationStatus;
  }
  return "pending";
};

// Function to ensure pending_reason is one of the allowed values
const correctedPendingReason = (reason: string | null): OrganizationPendingReason => {
  if (reason === "contract_signature" || 
      reason === "mensalidade_payment" || 
      reason === "user_validation" || 
      reason === null) {
    return reason as OrganizationPendingReason;
  }
  return "user_validation";
};

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const { user } = useUser();
  const { 
    handlePermissionError, 
    handleCnpjExistsError, 
    handleOrganizationCreationError, 
    handleUnexpectedError,
    showSuccessToast 
  } = useFormErrorHandlers();

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      console.log("==========================================");
      console.log("🚀 INICIANDO CRIAÇÃO DE ORGANIZAÇÃO:", values);
      
      // Check user permissions
      if (!user || user.role !== "leadly_employee") {
        console.error("❌ Permissão negada: usuário não é funcionário Leadly", user);
        handlePermissionError();
        return;
      }

      // Check if organization with this CNPJ already exists
      console.log("🔍 Verificando CNPJ existente:", values.cnpj);
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id, cnpj')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (checkError) {
        console.error("❌ Erro ao verificar CNPJ existente:", checkError);
        handleOrganizationCreationError(checkError);
        return;
      }

      if (existingOrg) {
        console.log("❌ CNPJ já existe:", existingOrg);
        handleCnpjExistsError();
        return;
      }

      // Create object with required fields - ensuring a clean object without undefined values
      const orgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        plan: values.plan,
        status: "pending" as OrganizationStatus,
        nome_fantasia: values.nomeFantasia,
        phone: values.phone || '',  // Ensure phone is never undefined
        admin_phone: values.adminPhone || '',  // Ensure admin_phone is never undefined
        contract_status: 'completed', // Contract step is now skipped
        payment_status: 'pending',
        registration_status: 'pending',
        pending_reason: 'user_validation' as OrganizationPendingReason
      };

      console.log("📝 Inserindo organização com dados:", JSON.stringify(orgData, null, 2));
      
      // Loga a sessão e as credenciais do usuário para debug
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("🔑 Sessão atual:", sessionData ? "Autenticado" : "Não autenticado");
      console.log("👤 Usuário atual:", user ? `${user.id} (${user.role})` : "Sem usuário");
      
      // Insert the organization with standard insert operation
      const { data: insertedOrg, error: insertError } = await supabase
        .from('organizations')
        .insert(orgData)
        .select('id')
        .single();
      
      if (insertError) {
        console.error("❌ Erro na inserção:", insertError);
        
        // Show specific error message based on error code
        if (insertError.code === '42P10') {
          toast.error("Erro de configuração no banco de dados. Por favor, contate o suporte técnico.");
        } else if (insertError.message && insertError.message.includes("violates row-level security policy")) {
          handlePermissionError();
        } else {
          handleOrganizationCreationError(insertError);
        }
        return;
      }

      if (!insertedOrg || !insertedOrg.id) {
        console.error("❌ Organização criada mas sem ID retornado");
        handleUnexpectedError("Resposta incompleta do servidor ao criar empresa");
        return;
      }

      console.log("✅ Organização criada com sucesso! ID:", insertedOrg.id);

      // Send email to admin
      try {
        console.log("📧 Enviando email para o administrador...");
        const emailResponse = await supabase.functions.invoke('send-organization-emails', {
          body: {
            organizationId: insertedOrg.id,
            type: "onboarding",
            data: {
              confirmationToken: `${window.location.origin}/confirmacao/${insertedOrg.id}`
            }
          }
        });
        
        console.log("📬 Resposta da função de email:", emailResponse);
        
        if (emailResponse.error) {
          console.warn("⚠️ Aviso de envio de email:", emailResponse.error);
          // Continue with success even if email fails
        }
      } catch (emailError) {
        console.error("📭 Falha ao invocar função de email:", emailError);
        // Continue with success, we don't want email failures to block organization creation
      }

      console.log("🏁 Processo de criação concluído com sucesso!");
      showSuccessToast();
      onSuccess();
    } catch (error: any) {
      console.error("❌ Erro inesperado na criação de organização:", error);
      console.error("Detalhes completos do erro:", JSON.stringify(error, null, 2));
      console.error("Stack trace:", new Error().stack);
      handleOrganizationCreationError(error);
      throw error; // Re-throw to allow the calling component to handle it
    }
  };

  return { handleSubmit };
};
