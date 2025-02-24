
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

export const useAuthLogin = (onSuccess: () => void) => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
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

      onSuccess();
      
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

  const handlePasswordRecovery = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsLoading(false);
      toast.success("Se o email existir em nossa base, você receberá instruções para redefinir sua senha.");
      return true;
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
    handlePasswordRecovery,
    setError
  };
};
