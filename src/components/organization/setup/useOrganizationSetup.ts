
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const setupSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type SetupFormData = z.infer<typeof setupSchema>;

export const useOrganizationSetup = () => {
  const { setupToken } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [setupCompleted, setSetupCompleted] = useState(false);
  
  // Status for all steps
  const [contractSigned, setContractSigned] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  // Get the organization ID from the URL query parameters
  useEffect(() => {
    const getOrgIdFromUrl = () => {
      const urlParams = new URLSearchParams(location.search);
      return urlParams.get('token') || setupToken;
    };
    
    const loadOrganization = async () => {
      const orgId = getOrgIdFromUrl();
      
      if (!orgId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching organization:", error);
          throw error;
        }
        
        if (data) {
          setOrganization(data);
          
          // Check status of each step using the new status columns
          setContractSigned(data.contract_status === 'completed');
          setPaymentCompleted(data.payment_status === 'completed');
          setRegistrationCompleted(data.registration_status === 'completed');
        }
      } catch (error) {
        console.error("Error loading organization:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível recuperar os dados da organização.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadOrganization();
  }, [setupToken, location.search, toast]);

  const handlePasswordSubmit = async (values: SetupFormData) => {
    try {
      if (!organization) {
        throw new Error("Dados da organização não encontrados");
      }
      
      // Here you would normally call an API to set the password and activate the user
      console.log("Definindo senha para o token:", setupToken || organization.id);
      console.log("Senha:", values.password);
      
      // Update organization status in database
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ 
          registration_status: 'completed'
        })
        .eq('id', organization.id);
        
      if (updateError) {
        console.error("Error updating organization:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Senha definida com sucesso!",
        description: "Seu cadastro foi concluído.",
      });
      
      setRegistrationCompleted(true);
      setSetupCompleted(true);
      
    } catch (error) {
      console.error("Error setting password:", error);
      toast({
        title: "Erro ao configurar senha",
        description: "Não foi possível salvar sua senha. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    organization,
    loading,
    setupCompleted,
    contractSigned,
    paymentCompleted,
    registrationCompleted,
    showPayment,
    setShowPayment,
    handlePasswordSubmit
  };
};
