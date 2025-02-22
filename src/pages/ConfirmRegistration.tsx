
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmRegistrationForm } from "@/components/admin/organizations/ConfirmRegistrationForm";
import type { Organization } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function ConfirmRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Em produção, você buscaria os dados da organização usando o token da URL
  // Por enquanto, vamos simular usando state do location
  const organization = location.state?.organization as Organization;

  if (!organization) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Link inválido</h1>
        <p className="mt-4">
          O link de confirmação é inválido ou expirou. 
          Por favor, solicite um novo link.
        </p>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      // Em produção, aqui você enviaria os dados para a API
      console.log("Dados do formulário:", data);
      
      // Simula sucesso
      toast({
        title: "Cadastro confirmado!",
        description: "Você já pode fazer login no sistema.",
      });

      // Redireciona para o login
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erro ao confirmar cadastro",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return <ConfirmRegistrationForm organization={organization} onSubmit={handleSubmit} />;
}
