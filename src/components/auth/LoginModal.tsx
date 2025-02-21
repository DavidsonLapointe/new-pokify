
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular verificação de status da empresa
      const mockCheckOrganizationStatus = async () => {
        const mockResponse = {
          status: "active",
          email: "admin@empresa.com"
        };
        return mockResponse;
      };

      const orgStatus = await mockCheckOrganizationStatus();

      if (orgStatus.status === "pending") {
        setError(`O acesso ainda não foi liberado. Por favor, verifique o email ${orgStatus.email} para instruções sobre o pagamento da primeira mensalidade.`);
        setIsLoading(false);
        return;
      }

      // Se chegou aqui, a empresa está ativa e pode prosseguir com o login
      console.log("Login efetuado com sucesso:", { email, password });
      setIsLoading(false);
      onOpenChange(false);
      
      // Redireciona para a área da organização
      navigate('/organization');
    } catch (error) {
      setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Aqui implementaríamos a lógica de recuperação de senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Reset password for:", email);
      setIsLoading(false);
      alert("Se o email existir em nossa base, você receberá instruções para redefinir sua senha.");
      setMode("login");
    } catch (error) {
      setError("Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente.");
      setIsLoading(false);
    }
  };

  // Função para fazer login automático (ambiente de demonstração)
  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      navigate('/organization');
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Acessar Plataforma" : "Recuperar Senha"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={mode === "login" ? handleSubmit : handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode === "login" && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="text-sm px-0"
              onClick={() => {
                setMode(mode === "login" ? "forgot" : "login");
                setError(null);
              }}
            >
              {mode === "login" ? "Esqueceu sua senha?" : "Voltar para login"}
            </Button>
          </div>

          {/* Botão de login automático para ambiente de demonstração */}
          <Button 
            type="button"
            className="w-full bg-green-600 hover:bg-green-700 mb-2"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde...
              </>
            ) : (
              <>
                Entrar (Demonstração)
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde...
              </>
            ) : (
              <>
                {mode === "login" ? "Entrar" : "Recuperar Senha"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
