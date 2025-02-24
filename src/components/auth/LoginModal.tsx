import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations (
            *
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile) {
        throw new Error("Perfil não encontrado");
      }

      if (profile.status !== "active") {
        if (profile.role === "leadly_employee") {
          toast.error("Seu usuário não está ativo. Por favor, entre em contato com o suporte.");
        } else {
          const { data: activeAdmin } = await supabase
            .from('profiles')
            .select('email')
            .eq('organization_id', profile.organization.id)
            .eq('role', 'admin')
            .eq('status', 'active')
            .single();

          toast.error(
            `Seu usuário não está ativo. Por favor, entre em contato com o administrador: ${activeAdmin?.email || 'Não encontrado'}`
          );
        }
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      if (profile.role !== "leadly_employee" && profile.organization?.status !== "active") {
        toast.error("Sua empresa não está ativa no sistema. Entre em contato com o suporte.");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      await supabase
        .from('profiles')
        .update({ last_access: new Date().toISOString() })
        .eq('id', profile.id);

      const organizationData = profile.organization ? {
        id: parseInt(profile.organization.id, 10),
        name: profile.organization.name,
        nomeFantasia: profile.organization.nome_fantasia || profile.organization.name,
        plan: profile.organization.plan,
        users: [],
        status: profile.organization.status,
        pendingReason: profile.organization.pending_reason === "null" ? null : profile.organization.pending_reason,
        integratedCRM: profile.organization.integrated_crm,
        integratedLLM: profile.organization.integrated_llm,
        email: profile.organization.email,
        phone: profile.organization.phone || "",
        cnpj: profile.organization.cnpj,
        adminName: profile.organization.admin_name,
        adminEmail: profile.organization.admin_email,
        contractSignedAt: profile.organization.contract_signed_at,
        createdAt: profile.organization.created_at || "",
        logo: profile.organization.logo,
        address: profile.organization.logradouro ? {
          logradouro: profile.organization.logradouro,
          numero: profile.organization.numero || "",
          complemento: profile.organization.complemento || "",
          bairro: profile.organization.bairro || "",
          cidade: profile.organization.cidade || "",
          estado: profile.organization.estado || "",
          cep: profile.organization.cep || "",
        } : undefined
      } : null;

      updateUser({
        id: parseInt(profile.id, 10),
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
        role: profile.role,
        status: profile.status,
        permissions: [],
        createdAt: profile.created_at || "",
        lastAccess: profile.last_access || "",
        logs: [],
        organization: organizationData,
        avatar: profile.avatar || "",
      });

      onOpenChange(false);
      
      if (profile.role === "leadly_employee") {
        navigate("/admin/dashboard");
      } else {
        navigate("/organization/dashboard");
      }

    } catch (error: any) {
      console.error("Erro no login:", error);
      setError(error.message || "Ocorreu um erro ao tentar fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsLoading(false);
      toast.success("Se o email existir em nossa base, você receberá instruções para redefinir sua senha.");
      setMode("login");
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente.");
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
