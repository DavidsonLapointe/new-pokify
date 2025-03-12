
import { toast } from "sonner";

export const useFormErrorHandlers = () => {
  const handlePermissionError = () => {
    toast.error("Acesso negado: Apenas funcionários Leadly podem criar organizações");
  };

  const handleCnpjExistsError = () => {
    toast.error("CNPJ já cadastrado: Já existe uma empresa cadastrada com este CNPJ.");
  };

  const handleOrganizationCreationError = (error: any) => {
    console.error("Error creating organization:", error);
    let errorMessage = "Não foi possível criar a empresa.";
    
    if (error.code === "23505" && error.message && error.message.includes("organizations_cnpj_key")) {
      errorMessage = "CNPJ já cadastrado no sistema.";
    } else if (error.code === "42P10") {
      errorMessage = "Erro de configuração no banco de dados. Por favor, contate o suporte.";
    } else if (error.message && error.message.includes("violates row-level security policy")) {
      errorMessage = "Erro de permissão: Você não tem permissão para criar organizações.";
    } else if (error.message && error.message.includes("constraint")) {
      errorMessage = "Erro de estrutura do banco de dados. Por favor, contate o suporte técnico.";
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(`Erro ao criar empresa: ${errorMessage}`);
  };

  const handleDatabaseConfigError = () => {
    console.error("Database configuration error detected");
    toast.error("Erro de configuração no banco de dados. Por favor, contate o suporte técnico.");
  };

  const handleEmailError = (error: any) => {
    console.error("Error sending email:", error);
    toast.error("Empresa criada, mas houve um erro ao enviar o email. Nossa equipe será notificada.");
  };

  const handleEmailProviderIssue = (domain: string) => {
    console.error(`Known delivery issue with provider: ${domain}`);
    toast.error(`Empresa criada com sucesso, mas detectamos que o email ${domain} pode ter problemas de recebimento. Considere usar um Gmail ou outro provedor como alternativa.`);
  };

  const handlePostCreationError = (error: any) => {
    console.error("Error processing post-creation of company:", error);
    toast.error("Empresa criada parcialmente. A empresa foi criada, mas houve um erro no processamento. A equipe será notificada.");
  };

  const handleUnexpectedError = (error: any) => {
    console.error("Unhandled error when creating company:", error);
    let errorMessage = "Não foi possível criar a empresa. Tente novamente.";
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(`Erro ao criar empresa: ${errorMessage}`);
  };

  const showSuccessToast = () => {
    toast.success("Empresa criada com sucesso! Um email será enviado para o administrador contendo todas as instruções de onboarding.");
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
