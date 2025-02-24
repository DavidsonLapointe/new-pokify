
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserStatus } from "@/types";

export const useAuthLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Erro ao fazer login:", error);
        toast.error("Erro ao fazer login. Verifique seu email.");
        return;
      }

      toast.success("Email de confirmação enviado! Verifique sua caixa de entrada.");
      console.log("Link de confirmação enviado para:", email);
    } catch (error) {
      console.error("Erro inesperado ao fazer login:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallback = async () => {
    setIsLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao obter sessão:", error);
        toast.error("Erro ao obter sessão. Tente novamente.");
        return;
      }

      if (session) {
        const { user } = session;

        const mockOrganization = {
          id: "1",
          name: "Leadly",
          nomeFantasia: "Leadly",
          plan: "Professional",
          users: [],
          status: "active" as UserStatus,
          integratedCRM: null,
          integratedLLM: "OpenAI",
          email: "contato@leadly.com",
          phone: "(11) 99999-9999",
          cnpj: "12.345.678/0001-90",
          adminName: "João Silva",
          adminEmail: "joao.silva@leadly.com",
          createdAt: new Date().toISOString()
        };

        const mockUser: User = {
          id: user.id,
          name: user.user_metadata.name || "",
          email: user.email || "",
          phone: "",
          role: "leadly_employee",
          status: "active",
          createdAt: new Date().toISOString(),
          lastAccess: new Date().toISOString(),
          permissions: [],
          logs: [],
          organization: mockOrganization,
          avatar: ""
        };

        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success("Login realizado com sucesso!");
        window.location.href = "/dashboard";
      } else {
        toast.error("Sessão não encontrada. Tente novamente.");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro durante o callback:", error);
      toast.error("Erro ao completar o login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, handleCallback };
};
