
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";

// Função para garantir que o status seja um dos valores permitidos
const correctedStatus = (status: string): OrganizationStatus => {
  if (status === "active" || status === "pending" || status === "inactive") {
    return status as OrganizationStatus;
  }
  return "pending";
};

// Função para garantir que pending_reason seja um dos valores permitidos
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
  const errorHandlers = useFormErrorHandlers();

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      console.log("Processando submissão simplificada do formulário:", values);
      
      if (user.role !== "leadly_employee") {
        errorHandlers.handlePermissionError();
        return;
      }

      // Verificar se já existe organização com este CNPJ
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id, cnpj')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (checkError) {
        console.error("Erro ao verificar CNPJ existente:", checkError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }

      if (existingOrg) {
        console.log("CNPJ já existente:", existingOrg);
        errorHandlers.handleCnpjExistsError();
        return;
      }

      // Simplificando - apenas os campos básicos necessários
      const organizationData = {
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        email: values.adminEmail,
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        admin_phone: values.adminPhone || "",
        plan: values.plan,
        status: correctedStatus("pending"),
        pending_reason: correctedPendingReason("user_validation")
      };

      console.log("Tentando inserir organização com dados simplificados:", organizationData);
      
      // Inserção com apenas dados básicos
      const { error: insertError, data: insertedData } = await supabase
        .from('organizations')
        .insert(organizationData)
        .select('id, name')
        .single();

      if (insertError) {
        console.error("Erro ao inserir organização:", insertError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }

      console.log("Organização criada com sucesso:", insertedData);
      errorHandlers.showSuccessToast();
      onSuccess();

    } catch (error: any) {
      console.error("Erro inesperado:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return { handleSubmit };
};
