
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se já estiver autenticado, redireciona usando o navigate
    if (user) {
      const redirectTo = user.role === 'leadly_employee' ? '/admin/profile' : '/organization/profile';
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Se o login for bem sucedido, o useEffect acima vai redirecionar
      // quando o estado do user for atualizado
    } catch (error: any) {
      setError(error.message);
      toast.error("Erro ao fazer login");
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
