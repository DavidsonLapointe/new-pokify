import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LockIcon, AlertCircle, CreditCard } from "lucide-react";
import { TermsLink, PrivacyPolicyLink } from "./LegalDocumentsLinks";
import type { Organization } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { 
  stripePromise, 
  validateStripeConfig, 
  getInitialStripeStatus,
  type StripeConfigStatus 
} from "@/utils/stripeUtils";

const confirmRegistrationSchema = z.object({
  // Company information (editable fields)
  razaoSocial: z.string().min(2, "Razão social deve ter pelo menos 2 caracteres"),
  nomeFantasia: z.string().min(2, "Nome fantasia deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  // Address information
  logradouro: z.string().min(2, "Endereço deve ter pelo menos 2 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  // Administrator information
  adminName: z.string().min(2, "Nome do administrador deve ter pelo menos 2 caracteres"),
  adminEmail: z.string().email("Email do administrador inválido"),
  // User credentials
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso e a política de privacidade",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type ConfirmRegistrationValues = z.infer<typeof confirmRegistrationSchema>;

interface ConfirmRegistrationFormProps {
  organization: Organization | null;
  onSubmit: (data: any) => Promise<void>;
  onShowTerms: () => void;
  onShowPrivacyPolicy: () => void;
  onShowPayment?: () => void;
}

// Component that renders the Stripe Payment Element
const StripePaymentSection = ({ planName, planValue }: { planName: string, planValue: number }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeStatus, setStripeStatus] = useState<StripeConfigStatus>(getInitialStripeStatus());
  
  useEffect(() => {
    console.log("Inicializando seção de pagamento do Stripe");
    
    const checkStripeConfig = async () => {
      try {
        const status = await validateStripeConfig();
        setStripeStatus(status);
      } catch (error) {
        console.error("Erro ao verificar configuração do Stripe:", error);
        setStripeStatus({
          valid: false,
          message: "Erro ao verificar configuração do Stripe"
        });
      }
    };
    
    checkStripeConfig();
  }, []);
  
  const options = {
    mode: 'payment' as const,
    currency: 'brl',
    amount: planValue * 100, // Converter para centavos
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#6E59A5',
        borderRadius: '4px',
      },
      rules: {
        '.Input': {
          borderColor: '#E5DEFF',
        },
      },
    },
    payment_method_types: ['card'] as string[]
  };

  if (!stripeStatus.valid) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Erro na configuração do Stripe</h3>
            <p className="text-xs mt-1 text-red-700">{stripeStatus.message}</p>
            <p className="text-xs mt-2 text-red-700">
              Para que o Stripe funcione corretamente, certifique-se de que a variável de ambiente 
              STRIPE_PUBLIC_KEY está configurada corretamente nas variáveis de ambiente do Supabase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p><strong>Erro ao carregar Stripe:</strong> {error}</p>
        </div>
      )}
      
      <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <h3 className="text-base font-medium text-purple-800">Detalhes do Pagamento</h3>
        </div>
        <p className="text-purple-700 mb-2">Plano: <strong>{planName || "Professional"}</strong></p>
        <p className="text-purple-700 mb-4">Valor a ser pago: <strong>R$ {(planValue || 99.90).toFixed(2)}</strong></p>
      </div>
      
      <Elements stripe={stripePromise} options={options}>
        <PaymentElementContainer 
          onLoaded={() => {
            console.log("Payment element loaded successfully!");
            setLoading(false);
          }} 
          onError={(err) => {
            console.error("Stripe error:", err);
            setError(err);
            setLoading(false);
          }}
          isLoading={loading} 
        />
      </Elements>
    </div>
  );
};

// Separate component to use the Stripe hooks inside Elements provider
const PaymentElementContainer = ({ 
  onLoaded, 
  onError, 
  isLoading 
}: { 
  onLoaded: () => void, 
  onError: (error: string) => void,
  isLoading: boolean
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  useEffect(() => {
    console.log("PaymentElementContainer rendered");
    console.log("Stripe available:", !!stripe);
    console.log("Elements available:", !!elements);
    
    if (stripe && elements) {
      console.log('Stripe Elements está pronto');
      onLoaded();
    }
  }, [stripe, elements, onLoaded]);

  if (!stripe || !elements) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6E59A5]" />
      </div>
    );
  }

  return (
    <div className="min-h-[200px]">
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-[#6E59A5]" />
          <span className="ml-2 text-gray-600">Carregando formulário de pagamento...</span>
        </div>
      )}
      <div className={isLoading ? 'hidden' : 'block space-y-4'}>
        <PaymentElement 
          className="mb-4" 
          onReady={() => {
            console.log("PaymentElement is ready");
            onLoaded();
          }}
          onLoadError={(event) => {
            console.error("PaymentElement load error:", event);
            onError(event.error?.message || "Erro ao carregar formulário de pagamento");
          }}
          options={{
            paymentMethodOrder: ['card'],
            wallets: {
              googlePay: 'never',
              applePay: 'never'
            }
          }}
        />
        <p className="text-sm text-gray-600">
          Os dados do seu cartão são processados de forma segura pelo Stripe.
        </p>
      </div>
    </div>
  );
};

export const ConfirmRegistrationForm = ({ 
  organization, 
  onSubmit,
  onShowTerms,
  onShowPrivacyPolicy,
  onShowPayment
}: ConfirmRegistrationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [planValue, setPlanValue] = useState<number>(99.90);
  const [planName, setPlanName] = useState<string>("");
  
  const form = useForm<ConfirmRegistrationValues>({
    resolver: zodResolver(confirmRegistrationSchema),
    defaultValues: {
      // Company information - making sure to use organization data if available
      razaoSocial: organization?.name || "",
      nomeFantasia: organization?.nomeFantasia || "",
      phone: organization?.phone || "",
      // Pre-fill with organization address if available
      logradouro: organization?.address?.logradouro || "",
      numero: organization?.address?.numero || "",
      complemento: organization?.address?.complemento || "",
      bairro: organization?.address?.bairro || "",
      cidade: organization?.address?.cidade || "",
      estado: organization?.address?.estado || "",
      cep: organization?.address?.cep || "",
      // Admin information
      adminName: organization?.adminName || "",
      adminEmail: organization?.adminEmail || "",
      // User credentials
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Buscar o nome e valor do plano quando o componente carrega
  useEffect(() => {
    if (organization) {
      const fetchPlanDetails = async () => {
        try {
          const { data, error } = await supabase
            .from('plans')
            .select('name, price')
            .eq('id', organization.plan)
            .single();
          
          if (error) {
            console.error("Erro ao buscar detalhes do plano:", error);
            return;
          }
          
          if (data) {
            setPlanName(data.name);
            setPlanValue(data.price);
            console.log("Detalhes do plano carregados:", data.name, data.price);
          }
        } catch (error) {
          console.error("Erro ao buscar detalhes do plano:", error);
        }
      };
      
      fetchPlanDetails();
    }
  }, [organization]);

  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, '');
    value = value.slice(0, 11);
    
    if (value.length > 0) {
      if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        value = `(${value}`;
      }
      
      if (value.length > 10) {
        value = `${value.slice(0, 10)}-${value.slice(10)}`;
      }
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name: 'phone',
        value
      }
    };
    
    form.setValue("phone", value);
  };

  const handleProceedToPayment = async () => {
    const formValid = await form.trigger();
    if (formValid) {
      setShowPaymentStep(true);
    }
  };

  const handleFormSubmit = async (data: ConfirmRegistrationValues) => {
    try {
      setSubmitting(true);
      
      if (!organization) {
        throw new Error("Dados da organização não encontrados");
      }
      
      // Registrar o usuário na auth do Supabase
      console.log("Criando conta de usuário na auth do Supabase...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.adminEmail, // Use the potentially updated admin email
        password: data.password,
        options: {
          data: {
            name: data.adminName, // Use the potentially updated admin name
            organization_id: organization.id
          }
        }
      });
      
      if (authError) {
        console.error("Erro ao criar usuário:", authError);
        toast.error("Erro ao criar usuário: " + authError.message);
        setSubmitting(false);
        return;
      }
      
      console.log("Usuário criado com sucesso:", authData.user?.id);
      
      // Proceed to payment if a payment handler is provided and we're not already showing payment
      if (onShowPayment && !showPaymentStep) {
        onShowPayment();
      }
      
      // Prosseguir com o restante do fluxo
      await onSubmit(data);
      
    } catch (error: any) {
      console.error("Erro ao processar formulário:", error);
      toast.error("Erro ao processar formulário: " + (error.message || "Ocorreu um erro durante o processamento"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {!showPaymentStep ? (
          <>
            {/* Company Information Card */}
            <Card className="border-[#E5DEFF]">
              <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
                <CardTitle className="text-[#6E59A5] text-lg">Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Razão Social</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomeFantasia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Nome Fantasia</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-left w-full">CNPJ</Label>
                      <div className="flex items-center gap-1 text-gray-500">
                        <LockIcon size={14} />
                        <span className="text-xs">Não editável</span>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#F8F6FF] border border-[#E5DEFF] text-[#8E9196]">
                      {organization?.cnpj}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Telefone da Empresa</FormLabel>
                        <FormControl>
                          <Input 
                            value={formatPhone(field.value || '')}
                            onChange={handlePhoneChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-left w-full">Plano</Label>
                      <div className="flex items-center gap-1 text-gray-500">
                        <LockIcon size={14} />
                        <span className="text-xs">Não editável</span>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#F8F6FF] border border-[#E5DEFF] text-[#8E9196]">
                      {planName || "Professional"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Administrator Information */}
            <Card className="border-[#E5DEFF]">
              <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
                <CardTitle className="text-[#6E59A5] text-lg">Dados do Administrador</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adminName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Nome do Administrador</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adminEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Email do Administrador</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-[#E5DEFF]">
              <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
                <CardTitle className="text-[#6E59A5] text-lg">Endereço</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">CEP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logradouro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Logradouro</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Número</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complemento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Complemento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Bairro</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Estado</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Password and Terms */}
            <Card className="border-[#E5DEFF]">
              <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
                <CardTitle className="text-[#6E59A5] text-lg">Credenciais</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full">Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Senha" {...field} />
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
                        <FormLabel className="text-left w-full">Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirme sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    {...form.register("acceptTerms")}
                  />
                  <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-left">
                    Eu li e concordo com os <TermsLink onClick={onShowTerms} /> e a <PrivacyPolicyLink onClick={onShowPrivacyPolicy} />.
                  </Label>
                </div>
                {form.formState.errors.acceptTerms && (
                  <p className="text-sm text-red-500">{form.formState.errors.acceptTerms.message}</p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleProceedToPayment}
                disabled={submitting}
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
              >
                Avançar para Pagamento
              </Button>
            </div>
          </>
        ) : (
          <>
            <Card className="border-[#E5DEFF]">
              <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
                <CardTitle className="text-[#6E59A5] text-lg">Pagamento da Mensalidade</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-purple-700 mb-2">Plano: <strong>{planName}</strong></p>
                  <p className="text-purple-700">Valor a ser pago: <strong>R$ {planValue.toFixed(2)}</strong></p>
                </div>
                <StripePaymentSection planName={planName} planValue={planValue} />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => setShowPaymentStep(false)}
                variant="outline"
                className="border-[#9b87f5] text-[#9b87f5]"
              >
                Voltar
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
              >
                {submitting ? "Processando..." : "Concluir Pagamento"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
};
