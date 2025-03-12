
import { supabase } from "@/integrations/supabase/client";
import { type CreateOrganizationFormData } from "../schema";
import { type OrganizationStatus } from "@/types/organization-types";
import { toast } from "sonner";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Dados mínimos necessários para criar uma organização
      const orgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_email: values.adminEmail,
        admin_name: values.adminName,
        plan: values.plan,
        status: "pending" as OrganizationStatus,
        nome_fantasia: values.nomeFantasia,
        phone: values.phone,
        admin_phone: values.adminPhone
      };

      console.log("📝 Tentando criar organização com dados:", JSON.stringify(orgData, null, 2));

      // First check if an organization with this CNPJ already exists
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (checkError) {
        console.error("❌ Erro ao verificar existência da organização:", checkError);
        toast.error("Erro ao verificar se CNPJ já está cadastrado");
        throw checkError;
      }

      if (existingOrg) {
        console.error("❌ Organização com este CNPJ já existe:", existingOrg);
        toast.error(`CNPJ já cadastrado para empresa "${existingOrg.name}"`);
        throw new Error(`CNPJ já cadastrado para empresa "${existingOrg.name}"`);
      }

      // If no existing organization, proceed with insert
      const { data: insertedOrg, error: insertError } = await supabase
        .from('organizations')
        .insert(orgData)
        .select('id')
        .single();

      if (insertError) {
        console.error("❌ Erro ao inserir organização:", insertError);
        toast.error("Erro ao criar organização: " + insertError.message);
        throw insertError;
      }

      if (!insertedOrg?.id) {
        console.error("❌ Organização criada mas nenhum ID foi retornado");
        toast.error("Organização criada mas nenhum ID foi retornado");
        throw new Error("Organização criada mas nenhum ID foi retornado");
      }

      console.log("✅ Organização criada com sucesso! ID:", insertedOrg.id);
      toast.success("Organização criada com sucesso!");
      onSuccess();

    } catch (error) {
      console.error("❌ Erro ao criar organização:", error);
      throw error;
    }
  };

  return { handleSubmit };
};
