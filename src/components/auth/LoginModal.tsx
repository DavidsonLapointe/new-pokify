
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useAuthLogin } from "@/hooks/auth/useAuthLogin";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, handleCallback } = useAuthLogin();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await login(email);
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
            onSubmit={handleLogin}
            onForgotPassword={toggleMode}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBackToLogin={toggleMode}
            isLoading={isLoading}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
