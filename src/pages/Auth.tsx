
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Mock authentication logic - automatically redirect based on URL parameter
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    
    if (role === 'leadly_employee') {
      console.log("Redirecting mock leadly_employee to /admin/dashboard");
      navigate('/admin/dashboard');
    } else {
      console.log("Redirecting mock admin to /organization/dashboard");
      navigate('/organization/dashboard');
    }
  }, [navigate]);

  // Still show login form, but it's not required for navigation
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center">
      <AuthForm />
    </div>
  );
}

export default Auth;
