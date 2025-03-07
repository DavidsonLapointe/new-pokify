
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Organization } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { CompanyDataSection } from "./form-sections/CompanyDataSection";
import { PersonalDataSection } from "./form-sections/PersonalDataSection";
import { PasswordSection } from "./form-sections/PasswordSection";
import { AddressSection } from "./form-sections/AddressSection";
import { confirmRegistrationSchema, ConfirmRegistrationFormData } from "./types";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import { createSubscription, createSetupIntent } from "@/services/subscriptionService";
import { Loader2 } from "lucide-react";

// Ensure the Stripe public key is available
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51OgQ0mF7m1pQh7H8PgQXHUAwaXA3arTJ4vhRPaXcap3EldT3T3JU4HgQZoqqERWDkKklrDnGCnptSFVKiWrXL7sR00bEOcDlwq';
const stripePromise = loadStripe(stripePublicKey);

interface ConfirmRegistrationFormProps {
  organization: Organization;
  onSubmit: (data: ConfirmRegistrationFormData) => void;
  onShowTerms: () => void;
  onShowPrivacyPolicy: () => void;
}

const planPrices: Record<string, string> = {
  basic: import.meta.env.VITE_STRIPE_PRICE_BASIC ?? '',
  professional: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL ?? '',
  enterprise: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE ?? ''
};

export function ConfirmRegistrationForm({ 
  organization, 
  onSubmit,
  onShowTerms,
  onShowPrivacyPolicy 
}: ConfirmRegistrationFormProps) {
  const [paymentMethodId, setPaymentMethodId] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentValidated, setPaymentValidated] = useState(false);
  const [stripeInitialized, setStripeInitialized] = useState(false);
  const [setupIntent, setSetupIntent] = useState<{clientSecret: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const form = useForm<ConfirmRegistrationFormData>({
    resolver: zodResolver(confirmRegistrationSchema),
    defaultValues: {
      name: organization.adminName,
      email: organization.adminEmail,
      phone: organization.phone || "",
      password: "",
      confirmPassword: "",
      logradouro: organization.address?.logradouro || "",
      numero: organization.address?.numero || "",
      complemento: organization.address?.complemento || "",
      bairro: organization.address?.bairro || "",
      cidade: organization.address?.cidade || "",
      estado: organization.address?.estado || "",
      cep: organization.address?.cep || "",
      acceptTerms: false
    }
  });

  useEffect(() => {
    async function initializeStripe() {
      try {
        console.log("Initializing Stripe with public key:", stripePublicKey.substring(0, 10) + "...");
        console.log("Organization ID:", organization.id);
        
        // Direct API call for setup intent to help with debugging
        const setupIntentResult = await createSetupIntent(organization.id.toString());

        if (!setupIntentResult) {
          console.error("Failed to create setup intent: No result returned");
          setInitError("Failed to initialize payment form. Setup intent creation failed.");
          setLoading(false);
          return;
        }

        console.log("Setup intent created:", setupIntentResult);
        
        if (setupIntentResult.clientSecret) {
          setSetupIntent(setupIntentResult);
          setStripeInitialized(true);
        } else {
          console.error("Client secret not found in response");
          setInitError("Failed to initialize payment data: No client secret received");
        }
      } catch (err) {
        console.error("Error initializing Stripe:", err);
        setInitError("Failed to initialize payment system. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (stripePromise) {
      initializeStripe();
    } else {
      setLoading(false);
      setInitError("Stripe key not configured");
    }
  }, [organization.id]);

  const handlePaymentMethodCreated = (pmId: string) => {
    console.log("Payment method created:", pmId);
    setPaymentMethodId(pmId);
    setPaymentValidated(true);
  };

  const handleSubmit = async (data: ConfirmRegistrationFormData) => {
    try {
      setIsProcessing(true);

      if (!paymentMethodId) {
        toast.error("Please add and validate a payment method.");
        return;
      }

      // Get correct price ID based on plan
      const priceId = planPrices[organization.plan];
      if (!priceId) {
        toast.error("Invalid plan");
        return;
      }

      console.log("Creating subscription with payment method:", paymentMethodId);
      console.log("Organization ID:", organization.id);
      console.log("Price ID:", priceId);

      const subscriptionResult = await createSubscription({
        organizationId: organization.id.toString(),
        paymentMethodId,
        priceId
      });

      console.log("Subscription creation result:", subscriptionResult);

      if (subscriptionResult.status === 'active') {
        await onSubmit(data);
        toast.success("Registration confirmed successfully!");
      } else {
        toast.error("Error processing payment. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming registration:", error);
      toast.error("Error confirming registration. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#9b87f5',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '4px',
      colorBackground: '#ffffff'
    },
    rules: {
      '.Input': {
        border: '1px solid #E5DEFF',
        boxShadow: 'none',
        padding: '12px',
      },
      '.Input:focus': {
        border: '1px solid #9b87f5',
      },
      '.Label': {
        color: '#6E59A5',
        fontWeight: '500',
      },
      '.Tab': {
        borderColor: '#E5DEFF',
        color: '#6E59A5',
      },
      '.Tab:hover': {
        color: '#9b87f5',
      },
      '.Tab--selected': {
        borderColor: '#9b87f5',
        color: '#9b87f5',
      },
      '.Error': {
        color: '#FF4D4F',
      }
    }
  };

  // Stripe Elements configuration
  const options: StripeElementsOptions = {
    appearance,
    locale: 'pt-BR',
  };

  // Add clientSecret only when available
  if (setupIntent?.clientSecret) {
    options.clientSecret = setupIntent.clientSecret;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <CompanyDataSection organization={organization} />
        <PersonalDataSection form={form} />
        <PasswordSection form={form} />
        <AddressSection form={form} />

        {loading ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5] mr-3" />
              <span className="text-gray-600">Inicializando método de pagamento...</span>
            </div>
          </div>
        ) : initError ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="py-6 px-4 bg-red-50 border border-red-100 rounded-md text-center">
              <p className="text-red-600 font-medium">{initError}</p>
              <p className="text-red-500 mt-2 text-sm">
                Tente atualizar a página ou entre em contato com o suporte se o problema persistir.
              </p>
              <Button 
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#9b87f5] hover:bg-[#8a74e8]"
              >
                Atualizar página
              </Button>
            </div>
          </div>
        ) : stripeInitialized && setupIntent?.clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm 
              onPaymentMethodCreated={handlePaymentMethodCreated}
              isLoading={isProcessing}
              clientSecret={setupIntent.clientSecret}
            />
          </Elements>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="py-8 text-center">
              <p className="text-red-500 font-medium">Não foi possível carregar o formulário de pagamento.</p>
              <p className="text-gray-600 mt-2">Verifique se as chaves do Stripe estão configuradas corretamente.</p>
              <Button 
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#9b87f5] hover:bg-[#8a74e8]"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#E5DEFF] p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-[#6E59A5]">
                  Li e aceito os{" "}
                  <button
                    type="button"
                    onClick={onShowTerms}
                    className="text-[#9b87f5] hover:underline"
                  >
                    termos de uso
                  </button>{" "}
                  e{" "}
                  <button
                    type="button"
                    onClick={onShowPrivacyPolicy}
                    className="text-[#9b87f5] hover:underline"
                  >
                    política de privacidade
                  </button>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-medium px-8"
            disabled={isProcessing || !paymentValidated}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Confirmar Cadastro"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
