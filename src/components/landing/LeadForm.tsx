
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido").max(11),
});

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadForm({ isOpen, onClose }: LeadFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from('leads_leadly')
        .insert([
          {
            name: values.name,
            phone: values.phone,
          }
        ]);

      if (error) {
        console.error('Erro ao salvar lead:', error);
        toast({
          variant: "destructive",
          title: "Erro ao enviar formulário",
          description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
          duration: 5000,
        });
        return;
      }

      toast({
        title: "Obrigado pelo interesse!",
        description: "Nossa equipe comercial entrará em contato em breve.",
        duration: 5000,
      });
      
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao processar submissão:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        duration: 5000,
      });
    }
  }

  function formatPhone(value: string) {
    // Remove formatação atual para trabalhar apenas com números
    value = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos (DDD + número)
    value = value.slice(0, 11);
    
    // Se houver números, aplica a formatação
    if (value.length > 0) {
      // Formatar DDD
      if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        value = `(${value}`;
      }
      
      // Formatar número
      if (value.length > 10) {
        value = `(${value.slice(1, 3)}) ${value.slice(5, 10)}-${value.slice(10)}`;
      }
    }
    
    return value;
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    form.setValue("phone", value);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicite um contato</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para ser contactado por nossa equipe comercial.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
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
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(00) 00000-0000" 
                      value={formatPhone(field.value)}
                      onChange={handlePhoneChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Enviar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
