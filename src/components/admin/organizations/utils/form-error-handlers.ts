
import { toast } from "sonner";

export const useFormErrorHandlers = () => {
  const handlePermissionError = () => {
    console.error("🛑 Erro de permissão: Acesso negado");
    toast.error("Acesso negado: Apenas funcionários Leadly podem criar organizações");
  };

  const handleCnpjExistsError = () => {
    console.error("🛑 Erro de CNPJ: CNPJ já cadastrado");
    toast.error("CNPJ já cadastrado: Já existe uma empresa cadastrada com este CNPJ.");
  };

  const handleOrganizationCreationError = (error: any) => {
    console.error("🛑 Erro ao criar organização:", error);
    console.error("Stack trace:", new Error().stack);
    
    let errorMessage = "Não foi possível criar a empresa.";
    
    if (error.code === "23505" && error.message && error.message.includes("organizations_cnpj_key")) {
      errorMessage = "CNPJ já cadastrado no sistema.";
    } else if (error.code === "42P10") {
      errorMessage = "Erro de configuração no banco de dados. Por favor, contate o suporte.";
    } else if (error.message && error.message.includes("violates row-level security policy")) {
      errorMessage = "Erro de permissão: Você não tem permissão para criar organizações.";
    } else if (error.message && error.message.includes("constraint")) {
      errorMessage = "Erro de estrutura do banco de dados. Por favor, contate o suporte técnico.";
    } else if (error.message && error.message.includes("Foreign key")) {
      errorMessage = "Erro de referência: Verifique se todos os valores são válidos.";
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(`Erro ao criar empresa: ${errorMessage}`);
    
    // Log additional details for debugging
    if (error.details) {
      console.error("Detalhes do erro:", error.details);
    }
    if (error.hint) {
      console.error("Dica do erro:", error.hint);
    }
  };

  const handleDatabaseConfigError = () => {
    console.error("🛑 Erro de configuração do banco de dados detectado");
    toast.error("Erro de configuração no banco de dados. Por favor, contate o suporte técnico.");
  };

  const handleEmailError = (error: any) => {
    console.error("🛑 Erro ao enviar email:", error);
    toast.error("Empresa criada, mas houve um erro ao enviar o email. Nossa equipe será notificada.");
  };

  const handleEmailProviderIssue = (domain: string) => {
    console.error(`🛑 Problema conhecido com provedor: ${domain}`);
    toast.error(`Empresa criada com sucesso, mas detectamos que o email ${domain} pode ter problemas de recebimento. Considere usar um Gmail ou outro provedor como alternativa.`);
  };

  const handlePostCreationError = (error: any) => {
    console.error("🛑 Erro ao processar pós-criação da empresa:", error);
    toast.error("Empresa criada parcialmente. A empresa foi criada, mas houve um erro no processamento. A equipe será notificada.");
  };

  const handleUnexpectedError = (error: any) => {
    console.error("🛑 Erro não tratado ao criar empresa:", error);
    console.error("Stack trace:", new Error().stack);
    
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
