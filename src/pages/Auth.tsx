
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";

const Auth = () => {
  const { session } = useAuth();
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && user && !loading) {
      console.log("Auth page - Usuário autenticado:", user);
      
      if (user.role === 'leadly_employee') {
        console.log("Redirecionando leadly_employee para /admin/dashboard");
        navigate('/admin/dashboard');
      } else if (user.role === 'admin') {
        console.log("Redirecionando admin para /organization/dashboard");
        navigate('/organization/dashboard');
      } else {
        console.log("Usuário sem role definido ou inválido:", user.role);
        toast.error("Tipo de usuário não reconhecido");
        navigate('/');
      }
    }
  }, [session, user, loading, navigate]);

  // Se não tiver sessão e não estiver carregando, mostra página de login
  if (!session && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
        <AuthForm />
      </div>
    );
  }

  // Enquanto carrega, mostra loading
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Auth;
