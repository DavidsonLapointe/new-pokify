
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
      console.log("Processando submissão de organização:", values);
      
      // Verificar permissões do usuário
      if (!user || user.role !== "leadly_employee") {
        console.error("Permissão negada: usuário não é funcionário Leadly");
        errorHandlers.handlePermissionError();
        return;
      }

      // Verificar se já existe organização com este CNPJ
      console.log("Verificando CNPJ existente:", values.cnpj);
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

      // Criando objeto com os campos obrigatórios
      const orgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        plan: values.plan,
        status: correctedStatus("pending"),
        nome_fantasia: values.nomeFantasia,
        phone: values.phone,
        admin_phone: values.adminPhone
      };

      console.log("Inserindo organização com dados:", orgData);
      
      // Inserção com tratamento de erro detalhado
      const { data: insertedOrg, error: insertError } = await supabase
        .from('organizations')
        .insert(orgData)
        .select('id')
        .single();

      if (insertError) {
        console.error("Erro na inserção da organização:", insertError);
        
        // Tratamento específico com base no código de erro
        if (insertError.code === '23505') {
          console.error("Violação de restrição de unicidade (provavelmente CNPJ)");
          errorHandlers.handleCnpjExistsError();
        } else if (insertError.message && insertError.message.includes("violates row-level security policy")) {
          console.error("Violação de política RLS - verifique permissões");
          toast({
            title: "Erro de permissão",
            description: "Você não tem permissão para criar organizações. Verifique suas credenciais.",
            variant: "destructive",
          });
        } else {
          errorHandlers.handleDatabaseConfigError();
        }
        return;
      }

      console.log("Organização criada com sucesso:", insertedOrg);
      errorHandlers.showSuccessToast();
      onSuccess();

    } catch (error: any) {
      console.error("Erro inesperado na criação de organização:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return { handleSubmit };
};
