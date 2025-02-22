
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Organization } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

const confirmRegistrationSchema = z.object({
  // Dados pessoais
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
  // Endereço
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  cep: z.string().min(8, "CEP inválido"),
  // Termos
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos de uso"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"]
});

type ConfirmRegistrationFormData = z.infer<typeof confirmRegistrationSchema>;

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
        {/* Dados da Empresa */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
            <h3 className="text-lg font-medium text-[#1A1F2C]">Dados da Empresa</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F1F0FB] rounded-lg">
            <div>
              <FormLabel className="text-[#6E59A5]">Razão Social</FormLabel>
              <Input value={organization.name} readOnly className="bg-white border-[#E5DEFF]" />
            </div>
            <div>
              <FormLabel className="text-[#6E59A5]">Nome Fantasia</FormLabel>
              <Input value={organization.nomeFantasia} readOnly className="bg-white border-[#E5DEFF]" />
            </div>
            <div>
              <FormLabel className="text-[#6E59A5]">CNPJ</FormLabel>
              <Input value={organization.cnpj} readOnly className="bg-white border-[#E5DEFF]" />
            </div>
          </div>
        </div>

        {/* Seus Dados */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
            <h3 className="text-lg font-medium text-[#1A1F2C]">Seus Dados</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#6E59A5]">Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-[#E5DEFF]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#6E59A5]">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="border-[#E5DEFF]" />
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
                  <FormLabel className="text-[#6E59A5]">Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" className="border-[#E5DEFF]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Defina sua Senha */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
            <h3 className="text-lg font-medium text-[#1A1F2C]">Defina sua Senha</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#6E59A5]">Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="border-[#E5DEFF]" />
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
                  <FormLabel className="text-[#6E59A5]">Confirme a Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="border-[#E5DEFF]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-[#9b87f5] rounded-full" />
            <h3 className="text-lg font-medium text-[#1A1F2C]">Endereço da Empresa</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#6E59A5]">Logradouro</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Rua, Avenida, etc." className="border-[#E5DEFF]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#6E59A5]">Número</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-[#E5DEFF]" />
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
                  <FormLabel className="text-[#6E59A5]">Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Apto, Sala, etc." className="border-[#E5DEFF]" />
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
                  <FormLabel className="text-[#6E59A5]">Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-[#E5DEFF]" />
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
                  <FormLabel className="text-[#6E59A5]">Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-[#E5DEFF]" />
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
                  <FormLabel className="text-[#6E59A5]">Estado</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="UF" maxLength={2} className="border-[#E5DEFF]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#6E59A5]">CEP</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="00000-000" className="border-[#E5DEFF]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
