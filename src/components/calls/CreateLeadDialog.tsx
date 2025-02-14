
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus } from "lucide-react";
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

interface CreateLeadDialogProps {
  hasPhoneIntegration: boolean;
  hasEmailIntegration: boolean;
  onCreateLead: (data: LeadFormData) => void;
}

export function CreateLeadDialog({
  hasPhoneIntegration,
  hasEmailIntegration,
  onCreateLead,
}: CreateLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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

    onCreateLead(data);
    setOpen(false);
    form.reset();
    
    toast({
      title: "Lead criado com sucesso",
      description: "Você já pode iniciar o contato.",
    });
  };

  const handleContactValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (contactType === "phone") {
      // Remove tudo exceto números
      value = value.replace(/\D/g, "");
      
      // Aplica a máscara (XX) XXXXX-XXXX
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
      }
    }
    
    form.setValue("contactValue", value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Lead</DialogTitle>
        </DialogHeader>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Cadastrar Lead
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
