
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ConfirmRegistrationForm } from "@/components/admin/organizations/ConfirmRegistrationForm";
import type { Organization } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportForm } from "@/components/admin/organizations/SupportForm";
import { TermsDialog, PrivacyPolicyDialog, SupportFormDialog } from "@/components/admin/organizations/LegalDocumentsDialogs";
import { RegistrationHeader } from "@/components/admin/organizations/RegistrationHeader";

export default function ConfirmRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { toast } = useToast();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  
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
            setOrganization({
              id: data.id,
              name: data.name,
              nomeFantasia: data.nome_fantasia || data.name,
              cnpj: data.cnpj,
              plan: data.plan,
              planName: data.planName || "Professional",
              status: data.status,
              pendingReason: data.pending_reason,
              contractStatus: data.contract_status,
              paymentStatus: data.payment_status,
              registrationStatus: data.registration_status,
              email: data.email,
              phone: data.phone,
              adminName: data.admin_name,
              adminEmail: data.admin_email,
              users: [],
              integratedCRM: data.integrated_crm,
              integratedLLM: data.integrated_llm,
              contractSignedAt: data.contract_signed_at,
              createdAt: data.created_at,
              address: {
                logradouro: data.logradouro,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep
              }
            });
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
    contractStatus: "pending" as const,
    paymentStatus: "pending" as const,
    registrationStatus: "pending" as const,
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
      
      if (id || activeOrganization?.id) {
        const orgId = id || activeOrganization.id;
        
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ 
            registration_status: 'completed',
            status: data.acceptTerms ? 'active' : 'pending',
            pending_reason: data.acceptTerms ? null : 'payment' 
          })
          .eq('id', orgId);
          
        if (updateError) {
          console.error("Erro ao atualizar organização:", updateError);
          throw updateError;
        }
        
        // Create auth account if needed
        // This part would integrate with your auth system
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
      <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <RegistrationHeader />

        <Card className="w-full shadow-lg border-[#E5DEFF]">
          <CardHeader className="border-b border-[#E5DEFF] bg-[#F1F0FB] rounded-t-lg">
            <CardTitle className="text-[#6E59A5]">Confirmar Registro</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para concluir seu cadastro
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ConfirmRegistrationForm 
              organization={activeOrganization} 
              onSubmit={handleSubmit}
              onShowTerms={() => setShowTerms(true)}
              onShowPrivacyPolicy={() => setShowPrivacyPolicy(true)} 
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
    </div>
  );
}
