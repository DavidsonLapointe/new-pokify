
import { supabase } from "@/integrations/supabase/client";
import { type CreateOrganizationFormData } from "../schema";
import { type OrganizationStatus } from "@/types/organization-types";
import { toast } from "sonner";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const checkExistingOrganization = async (cnpj: string): Promise<boolean> => {
    try {
      // Garantir que estamos verificando apenas os dígitos do CNPJ
      const cleanedCnpj = cnpj.replace(/[^\d]/g, '');
      
      console.log("Verificando CNPJ na submissão:", cleanedCnpj);
      
      // Verificar se já existe uma organização com este CNPJ
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('cnpj', cleanedCnpj)
        .maybeSingle();
      
      if (error) {
        console.error("❌ Erro ao verificar CNPJ:", error);
        throw error;
      }
      
      return !!data; // Retorna true se uma organização com este CNPJ existir
    } catch (error) {
      console.error("❌ Erro ao verificar CNPJ:", error);
      throw error; // Propagar erro para tratamento adequado
    }
  };

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Limpar CNPJ para garantir formato consistente no banco
      const cleanedCnpj = values.cnpj.replace(/[^\d]/g, '');
      
      // Verificar se já existe uma organização com este CNPJ
      const exists = await checkExistingOrganization(cleanedCnpj);
      
      if (exists) {
        toast.error("Uma organização com este CNPJ já existe no sistema.");
        return;
      }

      // Dados mínimos necessários para criar uma organização
      const orgData = {
        name: values.razaoSocial,
        cnpj: cleanedCnpj, // Usar CNPJ limpo
        admin_email: values.adminEmail,
        admin_name: values.adminName,
        plan: values.plan,
        status: "pending" as OrganizationStatus,
        nome_fantasia: values.nomeFantasia,
        phone: values.phone,
        admin_phone: values.adminPhone
      };

      console.log("📝 Tentando criar organização com dados:", JSON.stringify(orgData, null, 2));

      // Inserção simplificada sem opções adicionais
      const { error } = await supabase
        .from('organizations')
        .insert(orgData);

      if (error) {
        console.error("❌ Erro ao inserir organização:", error);
        
        // Verificar se o erro é de duplicação
        if (error.code === '23505') { // Código para violação de chave única
          toast.error("Uma organização com este CNPJ já existe no sistema.");
        } else {
          toast.error("Erro ao criar organização: " + error.message);
        }
        
        throw error;
      }

      console.log("✅ Organização criada com sucesso!");
      toast.success("Organização criada com sucesso!");
      onSuccess();

    } catch (error) {
      console.error("❌ Erro ao criar organização:", error);
      toast.error("Falha ao criar organização. Por favor, tente novamente.");
      throw error;
    }
  };

  return { handleSubmit };
};
