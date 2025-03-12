
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Always show login form, but it's not required for navigation
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
      <AuthForm />
    </div>
  );
}

export default Auth;
