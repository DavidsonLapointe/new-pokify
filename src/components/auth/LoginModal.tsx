
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
  const [email, setEmail] = useState("");
  
  const {
    isLoading,
    error,
    handleLogin,
    handlePasswordRecovery,
    setError
  } = useAuthLogin(() => onOpenChange(false));

  const handleForgotPassword = async (email: string) => {
    const success = await handlePasswordRecovery(email);
    if (success) {
      setMode("login");
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
