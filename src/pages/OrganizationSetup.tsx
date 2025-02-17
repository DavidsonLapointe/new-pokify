
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PaymentGatewayDialog } from "@/components/organization/plans/PaymentGatewayDialog";

const setupSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SetupFormData = z.infer<typeof setupSchema>;

export default function OrganizationSetup() {
  const { setupToken } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SetupFormData) => {
    try {
      // Aqui implementaríamos a chamada para definir a senha
      console.log("Definindo senha para o token:", setupToken);
      setShowPayment(true);
    } catch (error) {
      toast({
        title: "Erro ao configurar senha",
        description: "Não foi possível salvar sua senha. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configure seu acesso</CardTitle>
          <CardDescription>
            Defina sua senha e configure seu método de pagamento para começar a usar a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Continuar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <PaymentGatewayDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        package={{
          name: "Valor Pro Rata",
          credits: 0,
          price: 99.90
        }}
      />
    </div>
  );
}
