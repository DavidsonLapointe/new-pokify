
import { useState } from "react";
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
import { createSubscription } from "@/services/subscriptionService";

// A chave pública do Stripe foi movida para as variáveis do projeto
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? '');

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

  const handlePaymentMethodCreated = (pmId: string) => {
    setPaymentMethodId(pmId);
  };

  const handleSubmit = async (data: ConfirmRegistrationFormData) => {
    try {
      setIsProcessing(true);

      if (!paymentMethodId) {
        toast.error("Por favor, adicione um método de pagamento válido.");
        return;
      }

      // Criar assinatura no Stripe
      const priceId = planPrices[organization.plan];
      if (!priceId) {
        toast.error("Plano inválido");
        return;
      }

      const subscriptionResult = await createSubscription({
        organizationId: organization.id.toString(),
        paymentMethodId,
        priceId
      });

      if (subscriptionResult.status === 'active') {
        await onSubmit(data);
        toast.success("Cadastro confirmado com sucesso!");
      } else {
        toast.error("Erro ao processar pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao confirmar cadastro:", error);
      toast.error("Erro ao confirmar cadastro. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const appearance: Appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#9b87f5',
    },
  };

  const options: StripeElementsOptions = {
    mode: 'payment' as const,
    amount: 1099,
    currency: 'brl',
    appearance,
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <CompanyDataSection organization={organization} />
        <PersonalDataSection form={form} />
        <PasswordSection form={form} />
        <AddressSection form={form} />

        <Elements stripe={stripePromise} options={options}>
          <PaymentForm 
            onPaymentMethodCreated={handlePaymentMethodCreated}
            isLoading={isProcessing}
          />
        </Elements>

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
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : "Confirmar Cadastro"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
