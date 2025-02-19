
import { Organization } from "@/types/organization";
import { createProRataTitle } from "./financialService";

export const updateOrganizationStatus = async (organizationId: number, newStatus: "active" | "inactive" | "pending") => {
  // Em produção, isso seria uma chamada à API
  console.log(`Atualizando status da organização ${organizationId} para ${newStatus}`);
  return true;
};

export const sendInitialContract = async (organization: Organization) => {
  try {
    const adminUser = organization.users.find(user => user.role === "admin");
    if (!adminUser) {
      throw new Error("Usuário admin não encontrado");
    }

    // Criar título pro rata
    const proRataTitle = createProRataTitle(organization, 99.90);
    console.log("Título pro rata criado:", proRataTitle);

    // Enviar email com contrato
    console.log("Enviando email com contrato para:", organization.adminEmail);
    
    // Em produção, aqui teríamos a lógica real de envio do email
    const emailContent = {
      to: organization.adminEmail,
      subject: "Contrato de Adesão - Leadly",
      attachments: ["contrato.pdf"],
      content: `
        Olá ${organization.adminName},
        
        Bem-vindo à Leadly! Segue em anexo o contrato de adesão para sua assinatura.
        
        Para concluir seu cadastro, por favor:
        1. Assine o contrato digitalmente através do link: [LINK_ASSINATURA]
        2. Efetue o pagamento pro rata no valor de R$ 99,90
        
        Após a confirmação do pagamento, sua conta será ativada automaticamente.
        
        Atenciosamente,
        Equipe Leadly
      `
    };

    console.log("Email enviado com sucesso:", emailContent);
    return true;
  } catch (error) {
    console.error("Erro ao enviar contrato:", error);
    throw error;
  }
};

export const activateOrganization = async (organizationId: number) => {
  try {
    await updateOrganizationStatus(organizationId, "active");
    console.log(`Organização ${organizationId} ativada com sucesso`);
    return true;
  } catch (error) {
    console.error("Erro ao ativar organização:", error);
    throw error;
  }
};

export const deactivateOrganization = async (organizationId: number) => {
  try {
    await updateOrganizationStatus(organizationId, "inactive");
    console.log(`Organização ${organizationId} desativada com sucesso`);
    return true;
  } catch (error) {
    console.error("Erro ao desativar organização:", error);
    throw error;
  }
};
