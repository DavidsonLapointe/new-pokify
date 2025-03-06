
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PaymentGatewayDialog } from "@/components/organization/plans/PaymentGatewayDialog";
import { supabase } from "@/integrations/supabase/client";
import { RemainingStepsCard } from "@/components/organization/setup/RemainingStepsCard";
import { LoaderCircle } from "lucide-react";

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
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [setupCompleted, setSetupCompleted] = useState(false);
  
  // Status for all steps
  const [contractSigned, setContractSigned] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Get the organization ID from the URL query parameters
  useEffect(() => {
    const getOrgIdFromUrl = () => {
      const urlParams = new URLSearchParams(location.search);
      return urlParams.get('token') || setupToken;
    };
    
    const loadOrganization = async () => {
      const orgId = getOrgIdFromUrl();
      
      if (!orgId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching organization:", error);
          throw error;
        }
        
        if (data) {
          setOrganization(data);
          
          // Check status of each step
          setContractSigned(!!data.contract_signed_at);
          setPaymentCompleted(data.pending_reason !== 'pro_rata_payment' && 
                             data.pending_reason !== 'contract_signature');
          setRegistrationCompleted(data.status === 'active');
        }
      } catch (error) {
        console.error("Error loading organization:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível recuperar os dados da organização.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadOrganization();
  }, [setupToken, location.search, toast]);

  const onSubmit = async (values: SetupFormData) => {
    try {
      if (!organization) {
        throw new Error("Dados da organização não encontrados");
      }
      
      // Here you would normally call an API to set the password and activate the user
      console.log("Definindo senha para o token:", setupToken || organization.id);
      console.log("Senha:", values.password);
      
      // Update organization status in database
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ 
          status: 'active',
          pending_reason: null 
        })
        .eq('id', organization.id);
        
      if (updateError) {
        console.error("Error updating organization:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Senha definida com sucesso!",
        description: "Seu cadastro foi concluído.",
      });
      
      setRegistrationCompleted(true);
      setSetupCompleted(true);
      
    } catch (error) {
      console.error("Error setting password:", error);
      toast({
        title: "Erro ao configurar senha",
        description: "Não foi possível salvar sua senha. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Carregando...</h2>
        </div>
      </div>
    );
  }
  
  // If setup is completed, show remaining steps
  if (setupCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-2xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-primary mb-2">Leadly</h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              Cadastro Concluído
            </h2>
            <p className="text-gray-600 mt-2">
              Sua senha foi definida com sucesso!
            </p>
          </div>
          
          {organization && (
            <RemainingStepsCard 
              organizationId={organization.id}
              contractSigned={contractSigned}
              paymentCompleted={paymentCompleted}
              registrationCompleted={true} // This step is now completed
              hideHomeButton={true}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        {organization && (contractSigned || paymentCompleted) && (
          <div className="mb-6">
            <RemainingStepsCard 
              organizationId={organization.id}
              contractSigned={contractSigned}
              paymentCompleted={paymentCompleted}
              registrationCompleted={registrationCompleted}
              hideHomeButton={true}
            />
          </div>
        )}
      
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Configure seu acesso</CardTitle>
            <CardDescription>
              Defina sua senha para começar a usar a plataforma.
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
                  Concluir Cadastro
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

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
