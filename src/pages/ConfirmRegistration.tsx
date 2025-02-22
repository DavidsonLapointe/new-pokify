import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmRegistrationForm } from "@/components/admin/organizations/ConfirmRegistrationForm";
import type { Organization } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ConfirmRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Dados simulados para preview
  const mockOrganization: Organization = {
    id: 1,
    name: "Empresa Exemplo LTDA",
    nomeFantasia: "Empresa Exemplo",
    cnpj: "12.345.678/0001-90",
    plan: "professional",
    status: "pending",
    pendingReason: "contract_signature",
    email: "contato@exemplo.com",
    phone: "(11) 99999-9999",
    adminName: "João Silva",
    adminEmail: "joao@exemplo.com",
    users: [],
    integratedCRM: null,
    integratedLLM: null,
    createdAt: new Date().toISOString(),
  };
  
  // Use os dados simulados se não houver dados no location.state
  const organization = location.state?.organization || mockOrganization;

  const handleSubmit = async (data: any) => {
    try {
      // Em produção, aqui você enviaria os dados para a API
      console.log("Dados do formulário:", data);
      
      toast({
        title: "Cadastro confirmado!",
        description: "Você já pode fazer login no sistema.",
      });

      // Redireciona para o login
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
        {/* Logo e Mensagem de Boas-vindas */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/a6f95a9f-b22e-4925-94e8-c48a07388c46.png"
              alt="Leadly Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">
            Bem-vindo à Leadly!
          </h1>
          <p className="text-[#8E9196] max-w-2xl mx-auto">
            Complete seu cadastro para começar a transformar suas chamadas em oportunidades de negócio
          </p>
        </div>

        {/* Formulário */}
        <Card className="w-full shadow-lg border-[#E5DEFF]">
          <CardHeader className="border-b border-[#E5DEFF] bg-[#F1F0FB] rounded-t-lg">
            <CardTitle className="text-[#6E59A5]">Confirmar Registro</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para concluir seu cadastro
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ConfirmRegistrationForm organization={organization} onSubmit={handleSubmit} />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 mb-8 text-sm text-[#8E9196]">
          Precisa de ajuda? Entre em contato com nosso suporte
        </div>
      </div>
    </div>
  );
}
