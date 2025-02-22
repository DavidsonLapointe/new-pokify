
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

interface ConfirmRegistrationFormProps {
  organization: Organization;
  onSubmit: (data: ConfirmRegistrationFormData) => void;
}

export function ConfirmRegistrationForm({ organization, onSubmit }: ConfirmRegistrationFormProps) {
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

  const handleSubmit = async (data: ConfirmRegistrationFormData) => {
    try {
      await onSubmit(data);
      toast.success("Cadastro confirmado com sucesso!");
    } catch (error) {
      toast.error("Erro ao confirmar cadastro. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <CompanyDataSection organization={organization} />
        <PersonalDataSection form={form} />
        <PasswordSection form={form} />
        <AddressSection form={form} />

        {/* Termos de Uso */}
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
                  Li e aceito os termos de uso e política de privacidade
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
          >
            Confirmar Cadastro
          </Button>
        </div>
      </form>
    </Form>
  );
}
