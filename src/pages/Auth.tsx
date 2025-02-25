
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Permissions } from "@/types/permissions";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  // Se já estiver autenticado, redireciona
  if (session) {
    navigate('/admin/prompt', { replace: true });
    return null;
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting login for:", email);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Usuário não encontrado");
      }

      // Busca perfil com status, role e permissões
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status, role, permissions')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw new Error("Erro ao carregar perfil do usuário");
      }

      if (!profile) {
        console.error("No profile found");
        throw new Error("Perfil não encontrado");
      }

      if (profile.status !== 'active') {
        throw new Error("Usuário inativo");
      }

      // Verifica se tem permissão para acessar a página de prompts
      const permissions = profile.permissions as Permissions || {};
      console.log("User permissions:", permissions);

      if (!permissions['prompt'] && profile.role !== 'leadly_employee') {
        console.log("User doesn't have access to prompts page");
        // Se não tem acesso a prompts, tenta redirecionar para dashboard ou perfil
        if (permissions['dashboard']) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/admin/profile', { replace: true });
        }
        return;
      }

      console.log("Login successful!");
      toast.success("Login realizado com sucesso!");
      navigate('/admin/prompt', { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Erro ao fazer login";
      
      // Tratamento de erros específicos
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha inválidos";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Email de recuperação enviado com sucesso");
    } catch (error: any) {
      setError(error.message);
      toast.error("Erro ao enviar email de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <h1 className="text-xl font-semibold text-primary">Leadly</h1>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Bem-vindo à Leadly</CardTitle>
            <CardDescription>
              Faça login para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm 
              onSubmit={handleLogin}
              onForgotPassword={handleForgotPassword}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
