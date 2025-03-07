
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
import { TermsLink, PrivacyPolicyLink } from "@/components/admin/organizations/LegalDocumentsLinks";
import type { Organization } from "@/types";

const confirmRegistrationSchema = z.object({
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
}

export const ConfirmRegistrationForm = ({ 
  organization, 
  onSubmit,
  onShowTerms,
  onShowPrivacyPolicy
}: ConfirmRegistrationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ConfirmRegistrationValues>({
    resolver: zodResolver(confirmRegistrationSchema),
    defaultValues: {
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
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          type="password"
          id="password"
          placeholder="Senha"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>
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
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aguarde...
          </>
        ) : (
          "Concluir Cadastro"
        )}
      </Button>
    </form>
  );
};
