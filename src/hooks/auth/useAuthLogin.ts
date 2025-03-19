
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
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

      // Busca perfil com status e role usando single()
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status, role, permissions')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw new Error("Erro ao carregar perfil do usuário");
      }

      if (!profile) {
        console.error("No profile found");
        throw new Error("Perfil não encontrado");
      }

      // Se for admin, redireciona para o dashboard da organização
      if (profile.role === 'admin') {
        console.log("Admin login successful");
        navigate('/organization/dashboard');
        toast.success('Login realizado com sucesso!');
        return;
      }

      // Se for leadly_employee ou leadly_master, redireciona para a página de prompts
      if (profile.role === 'leadly_employee' || profile.role === 'leadly_master') {
        console.log("Leadly employee/master login successful");
        navigate('/admin/prompt');
        toast.success('Login realizado com sucesso!');
        return;
      }

      // Para outros usuários, verifica se está ativo
      if (profile.status !== 'active') {
        throw new Error("Sua empresa não possui uma assinatura ativa. Entre em contato com o suporte.");
      }

      // Se chegou aqui, é um usuário normal ativo
      console.log("Regular user login successful");
      navigate('/organization/dashboard');
      toast.success('Login realizado com sucesso!');

    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Erro ao fazer login";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha inválidos";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login
  };
};
