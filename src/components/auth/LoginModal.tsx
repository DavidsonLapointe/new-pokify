
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useAuthLogin } from "@/hooks/auth/useAuthLogin";
import { useUser } from "@/contexts/UserContext";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUser();
  const { handleLogin, loading } = useAuthLogin(setUser);

  const onLogin = async (email: string, password: string) => {
    try {
      await handleLogin(email, password);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      // Implement forgot password logic here
      setMode("login");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao recuperar senha");
      return false;
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "forgot" : "login");
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Acessar Plataforma" : "Recuperar Senha"}
          </DialogTitle>
        </DialogHeader>

        {mode === "login" ? (
          <LoginForm
            onSubmit={onLogin}
            onForgotPassword={toggleMode}
            isLoading={loading}
            error={error}
          />
        ) : (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBackToLogin={toggleMode}
            isLoading={loading}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
