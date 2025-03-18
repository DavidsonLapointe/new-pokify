
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TermsDialog } from "@/components/admin/organizations/LegalDocumentsDialogs";
import { MOCK_TOOLS } from "@/components/organization/modules/module-constants";
import { ModuleCarousel } from "@/components/organization/modules/ModuleCarousel";
import { ModuleDetails } from "@/components/organization/modules/ModuleDetails";
import { ConfirmContractDialog } from "@/components/organization/modules/dialogs/ConfirmContractDialog";
import { PaymentProcessingDialog } from "@/components/organization/modules/dialogs/PaymentProcessingDialog";
import { PaymentSuccessDialog } from "@/components/organization/modules/dialogs/PaymentSuccessDialog";
import { PaymentFailedDialog } from "@/components/organization/modules/dialogs/PaymentFailedDialog";
import { CancelModuleDialog } from "@/components/organization/modules/dialogs/CancelModuleDialog";
import { SetupContactInfo, Tool } from "@/components/organization/modules/types";

const OrganizationModules = () => {
  // Estados
  const [tools, setTools] = useState<Tool[]>(MOCK_TOOLS);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isSetupContactDialogOpen, setIsSetupContactDialogOpen] = useState(false);
  const [isPaymentProcessingDialogOpen, setIsPaymentProcessingDialogOpen] = useState(false);
  const [isPaymentSuccessDialogOpen, setIsPaymentSuccessDialogOpen] = useState(false);
  const [isPaymentFailedDialogOpen, setIsPaymentFailedDialogOpen] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [cancelModuleId, setCancelModuleId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [setupContactInfo, setSetupContactInfo] = useState<SetupContactInfo>({
    name: "",
    phone: ""
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  // Inicializa com o primeiro módulo selecionado ao carregar a página
  useEffect(() => {
    if (tools.length > 0) {
      setSelectedTool(tools[0]);
    }
  }, []);

  // Handlers para ações de contrato
  const handleContractTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setIsConfirmDialogOpen(true);
  };

  const handleCancelTool = (toolId: string) => {
    setCancelModuleId(toolId);
    setIsCancelDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedToolId) return;
    
    const tool = tools.find(t => t.id === selectedToolId);
    if (!tool) return;

    // Inicia processamento do pagamento
    setIsConfirmDialogOpen(false);
    processPayment(tool);
  };

  const processPayment = async (tool: Tool) => {
    setProcessingPayment(true);
    setIsPaymentProcessingDialogOpen(true);
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular resultado do pagamento (sucesso ou falha)
      const paymentSuccessful = Math.random() > 0.2; // 80% de chance de sucesso
      
      setIsPaymentProcessingDialogOpen(false);
      
      if (paymentSuccessful) {
        // Se o pagamento foi bem-sucedido, abre o diálogo para coletar informações de contato
        setIsPaymentSuccessDialogOpen(true);
        
        // Criar título financeiro automaticamente
        await createFinancialTitle(tool);
      } else {
        // Se o pagamento falhou, mostra o diálogo de falha
        setIsPaymentFailedDialogOpen(true);
        
        // Enviar e-mail para o suporte (simulado)
        sendSupportEmail(tool);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
      setIsPaymentProcessingDialogOpen(false);
      setIsPaymentFailedDialogOpen(true);
    } finally {
      setProcessingPayment(false);
    }
  };

  const createFinancialTitle = async (tool: Tool) => {
    try {
      // Simulação de criação de título financeiro
      console.log(`Criando título financeiro para o módulo ${tool.title} no valor de ${tool.price}`);
    } catch (error) {
      console.error("Erro ao criar título financeiro:", error);
    }
  };

  const sendSupportEmail = async (tool: Tool) => {
    try {
      // Simulação de envio de e-mail para o suporte
      console.log(`Enviando e-mail para o suporte sobre falha na contratação do módulo ${tool.title}`);
    } catch (error) {
      console.error("Erro ao enviar e-mail para o suporte:", error);
    }
  };

  const handleSubmitSetupContact = async () => {
    if (!setupContactInfo.name || !setupContactInfo.phone) {
      toast.error("Por favor, preencha todos os campos de contato.");
      return;
    }
    
    try {
      // Simulação de envio das informações de contato
      console.log("Informações de contato para setup:", setupContactInfo);
      
      toast.success("Módulo contratado com sucesso! Nossa equipe entrará em contato em breve para iniciar o setup.");
      
      setIsPaymentSuccessDialogOpen(false);
      setSetupContactInfo({ name: "", phone: "" });
      
      // Atualizar o status do módulo para "contracted"
      if (selectedToolId) {
        setTools(tools.map(tool => {
          if (tool.id === selectedToolId) {
            return { ...tool, status: "contracted" as const, badgeLabel: "Contratada" };
          }
          return tool;
        }));
      }
      
      // Limpar estados
      setSelectedToolId(null);
    } catch (error) {
      console.error("Erro ao enviar informações de contato:", error);
      toast.error("Erro ao enviar informações de contato. Tente novamente.");
    }
  };

  const confirmCancelation = () => {
    if (!cancelModuleId || !cancelReason.trim()) {
      toast.error("Por favor, informe o motivo do cancelamento");
      return;
    }
    
    const tool = tools.find(t => t.id === cancelModuleId);
    if (!tool) return;

    toast.success(`Módulo "${tool.title}" cancelado com sucesso!`);
    setIsCancelDialogOpen(false);
    setCancelModuleId(null);
    setCancelReason("");
  };

  // Função para abrir os termos de uso
  const handleOpenTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTermsDialogOpen(true);
  };

  // Handler para quando um tool é selecionado
  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(selectedTool && selectedTool.id === tool.id ? null : tool);
  };

  // Handler para mudar as informações de contato
  const handleContactInfoChange = (info: Partial<SetupContactInfo>) => {
    setSetupContactInfo(prev => ({ ...prev, ...info }));
  };

  // Handlers para configuração de módulos
  const handleConfigureModule = (id: string) => {
    console.log("Configurar módulo", id);
  };

  const handleEditConfiguration = (id: string) => {
    console.log("Editar configuração do módulo", id);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Módulos do Sistema</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie as ferramentas de IA disponíveis para sua empresa
          </p>
        </div>

        <ModuleCarousel
          tools={tools}
          selectedTool={selectedTool}
          onSelectTool={handleSelectTool}
          onCancelModule={handleCancelTool}
        />

        {/* Detalhes do módulo selecionado */}
        {selectedTool && (
          <ModuleDetails
            selectedTool={selectedTool}
            onContractModule={handleContractTool}
            onConfigureModule={handleConfigureModule}
            onEditConfiguration={handleEditConfiguration}
          />
        )}

        {/* Diálogos */}
        <ConfirmContractDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
          selectedTool={tools.find(t => t.id === selectedToolId) || null}
          tools={tools}
          onConfirm={confirmAction}
          onOpenTerms={handleOpenTerms}
        />

        <PaymentProcessingDialog 
          open={isPaymentProcessingDialogOpen} 
        />

        <PaymentSuccessDialog
          open={isPaymentSuccessDialogOpen}
          onOpenChange={setIsPaymentSuccessDialogOpen}
          setupContactInfo={setupContactInfo}
          onContactInfoChange={handleContactInfoChange}
          onSubmit={handleSubmitSetupContact}
        />

        <PaymentFailedDialog
          open={isPaymentFailedDialogOpen}
          onOpenChange={setIsPaymentFailedDialogOpen}
        />

        <CancelModuleDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          cancelModuleId={cancelModuleId}
          cancelReason={cancelReason}
          onCancelReasonChange={setCancelReason}
          onConfirm={confirmCancelation}
          tools={tools}
        />

        <TermsDialog 
          open={isTermsDialogOpen} 
          onOpenChange={setIsTermsDialogOpen}
          moduleId={selectedToolId || undefined}
          moduleName={tools.find(t => t.id === selectedToolId)?.title}
        />
      </div>
    </TooltipProvider>
  );
};

export default OrganizationModules;
