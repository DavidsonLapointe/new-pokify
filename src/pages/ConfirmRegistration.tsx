
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmRegistrationForm } from "@/components/admin/organizations/ConfirmRegistrationForm";
import type { Organization } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Confirmar Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfirmRegistrationForm organization={organization} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
