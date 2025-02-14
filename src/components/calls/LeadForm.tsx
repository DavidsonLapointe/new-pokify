
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LeadFormData } from "@/schemas/leadFormSchema";
import { UseFormReturn } from "react-hook-form";

interface LeadFormProps {
  form: UseFormReturn<LeadFormData>;
  contactType: "phone" | "email";
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  handleContactValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: LeadFormData) => void;
  showCancelButton?: boolean;
  onCancel?: () => void;
}

export function LeadForm({
  form,
  contactType,
  hasPhoneIntegration,
  hasEmailIntegration,
  handleContactValueChange,
  onSubmit,
  showCancelButton,
  onCancel,
}: LeadFormProps) {
  return (
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
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {showCancelButton ? "Cadastrar Lead" : "Iniciar Contato"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
