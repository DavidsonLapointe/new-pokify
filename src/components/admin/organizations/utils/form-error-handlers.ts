
import { useToast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export const useFormErrorHandlers = () => {
  const { toast } = useToast();

  const handlePermissionError = () => {
    toast({
      title: "Acesso negado",
      description: "Apenas funcionários Leadly podem criar organizações",
      variant: "destructive",
    });
  };

  const handleCnpjExistsError = () => {
    toast({
      title: "CNPJ já cadastrado",
      description: "Já existe uma empresa cadastrada com este CNPJ.",
      variant: "destructive",
    });
  };

  const handleOrganizationCreationError = (error: PostgrestError) => {
    console.error("Erro ao criar organização:", error);
    let errorMessage = "Não foi possível criar a empresa.";
    
    if (error.code === "23505" && error.message.includes("organizations_cnpj_key")) {
      errorMessage = "CNPJ já cadastrado no sistema.";
    }
    
    toast({
      title: "Erro ao criar empresa",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleEmailError = (error: any) => {
    console.error("Erro ao enviar email:", error);
    toast({
      title: "Aviso",
      description: "Empresa criada, mas houve um erro ao enviar o email. Nossa equipe será notificada.",
      variant: "destructive",
    });
  };

  const handlePostCreationError = (error: any) => {
    console.error("Erro ao processar pós-criação da empresa:", error);
    
    toast({
      title: "Empresa criada parcialmente",
      description: "A empresa foi criada, mas houve um erro no processamento. A equipe será notificada.",
      variant: "destructive",
    });
  };

  const handleUnexpectedError = (error: any) => {
    console.error("Erro não tratado ao criar empresa:", error);
    toast({
      title: "Erro ao criar empresa",
      description: "Não foi possível criar a empresa. Tente novamente.",
      variant: "destructive",
    });
  };

  const showSuccessToast = () => {
    toast({
      title: "Empresa criada com sucesso",
      description: "Um email será enviado para o administrador contendo todas as instruções de onboarding.",
    });
  };

  return {
    handlePermissionError,
    handleCnpjExistsError,
    handleOrganizationCreationError,
    handleEmailError,
    handlePostCreationError,
    handleUnexpectedError,
    showSuccessToast
  };
};
