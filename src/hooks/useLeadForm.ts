
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { leadFormSchema, LeadFormData } from "@/schemas/leadFormSchema";

interface UseLeadFormProps {
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  onCreateLead: (data: LeadFormData) => void;
  onSuccess?: () => void;
}

export const useLeadForm = ({
  hasPhoneIntegration,
  hasEmailIntegration,
  onCreateLead,
  onSuccess,
}: UseLeadFormProps) => {
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      personType: "pf",
      firstName: "",
      lastName: "",
      contactType: hasPhoneIntegration ? "phone" : "email",
      contactValue: "",
      cpf: "",
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      endereco: "",
    },
  });

  const contactType = form.watch("contactType");
  const personType = form.watch("personType");

  const handleContactValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (contactType === "phone") {
      value = value.replace(/\D/g, "");
      
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
      }
    }
    
    form.setValue("contactValue", value);
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

  const onSubmit = (data: LeadFormData) => {
    const canProceed = (data.contactType === "phone" && hasPhoneIntegration) ||
                      (data.contactType === "email" && hasEmailIntegration);

    if (!canProceed) {
      toast({
        variant: "destructive",
        title: "Erro ao criar lead",
        description: `Integração com ${data.contactType === "phone" ? "telefone" : "email"} não configurada.`,
      });
      return;
    }

    onCreateLead(data);
    form.reset();
    onSuccess?.();
    
    toast({
      title: "Lead criado com sucesso",
      description: "Você já pode iniciar o contato.",
    });
  };

  return {
    form,
    contactType,
    personType,
    handleContactValueChange,
    handleDocumentChange,
    onSubmit,
  };
};
