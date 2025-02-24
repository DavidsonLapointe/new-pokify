
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export default function Auth() {
  const [defaultTab, setDefaultTab] = useState<"login" | "signup">("login");
  const { user } = useUser();
  const location = useLocation();

  // Se já estiver autenticado, redireciona
  if (user) {
    // Verifica se é admin para redirecionar corretamente
    const isAdmin = user.role === 'leadly_employee';
    const redirectTo = isAdmin ? '/admin/profile' : '/organization/profile';
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <h1 className="text-xl font-semibold text-primary">Leadly</h1>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Bem-vindo à Leadly</CardTitle>
            <CardDescription>
              Faça login ou crie sua conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => setDefaultTab(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onSignUpClick={() => setDefaultTab("signup")} />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm onLoginClick={() => setDefaultTab("login")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
