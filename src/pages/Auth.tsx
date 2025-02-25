
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Usuário não encontrado");
      }

      console.log("Login successful, fetching profile...");

      // Busca perfil com status e todas as possíveis organizações
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          role,
          status,
          organization:organization_id (
            id,
            status
          ),
          company:company_leadly_id (
            id,
            razao_social
          )
        `)
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw new Error("Erro ao carregar perfil do usuário");
      }

      if (!profile) {
        console.error("No profile found for user");
        throw new Error("Perfil não encontrado");
      }

      // Verifica status do usuário
      if (profile.status !== 'active') {
        throw new Error("Usuário inativo");
      }

      // Verifica organização baseado no tipo de usuário
      if (profile.role === 'leadly_employee') {
        if (!profile.company) {
          throw new Error("Usuário Leadly sem vínculo com a empresa");
        }
      } else {
        if (!profile.organization) {
          throw new Error("Usuário sem vínculo com organização");
        }
        if (profile.organization.status !== 'active') {
          throw new Error("Organização inativa");
        }
      }

      toast.success("Login realizado com sucesso!");
      navigate('/admin/prompt', { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
      toast.error("Erro ao fazer login: " + error.message);
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
