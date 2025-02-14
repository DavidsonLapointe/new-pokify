
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import OrganizationLayout from "@/components/OrganizationLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const leadFormSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().optional(),
  contactType: z.enum(["phone", "email"]),
  contactValue: z.string().refine((val) => {
    if (!val) return false;
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return val.includes("@") ? emailRegex.test(val) : phoneRegex.test(val);
  }, "Contato inválido")
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function OrganizationNewCall() {
  const { toast } = useToast();
  const hasPhoneIntegration = true; // Você ajustará isso com base na sua lógica
  const hasEmailIntegration = true; // Você ajustará isso com base na sua lógica

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contactType: hasPhoneIntegration ? "phone" : "email",
      contactValue: "",
    },
  });

  const contactType = form.watch("contactType");

  const onSubmit = (data: LeadFormData) => {
    const canProceed = (data.contactType === "phone" && hasPhoneIntegration) ||
                      (data.contactType === "email" && hasEmailIntegration);

    if (!canProceed) {
      toast({
        variant: "destructive",
        title: "Erro ao criar lead",
        description: `Integração com ${data.contactType === "phone" ? "telefone" : "email"} não configurada.`,
      });
      return;
    }

    console.log("Novo lead:", data);
    form.reset();
    
    toast({
      title: "Lead criado com sucesso",
      description: "Você já pode iniciar o contato.",
    });
  };

  const handleContactValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (contactType === "phone") {
      value = value.replace(/\D/g, "");
      
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
      }
    }
    
    form.setValue("contactValue", value);
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Efetuar Ligação</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre um novo lead para iniciar o contato
          </p>
        </div>

        <Card className="max-w-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Contato *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {hasPhoneIntegration && (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="phone" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Telefone
                            </FormLabel>
                          </FormItem>
                        )}
                        {hasEmailIntegration && (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="email" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Email
                            </FormLabel>
                          </FormItem>
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {contactType === "phone" ? "Telefone *" : "Email *"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type={contactType === "email" ? "email" : "text"}
                        placeholder={
                          contactType === "phone" 
                            ? "(11) 99999-9999" 
                            : "exemplo@email.com"
                        }
                        onChange={handleContactValueChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit">
                  Iniciar Contato
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </OrganizationLayout>
  );
}
