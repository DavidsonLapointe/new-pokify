import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const { session } = useAuth();
  const { user, loading } = useUser();

  // Se tiver sessão e usuário carregado, redireciona baseado no papel
  if (session && user && !loading) {
    // Se for admin, vai para dashboard administrativo
    if (user.role === 'leadly_employee') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Senão vai para dashboard da organização
    return <Navigate to="/organization/dashboard" replace />;
  }

  // Se não tiver sessão, mostra página de login
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
