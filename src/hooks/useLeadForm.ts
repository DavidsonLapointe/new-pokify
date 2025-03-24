
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { leadFormSchema, LeadFormData } from "@/schemas/leadFormSchema";
import { supabase } from "@/integrations/supabase/client";

interface UseLeadFormProps {
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  onCreateLead: (data: LeadFormData) => void;
  onSuccess?: () => void;
}

export const useLeadForm = ({
  onCreateLead,
  onSuccess,
}: UseLeadFormProps) => {
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      // Remove default values for personType and leadType
      // to show placeholders instead
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      cpf: "",
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  const personType = form.watch("personType");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    }
    
    form.setValue("phone", value);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (personType === "pf" && value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (personType === "pj" && value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }
    
    const field = personType === "pf" ? "cpf" : "cnpj";
    form.setValue(field, value);
  };

  const onSubmit = async (data: LeadFormData) => {
    if (!data.phone && !data.email) {
      toast({
        variant: "destructive",
        title: "Erro ao criar lead",
        description: "É necessário fornecer pelo menos um meio de contato (telefone ou email).",
      });
      return;
    }

    try {
      // Obter o organization_id do usuário logado
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase
        .from('organization_leads')
        .insert({
          organization_id: profileData.organization_id,
          person_type: data.personType,
          lead_type: data.leadType,
          first_name: data.firstName,
          last_name: data.lastName,
          razao_social: data.razaoSocial,
          nome_fantasia: data.nomeFantasia,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          cnpj: data.cnpj,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          status: 'pending',
          temperature: 0,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      onCreateLead(data);
      form.reset();
      onSuccess?.();
      
      toast({
        title: "Lead criado com sucesso",
        description: "Você já pode iniciar o contato.",
      });
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar lead",
        description: "Ocorreu um erro ao tentar criar o lead. Por favor, tente novamente.",
      });
    }
  };

  return {
    form,
    personType,
    handlePhoneChange,
    handleDocumentChange,
    onSubmit,
  };
};
