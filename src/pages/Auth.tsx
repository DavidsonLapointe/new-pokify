
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const { session } = useAuth();
  const { user, loading } = useUser();

  console.log("Auth page - Session:", session);
  console.log("Auth page - User:", user);
  console.log("Auth page - Loading:", loading);

  // Se tiver sessão e usuário carregado, redireciona baseado no papel
  if (session && user && !loading) {
    // Se for funcionário Leadly, vai para dashboard administrativo
    if (user.role === 'leadly_employee') {
      console.log("Redirecionando leadly_employee para /admin/dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Se for admin de organização, vai para dashboard da organização
    if (user.role === 'admin') {
      console.log("Redirecionando admin para /organization/dashboard");
      return <Navigate to="/organization/dashboard" replace />;
    }
    // Se não tiver role definido, desconecta o usuário
    console.log("Usuário sem role definido, desconectando...");
    return <Navigate to="/" replace />;
  }

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
