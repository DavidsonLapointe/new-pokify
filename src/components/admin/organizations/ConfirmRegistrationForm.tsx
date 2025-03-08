
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
import { Loader2, LockIcon } from "lucide-react";
import { TermsLink, PrivacyPolicyLink } from "./LegalDocumentsLinks";
import type { Organization } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Usando a chave pública do Stripe que está configurada no Supabase
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51OgQ0mF7m1pQh7H8PgQXHUAwaXA3arTJ4vhRPaXcap3EldT3T3JU4HgQZoqqERWDkKklrDnGCnptSFVKiWrXL7sR00bEOcDlwq');

const confirmRegistrationSchema = z.object({
  // Company information (editable fields)
  razaoSocial: z.string().min(2, "Razão social deve ter pelo menos 2 caracteres"),
  nomeFantasia: z.string().min(2, "Nome fantasia deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
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
const StripePaymentSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Log info about Stripe public key
  useEffect(() => {
    console.log("Stripe public key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'Using fallback key');
    console.log("Initializing Stripe with options...");
  }, []);
  
  const options = {
    mode: 'payment' as const,
    currency: 'brl',
    amount: 9990, // R$ 99,90 (em centavos)
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
  };

  return (
    <div className="relative">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p><strong>Erro ao carregar Stripe:</strong> {error}</p>
          <p className="text-sm mt-1">Verifique se a chave pública do Stripe está configurada corretamente.</p>
        </div>
      )}
      
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
  
  // Efeito para detectar quando o Stripe está pronto
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
            onError(event.message);
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
  
  const form = useForm<ConfirmRegistrationValues>({
    resolver: zodResolver(confirmRegistrationSchema),
    defaultValues: {
      // Company information - making sure to use organization data if available
      razaoSocial: organization?.name || "",
      nomeFantasia: organization?.nomeFantasia || "",
      email: organization?.email || "",
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
      
      // Proceed to payment if a payment handler is provided
      if (onShowPayment) {
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left w-full">Email da Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left w-full">Telefone da Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  {organization?.planName}
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

        {/* Payment Information with Stripe Elements */}
        <Card className="border-[#E5DEFF]">
          <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
            <CardTitle className="text-[#6E59A5] text-lg">Dados do Cartão de Crédito</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <StripePaymentSection />
            
            {/* Botão para carregar cartões de testes do Stripe */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">Modo de teste do Stripe</p>
              <p className="text-xs text-gray-600 mb-2">Como você está no modo de teste, pode usar os seguintes dados:</p>
              <div className="text-xs bg-white p-2 border border-gray-200 rounded mb-2">
                <p className="font-mono">Número do cartão: 4242 4242 4242 4242</p>
                <p className="font-mono">Data de validade: Qualquer data futura</p>
                <p className="font-mono">CVV: Qualquer 3 dígitos</p>
                <p className="font-mono">CEP: Qualquer 5 dígitos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde...
              </>
            ) : (
              "Concluir Cadastro"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
