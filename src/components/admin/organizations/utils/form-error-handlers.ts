
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

  const handleOrganizationCreationError = (error: PostgrestError | any) => {
    console.error("Erro ao criar organização:", error);
    let errorMessage = "Não foi possível criar a empresa.";
    
    if (error.code === "23505" && error.message && error.message.includes("organizations_cnpj_key")) {
      errorMessage = "CNPJ já cadastrado no sistema.";
    } else if (error.code === "42P10") {
      errorMessage = "Erro de configuração no banco de dados. Por favor, contate o suporte.";
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
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

  const handleEmailProviderIssue = (domain: string) => {
    console.error(`Conhecido problema de entrega com o provedor: ${domain}`);
    toast({
      title: "Empresa criada com sucesso, mas...",
      description: `Detectamos que o email ${domain} pode ter problemas de recebimento. Considere usar um Gmail ou outro provedor como alternativa.`,
      variant: "destructive",
      duration: 8000,
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

  const handleDatabaseConfigError = () => {
    console.error("Erro de configuração no banco de dados detectado");
    
    toast({
      title: "Erro de configuração no banco de dados",
      description: "Há um erro de configuração no banco de dados. Por favor, contate o suporte técnico.",
      variant: "destructive",
      duration: 8000,
    });
  };

  const handleUnexpectedError = (error: any) => {
    console.error("Erro não tratado ao criar empresa:", error);
    let errorMessage = "Não foi possível criar a empresa. Tente novamente.";
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast({
      title: "Erro ao criar empresa",
      description: errorMessage,
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
    handleEmailProviderIssue,
    handlePostCreationError,
    handleDatabaseConfigError,
    handleUnexpectedError,
    showSuccessToast
  };
};
