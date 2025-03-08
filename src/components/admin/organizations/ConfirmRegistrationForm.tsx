
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { TermsLink, PrivacyPolicyLink } from "./LegalDocumentsLinks";
import type { Organization } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const confirmRegistrationSchema = z.object({
  // Company information (non-editable)
  // Address information
  logradouro: z.string().min(2, "Endereço deve ter pelo menos 2 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  // User credentials
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso e a política de privacidade",
  }),
});

type ConfirmRegistrationValues = z.infer<typeof confirmRegistrationSchema>;

interface ConfirmRegistrationFormProps {
  organization: Organization | null;
  onSubmit: (data: any) => Promise<void>;
  onShowTerms: () => void;
  onShowPrivacyPolicy: () => void;
  onShowPayment?: () => void;
}

export const ConfirmRegistrationForm = ({ 
  organization, 
  onSubmit,
  onShowTerms,
  onShowPrivacyPolicy,
  onShowPayment
}: ConfirmRegistrationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Password, 3: Payment
  
  const form = useForm<ConfirmRegistrationValues>({
    resolver: zodResolver(confirmRegistrationSchema),
    defaultValues: {
      // Pre-fill with organization address if available
      logradouro: organization?.address?.logradouro || "",
      numero: organization?.address?.numero || "",
      complemento: organization?.address?.complemento || "",
      bairro: organization?.address?.bairro || "",
      cidade: organization?.address?.cidade || "",
      estado: organization?.address?.estado || "",
      cep: organization?.address?.cep || "",
      // User credentials
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
        email: organization.adminEmail,
        password: data.password,
        options: {
          data: {
            name: organization.adminName,
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

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      const addressFields = ['logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
      form.trigger(addressFields as any);
      
      const hasErrors = addressFields.some(field => form.formState.errors[field as keyof ConfirmRegistrationValues]);
      if (!hasErrors) {
        setStep(2);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Company Information Card (Non-editable) */}
        <Card className="border-[#E5DEFF]">
          <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
            <CardTitle className="text-[#6E59A5] text-lg">Dados da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Razão Social</Label>
                <div className="p-2 rounded bg-gray-50 border">{organization?.name}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Nome Fantasia</Label>
                <div className="p-2 rounded bg-gray-50 border">{organization?.nomeFantasia}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">CNPJ</Label>
                <div className="p-2 rounded bg-gray-50 border">{organization?.cnpj}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Plano</Label>
                <div className="p-2 rounded bg-gray-50 border">{organization?.planName}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Address Information */}
        {step === 1 && (
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
                      <FormLabel>CEP</FormLabel>
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
                      <FormLabel>Logradouro</FormLabel>
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
                      <FormLabel>Número</FormLabel>
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
                      <FormLabel>Complemento</FormLabel>
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
                      <FormLabel>Bairro</FormLabel>
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
                      <FormLabel>Cidade</FormLabel>
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
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                >
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Password and Terms */}
        {step === 2 && (
          <Card className="border-[#E5DEFF]">
            <CardHeader className="bg-[#F1F0FB] border-b border-[#E5DEFF]">
              <CardTitle className="text-[#6E59A5] text-lg">Credenciais</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    {...form.register("acceptTerms")}
                  />
                  <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                    Eu li e concordo com os <TermsLink onClick={onShowTerms} /> e a <PrivacyPolicyLink onClick={onShowPrivacyPolicy} />.
                  </Label>
                </div>
                {form.formState.errors.acceptTerms && (
                  <p className="text-sm text-red-500">{form.formState.errors.acceptTerms.message}</p>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  onClick={prevStep}
                  variant="outline"
                >
                  Voltar
                </Button>
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
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
};
