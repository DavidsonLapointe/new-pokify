
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";

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
      
      if (!user || user.role !== "leadly_employee") {
        console.error("❌ Permissão negada: usuário não é funcionário Leadly", user);
        handlePermissionError();
        throw new Error("Permission denied");
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
        throw checkError;
      }

      if (existingOrg) {
        console.log("❌ CNPJ já existe:", existingOrg);
        handleCnpjExistsError();
        throw new Error("CNPJ already exists");
      }

      // Create organization
      const orgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        plan: values.plan,
        status: "pending" as OrganizationStatus,
        nome_fantasia: values.nomeFantasia,
        phone: values.phone || '',
        admin_phone: values.adminPhone || '',
        contract_status: 'completed',
        payment_status: 'pending',
        registration_status: 'pending',
        pending_reason: 'user_validation' as OrganizationPendingReason
      };

      console.log("📝 Inserindo organização com dados:", JSON.stringify(orgData, null, 2));

      const { data: insertedOrg, error: insertError } = await supabase
        .from('organizations')
        .insert(orgData)
        .select('id')
        .single();

      if (insertError) {
        console.error("❌ Erro na inserção:", insertError);
        handleOrganizationCreationError(insertError);
        throw insertError;
      }

      if (!insertedOrg?.id) {
        const error = new Error("Organization created but no ID returned");
        console.error("❌ Erro:", error);
        handleUnexpectedError(error);
        throw error;
      }

      console.log("✅ Organização criada com sucesso! ID:", insertedOrg.id);

      // Send email
      try {
        console.log("📧 Enviando email para o administrador...");
        await supabase.functions.invoke('send-organization-emails', {
          body: {
            organizationId: insertedOrg.id,
            type: "onboarding",
            data: {
              confirmationToken: `${window.location.origin}/confirmacao/${insertedOrg.id}`
            }
          }
        });
      } catch (emailError) {
        console.warn("⚠️ Erro ao enviar email:", emailError);
        // Continue with success even if email fails
      }

      console.log("🏁 Processo de criação concluído com sucesso!");
      showSuccessToast();
      onSuccess();
    } catch (error) {
      console.error("❌ Erro inesperado:", error);
      throw error; // Re-throw to allow the calling component to handle it
    }
  };

  return { handleSubmit };
};
