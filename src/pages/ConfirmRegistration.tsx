
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmRegistrationForm } from "@/components/admin/organizations/ConfirmRegistrationForm";
import type { Organization } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportForm } from "@/components/admin/organizations/SupportForm";
import { TermsDialog, PrivacyPolicyDialog, SupportFormDialog } from "@/components/admin/organizations/LegalDocumentsDialogs";
import { RegistrationHeader } from "@/components/admin/organizations/RegistrationHeader";

export default function ConfirmRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  
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
  
  const organization = location.state?.organization || mockOrganization;

  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados do formulário:", data);
      
      if (organization && organization.id) {
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ 
            status: 'active',
            pending_reason: null 
          })
          .eq('id', organization.id);
          
        if (updateError) {
          console.error("Erro ao atualizar organização:", updateError);
          throw updateError;
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
              organization={organization} 
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
