
import { supabase } from "@/integrations/supabase/client";
import { type CreateOrganizationFormData } from "../schema";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Simplified organization data with only required fields
      const orgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        plan: values.plan,
        status: "pending",
        nome_fantasia: values.nomeFantasia,
        phone: values.phone || '',
        admin_phone: values.adminPhone || ''
      };

      console.log("📝 Tentando criar organização com dados:", JSON.stringify(orgData, null, 2));

      const { data: insertedOrg, error: insertError } = await supabase
        .from('organizations')
        .insert(orgData)
        .select('id')
        .single();

      if (insertError) {
        console.error("❌ Erro ao inserir organização:", insertError);
        throw insertError;
      }

      if (!insertedOrg?.id) {
        throw new Error("Organização criada mas nenhum ID foi retornado");
      }

      console.log("✅ Organização criada com sucesso! ID:", insertedOrg.id);
      onSuccess();

    } catch (error) {
      console.error("❌ Erro ao criar organização:", error);
      throw error;
    }
  };

  return { handleSubmit };
};
