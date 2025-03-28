
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Organization, OrganizationPendingReason } from "@/types/organization-types";
import { formatOrganizationData } from "@/utils/organizationUtils";

// Mockando a função do Supabase para desenvolvimento
const mockSupabaseQuery = async () => {
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: {
      token: "mock-token",
      used: false,
      used_at: null,
      organization_id: "org-123",
      organizations: {
        id: "org-123",
        name: "Empresa Teste",
        nomeFantasia: "Teste Ltd.",
        status: "pending",
        pendingReason: "user_validation",
        adminName: "Administrador Teste",
        adminEmail: "admin@teste.com",
        contractStatus: "pending",
        paymentStatus: "pending",
        registrationStatus: "pending",
        createdAt: new Date().toISOString()
      }
    },
    error: null
  };
};

const ConfirmRegistration = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [pendingReason, setPendingReason] = useState<OrganizationPendingReason>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Token inválido");
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        
        // Usar a versão de mock em vez da chamada real ao Supabase
        const { data, error } = await mockSupabaseQuery();

        if (error || !data) {
          console.error("Erro ao verificar token:", error);
          toast.error("Token inválido ou expirado");
          navigate("/");
          return;
        }

        // Verificar se o convite já foi usado
        if (data.used) {
          toast.error("Este convite já foi utilizado");
          navigate("/");
          return;
        }

        // Formatar os dados da organização
        const orgData = formatOrganizationData(data.organizations);
        setOrganization(orgData);
        setPendingReason(orgData.pendingReason);

        console.log("Organização encontrada:", orgData);
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        toast.error("Erro ao verificar token");
       navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senha
    if (password.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    
    setPasswordError("");
    setVerifying(true);
    
    try {
      if (!organization || !token) {
        toast.error("Dados inválidos");
        return;
      }
      
      // Simular o processamento do cadastro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Cadastro confirmado com sucesso!");
      
      // Redirecionar para a página de login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao confirmar cadastro:", error);
      toast.error("Erro ao confirmar cadastro");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Cadastro</CardTitle>
            <CardDescription>
              Complete seu cadastro para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {organization ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organização</Label>
                  <Input
                    id="organization"
                    value={organization.name}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Administrador</Label>
                  <Input
                    id="name"
                    value={organization.adminName}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={organization.adminEmail}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>

                {pendingReason === "contract_signature" ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Você precisa assinar o contrato para ativar sua conta.
                      Após confirmar seu cadastro, você receberá instruções por email.
                    </p>
                  </div>
                ) : pendingReason === "pro_rata_payment" ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Você precisa realizar o pagamento pro-rata para ativar sua conta.
                      Após confirmar seu cadastro, você receberá instruções por email.
                    </p>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    "Confirmar Cadastro"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-red-500">
                  Não foi possível carregar os dados da organização.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/")}
                >
                  Voltar para o início
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{" "}
              <a
                href="/login"
                className="text-primary hover:underline"
              >
                Faça login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmRegistration;
