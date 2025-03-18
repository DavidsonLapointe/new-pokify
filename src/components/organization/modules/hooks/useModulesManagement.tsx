
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tool, SetupContactInfo } from "@/components/organization/modules/types";
import { MOCK_TOOLS } from "@/components/organization/modules/module-constants";

export const useModulesManagement = () => {
  // States
  const [tools, setTools] = useState<Tool[]>(MOCK_TOOLS);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
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

  // Initialize with the first module selected on load
  useEffect(() => {
    if (tools.length > 0) {
      setSelectedTool(tools[0]);
    }
  }, []);

  // Handlers for contract actions
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

    // Starts payment processing
    setIsConfirmDialogOpen(false);
    processPayment(tool);
  };

  const processPayment = async (tool: Tool) => {
    setProcessingPayment(true);
    setIsPaymentProcessingDialogOpen(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment result (success or failure)
      const paymentSuccessful = Math.random() > 0.2; // 80% success chance
      
      setIsPaymentProcessingDialogOpen(false);
      
      if (paymentSuccessful) {
        // If payment is successful, open dialog to collect contact information
        setIsPaymentSuccessDialogOpen(true);
        
        // Automatically create financial title
        await createFinancialTitle(tool);
      } else {
        // If payment failed, show failure dialog
        setIsPaymentFailedDialogOpen(true);
        
        // Send email to support (simulated)
        sendSupportEmail(tool);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment. Please try again.");
      setIsPaymentProcessingDialogOpen(false);
      setIsPaymentFailedDialogOpen(true);
    } finally {
      setProcessingPayment(false);
    }
  };

  const createFinancialTitle = async (tool: Tool) => {
    try {
      // Simulation of financial title creation
      console.log(`Creating financial title for module ${tool.title} with value ${tool.price}`);
    } catch (error) {
      console.error("Error creating financial title:", error);
    }
  };

  const sendSupportEmail = async (tool: Tool) => {
    try {
      // Simulation of sending email to support
      console.log(`Sending email to support about failure in contracting module ${tool.title}`);
    } catch (error) {
      console.error("Error sending email to support:", error);
    }
  };

  const handleSubmitSetupContact = async () => {
    if (!setupContactInfo.name || !setupContactInfo.phone) {
      toast.error("Please fill in all contact fields.");
      return;
    }
    
    try {
      // Simulation of sending contact information
      console.log("Setup contact information:", setupContactInfo);
      
      toast.success("Module contracted successfully! Our team will contact you soon to start setup.");
      
      setIsPaymentSuccessDialogOpen(false);
      setSetupContactInfo({ name: "", phone: "" });
      
      // Update module status to "contracted"
      if (selectedToolId) {
        setTools(tools.map(tool => {
          if (tool.id === selectedToolId) {
            return { ...tool, status: "contracted" as const, badgeLabel: "Contratada" };
          }
          return tool;
        }));
      }
      
      // Clear states
      setSelectedToolId(null);
    } catch (error) {
      console.error("Error sending contact information:", error);
      toast.error("Error sending contact information. Please try again.");
    }
  };

  const confirmCancelation = () => {
    if (!cancelModuleId || !cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    
    const tool = tools.find(t => t.id === cancelModuleId);
    if (!tool) return;

    toast.success(`Module "${tool.title}" canceled successfully!`);
    setIsCancelDialogOpen(false);
    setCancelModuleId(null);
    setCancelReason("");
  };

  // Function to open terms of use
  const handleOpenTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTermsDialogOpen(true);
  };

  // Handler for when a tool is selected
  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(selectedTool && selectedTool.id === tool.id ? null : tool);
  };

  // Handler to change contact information
  const handleContactInfoChange = (info: Partial<SetupContactInfo>) => {
    setSetupContactInfo(prev => ({ ...prev, ...info }));
  };

  // Handlers for module configuration
  const handleConfigureModule = (id: string) => {
    console.log("Configure module", id);
  };

  const handleEditConfiguration = (id: string) => {
    console.log("Edit module configuration", id);
  };

  return {
    // States
    tools,
    isConfirmDialogOpen,
    isCancelDialogOpen,
    isPaymentProcessingDialogOpen,
    isPaymentSuccessDialogOpen,
    isPaymentFailedDialogOpen,
    isTermsDialogOpen,
    selectedTool,
    cancelModuleId,
    cancelReason,
    setupContactInfo,
    processingPayment,
    
    // State setters
    setIsConfirmDialogOpen,
    setIsCancelDialogOpen,
    setIsPaymentSuccessDialogOpen,
    setIsPaymentFailedDialogOpen,
    setIsTermsDialogOpen,
    setCancelReason,
    
    // Handlers
    handleContractTool,
    handleCancelTool,
    confirmAction,
    handleSubmitSetupContact,
    confirmCancelation,
    handleOpenTerms,
    handleSelectTool,
    handleContactInfoChange,
    handleConfigureModule,
    handleEditConfiguration
  };
};
