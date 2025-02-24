
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { User } from "@/types";
import { mockUsers } from "@/types/mock-users";
import { useUser } from "@/contexts/UserContext";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Função auxiliar para encontrar um administrador ativo
  const findActiveAdmin = (users: User[], organization: any) => {
    return users.find(user => 
      user.organization.id === organization.id && 
      user.status === "active" && 
      user.permissions.includes("users")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Simula busca do usuário
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        setError("Usuário não encontrado");
        setIsLoading(false);
        return;
      }

      // Verifica se é funcionário Leadly
      if (user.role === "leadly_employee") {
        if (user.status !== "active") {
          const activeAdmin = findActiveAdmin(mockUsers, { id: 1 }); // Leadly company
          toast.error(
            `Seu usuário não está ativo. Por favor, entre em contato com o administrador: ${activeAdmin?.email || 'suporte@leadly.com'}`
          );
          setIsLoading(false);
          return;
        }
        
        updateUser(user);
        onOpenChange(false);
        navigate("/admin/dashboard");
        return;
      }

      // Para usuários de organizações clientes
      if (user.organization.status !== "active") {
        toast.error("Sua empresa não está ativa no sistema. Entre em contato com o suporte.");
        setIsLoading(false);
        return;
      }

      if (user.status !== "active") {
        const activeAdmin = findActiveAdmin(mockUsers, user.organization);
        toast.error(
          `Seu usuário não está ativo. Por favor, entre em contato com o administrador: ${activeAdmin?.email || 'Não encontrado'}`
        );
        setIsLoading(false);
        return;
      }

      // Login bem sucedido
      updateUser(user);
      onOpenChange(false);
      
      // Redireciona baseado no tipo de usuário
      if (user.role === "admin" || user.role === "seller") {
        navigate("/organization/dashboard");
      }

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Reset password for:", email);
      setIsLoading(false);
      toast.success("Se o email existir em nossa base, você receberá instruções para redefinir sua senha.");
      setMode("login");
    } catch (error) {
      setError("Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente.");
      setIsLoading(false);
    }
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
