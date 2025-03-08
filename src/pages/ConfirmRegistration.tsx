import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ConfirmRegistrationForm } from "@/components/admin/organizations/ConfirmRegistrationForm";
import type { Organization, OrganizationPendingReason } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportForm } from "@/components/admin/organizations/SupportForm";
import { TermsDialog, PrivacyPolicyDialog, SupportFormDialog } from "@/components/admin/organizations/LegalDocumentsDialogs";
import { RegistrationHeader } from "@/components/admin/organizations/RegistrationHeader";
import { formatOrganizationData } from "@/utils/organizationUtils";
import { PaymentGatewayDialog } from "@/components/organization/plans/PaymentGatewayDialog";

export default function ConfirmRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { toast } = useToast();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (id) {
          const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            // Use the formatOrganizationData utility to properly convert DB data to Organization type
            setOrganization(formatOrganizationData(data));
          }
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da organização",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganization();
  }, [id, toast]);
  
  const mockOrganization: Organization = {
    id: "1",
    name: "Empresa Exemplo LTDA",
    nomeFantasia: "Empresa Exemplo",
    cnpj: "12.345.678/0001-90",
    plan: "professional",
    planName: "Professional",
    status: "pending",
    pendingReason: "contract_signature",
    contractStatus: "pending",
    paymentStatus: "pending",
    registrationStatus: "pending",
    email: "contato@exemplo.com",
    phone: "(11) 99999-9999",
    adminName: "João Silva",
    adminEmail: "joao@exemplo.com",
    users: [],
    integratedCRM: null,
    integratedLLM: null,
    contractSignedAt: null,
    createdAt: new Date().toISOString(),
  };
  
  const activeOrganization = organization || location.state?.organization || mockOrganization;

  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados do formulário:", data);
      setSelectedPaymentMethod(data.paymentMethod || 'card');
      
      if (id || activeOrganization?.id) {
        const orgId = id || activeOrganization.id;
        
        // Define a valid pendingReason value
        const pendingReason: OrganizationPendingReason = data.acceptTerms ? null : "pro_rata_payment";
        
        // Atualizar o status da organização
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ 
            registration_status: 'completed',
            status: data.acceptTerms ? 'active' : 'pending',
            pending_reason: pendingReason,
            // Update address fields
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento || '',
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            cep: data.cep,
            payment_method: data.paymentMethod || 'card'
          })
          .eq('id', orgId);
          
        if (updateError) {
          console.error("Erro ao atualizar organização:", updateError);
          throw updateError;
        }
        
        // Atualizar o status do perfil do usuário para ativo
        // Isso é importante porque criamos o perfil como 'pending' antes
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            status: 'active'
          })
          .eq('email', activeOrganization?.adminEmail)
          .eq('organization_id', orgId);
          
        if (profileError) {
          console.error("Erro ao atualizar perfil do usuário:", profileError);
          // Não vamos falhar completamente se não conseguirmos atualizar o perfil
          // O trigger update_organization_status deve cuidar disso
        }
      }
      
      toast({
        title: "Cadastro confirmado!",
        description: "Você já pode fazer login no sistema.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao confirmar cadastro",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
      <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 pb-16">
        <RegistrationHeader />

        <Card className="w-full shadow-lg border-[#E5DEFF]">
          <CardHeader className="border-b border-[#E5DEFF] bg-[#F1F0FB] rounded-t-lg">
            <CardTitle className="text-[#6E59A5]">Confirmar Registro</CardTitle>
            <CardDescription>
              Complete seus dados cadastrais para concluir seu acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ConfirmRegistrationForm 
              organization={activeOrganization} 
              onSubmit={handleSubmit}
              onShowTerms={() => setShowTerms(true)}
              onShowPrivacyPolicy={() => setShowPrivacyPolicy(true)}
              onShowPayment={() => setShowPayment(true)}
            />
          </CardContent>
        </Card>

        <div className="text-center mt-6 mb-8">
          <button 
            onClick={() => setShowSupportForm(true)}
            className="text-sm text-[#8E9196] hover:underline transition-all"
          >
            Precisa de ajuda? Entre em contato com nosso suporte
          </button>
        </div>
      </div>

      <TermsDialog 
        open={showTerms} 
        onOpenChange={setShowTerms}
      />

      <PrivacyPolicyDialog 
        open={showPrivacyPolicy} 
        onOpenChange={setShowPrivacyPolicy}
      />

      <SupportFormDialog 
        open={showSupportForm} 
        onOpenChange={setShowSupportForm}
      >
        <SupportForm onClose={() => setShowSupportForm(false)} />
      </SupportFormDialog>
      
      <PaymentGatewayDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        package={{
          name: "Valor Pro Rata",
          credits: 0,
          price: 99.90
        }}
      />
    </div>
  );
}
